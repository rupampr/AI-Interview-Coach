from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from uuid import UUID
from typing import List, Optional

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.resumes import Resume
from app.models.job_descriptions import JobDescription
from app.models.interviews import Interview, Question
from app.services.matching_service import compare_skills
from app.services.llm_service import generate_interview_questions

router = APIRouter(prefix="/interview", tags=["interview"])

VALID_INTERVIEW_TYPES = {"technical", "behavioral", "dsa", "hr"}


class InterviewStartRequest(BaseModel):
    job_description_id: UUID
    interview_type: str = Field(..., description="technical | behavioral | dsa | hr")
    num_questions: int = Field(default=5, ge=1, le=15)


class QuestionResponse(BaseModel):
    id: UUID
    text: str
    category: Optional[str]
    difficulty: Optional[str]
    order_index: int

    class Config:
        from_attributes = True


class InterviewResponse(BaseModel):
    id: UUID
    interview_type: str
    status: str
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True


@router.post("/start", response_model=InterviewResponse)
def start_interview(
    payload: InterviewStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 0. Validate interview_type
    if payload.interview_type not in VALID_INTERVIEW_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"interview_type must be one of {sorted(VALID_INTERVIEW_TYPES)}",
        )

    # 1. Fetch resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload one first.")

    # 2. Fetch JD with ownership check
    job_description = (
        db.query(JobDescription).filter(JobDescription.id == payload.job_description_id).first()
    )
    if not job_description:
        raise HTTPException(status_code=404, detail="Job description not found.")
    if job_description.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this job description.")

    # 3. Compute skill gaps/matches
    resume_skills = (resume.extracted_data or {}).get("skills", [])
    jd_skills = (job_description.extracted_requirements or {}).get("skills", [])
    skill_comparison = compare_skills(resume_skills, jd_skills)

    # 4. Call the LLM
    try:
        generated = generate_interview_questions(
            jd_text=job_description.raw_text,
            matched_skills=skill_comparison["matched_skills"],
            missing_skills=skill_comparison["missing_skills"],
            interview_type=payload.interview_type,
            num_questions=payload.num_questions,
        )
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"Question generation failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error calling LLM: {str(e)}")

    if not generated:
        raise HTTPException(status_code=502, detail="LLM returned no questions.")

    # 5. Create the Interview row
    interview = Interview(
        user_id=current_user.id,
        resume_id=resume.id,
        job_description_id=job_description.id,
        interview_type=payload.interview_type,
        status="in_progress",
    )
    db.add(interview)
    db.flush()  # assigns interview.id without committing yet, so Questions can reference it

    # 6. Create Question rows, attached to this interview, in order
    for index, item in enumerate(generated):
        question = Question(
            interview_id=interview.id,
            text=item.get("question", ""),
            category=item.get("category"),
            difficulty=item.get("difficulty"),
            order_index=index,
        )
        db.add(question)

    db.commit()
    db.refresh(interview)

    return interview


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(
    interview_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")
    if interview.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this interview.")

    return interview


@router.get("/", response_model=List[InterviewResponse])
def list_my_interviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interviews = (
        db.query(Interview)
        .filter(Interview.user_id == current_user.id)
        .order_by(Interview.created_at.desc())
        .all()
    )
    return interviews