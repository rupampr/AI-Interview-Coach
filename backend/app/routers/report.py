from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
from datetime import datetime
from collections import defaultdict

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.interviews import Interview, Question, Answer
from app.models.reports import Report, Progress
from app.services.llm_service import generate_report_summary

router = APIRouter(prefix="/interview", tags=["report"])


# ---------- Response models ----------

class ReportResponse(BaseModel):
    id: UUID
    interview_id: UUID
    overall_score: Optional[float]
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    improvement_areas: Optional[List[str]]
    summary_text: Optional[str]

    class Config:
        from_attributes = True


class ProgressEntryResponse(BaseModel):
    id: UUID
    interview_id: UUID
    category: Optional[str]
    score: float
    recorded_at: datetime

    class Config:
        from_attributes = True


# ---------- Helpers ----------

def _average(values: list):
    values = [v for v in values if v is not None]
    return round(sum(values) / len(values), 2) if values else None


# ---------- Routes ----------
# NOTE: /progress/history is registered BEFORE /{interview_id}/report
# to avoid FastAPI matching "progress" as an interview_id path param.

@router.get("/progress/history", response_model=List[ProgressEntryResponse])
def get_progress_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(Progress)
        .filter(Progress.user_id == current_user.id)
        .order_by(Progress.recorded_at.asc())
        .all()
    )
    return entries


@router.post("/{interview_id}/report", response_model=ReportResponse)
def generate_report(
    interview_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch interview with ownership check
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this interview.")

    if interview.status != "completed":
        raise HTTPException(status_code=400, detail="Interview is not yet completed.")

    # 2. Prevent duplicate reports (also enforced at DB level via unique constraint)
    existing_report = db.query(Report).filter(Report.interview_id == interview.id).first()
    if existing_report:
        raise HTTPException(status_code=409, detail="A report already exists for this interview.")

    # 3. Fetch all questions + answers for this interview, in order
    questions = (
        db.query(Question)
        .filter(Question.interview_id == interview.id)
        .order_by(Question.order_index)
        .all()
    )

    qa_pairs = []
    for q in questions:
        if not q.answer:
            continue  # shouldn't happen if status == completed, but guard anyway
        qa_pairs.append({
            "question": q.text,
            "answer": q.answer.text,
            "overall_score": q.answer.overall_score,
            "feedback": q.answer.feedback,
            "category": q.category,
        })

    if not qa_pairs:
        raise HTTPException(status_code=400, detail="No answered questions found for this interview.")

    # 4. Compute overall_score in Python (average of per-answer overall_scores)
    overall_score = _average([pair["overall_score"] for pair in qa_pairs])

    # 5. Call the LLM for qualitative summary
    try:
        qualitative = generate_report_summary(qa_pairs)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"Report generation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error calling LLM: {str(e)}")

    # 6. Save the Report row
    report = Report(
        interview_id=interview.id,
        overall_score=overall_score,
        strengths=qualitative.get("strengths", []),
        weaknesses=qualitative.get("weaknesses", []),
        improvement_areas=qualitative.get("improvement_areas", []),
        summary_text=qualitative.get("summary_text", ""),
    )
    db.add(report)

    # 7. Populate Progress rows — one per category, averaging scores within that
    #    category for this interview. Powers future trend charts.
    scores_by_category = defaultdict(list)
    for pair in qa_pairs:
        category = pair["category"] or "general"
        scores_by_category[category].append(pair["overall_score"])

    for category, scores in scores_by_category.items():
        progress_entry = Progress(
            user_id=current_user.id,
            interview_id=interview.id,
            category=category,
            score=_average(scores),
        )
        db.add(progress_entry)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A report already exists for this interview.")

    db.refresh(report)
    return report


@router.get("/{interview_id}/report", response_model=ReportResponse)
def get_report(
    interview_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this interview.")

    report = db.query(Report).filter(Report.interview_id == interview.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="No report found for this interview.")

    return report