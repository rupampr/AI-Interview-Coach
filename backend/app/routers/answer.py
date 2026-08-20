from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.interviews import Interview, Question, Answer
from app.models.job_descriptions import JobDescription
from app.services.llm_service import evaluate_answer

router = APIRouter(prefix="/answer", tags=["answer"])


class AnswerSubmitRequest(BaseModel):
    question_id: UUID
    text: str = Field(..., min_length=1)
    source: str = Field(default="text", description="text | voice")


class AnswerResponse(BaseModel):
    id: UUID
    question_id: UUID
    text: str
    technical_score: Optional[float]
    relevance_score: Optional[float]
    completeness_score: Optional[float]
    clarity_score: Optional[float]
    communication_score: Optional[float]
    overall_score: Optional[float]
    feedback: Optional[str]

    class Config:
        from_attributes = True


@router.post("/", response_model=AnswerResponse)
def submit_answer(
    payload: AnswerSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch the question, with ownership check through its interview
    question = db.query(Question).filter(Question.id == payload.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found.")

    interview = db.query(Interview).filter(Interview.id == question.interview_id).first()
    if not interview or interview.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this question.")

    # 2. Prevent duplicate answers (Question.answer is a 1:1 relationship)
    existing_answer = db.query(Answer).filter(Answer.question_id == question.id).first()
    if existing_answer:
        raise HTTPException(status_code=409, detail="This question has already been answered.")

    # 3. Fetch JD text for evaluation context (may be None if interview has no JD)
    jd_text = ""
    if interview.job_description_id:
        job_description = (
            db.query(JobDescription).filter(JobDescription.id == interview.job_description_id).first()
        )
        if job_description:
            jd_text = job_description.raw_text

    # 4. Call the LLM to evaluate
    try:
        evaluation = evaluate_answer(
            question_text=question.text,
            answer_text=payload.text,
            jd_text=jd_text,
        )
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"Answer evaluation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error calling LLM: {str(e)}")

    # 5. Save the Answer row
    answer = Answer(
        question_id=question.id,
        text=payload.text,
        source=payload.source,
        technical_score=evaluation["technical_score"],
        relevance_score=evaluation["relevance_score"],
        completeness_score=evaluation["completeness_score"],
        clarity_score=evaluation["clarity_score"],
        communication_score=evaluation["communication_score"],
        overall_score=evaluation["overall_score"],
        feedback=evaluation["feedback"],
    )
    db.add(answer)

    # 6. If every question in this interview now has an answer, mark it completed
    all_questions = db.query(Question).filter(Question.interview_id == interview.id).all()
    answered_count = (
        db.query(Answer)
        .join(Question, Answer.question_id == Question.id)
        .filter(Question.interview_id == interview.id)
        .count()
    )
    # +1 because the current answer hasn't been committed yet, so it's not counted above
    if answered_count + 1 >= len(all_questions):
        interview.status = "completed"
        from datetime import datetime
        interview.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(answer)

    return answer