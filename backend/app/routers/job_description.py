from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.job_descriptions import JobDescription
from app.services.resume_parser import extract_skills
from app.services.embedding_service import generate_embedding

router = APIRouter(prefix="/job-description", tags=["job-description"])


class JobDescriptionCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    raw_text: str = Field(..., min_length=1)


class JobDescriptionResponse(BaseModel):
    id: UUID
    title: Optional[str]
    raw_text: str
    extracted_requirements: Optional[dict]

    class Config:
        from_attributes = True  # Pydantic v2; use orm_mode=True if on Pydantic v1


@router.post("/", response_model=JobDescriptionResponse)
def create_job_description(
    payload: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Reuse the same skill-extraction logic built for resumes in Phase 2
    required_skills = extract_skills(payload.raw_text)
    extracted_requirements = {"skills": required_skills}
    embedding = generate_embedding(payload.raw_text)

    job_description = JobDescription(
        user_id=current_user.id,
        title=payload.title,
        raw_text=payload.raw_text,
        extracted_requirements=extracted_requirements,
        embedding = embedding,
    )

    db.add(job_description)
    db.commit()
    db.refresh(job_description)

    return job_description


@router.get("/", response_model=list[JobDescriptionResponse])
def list_my_job_descriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job_descriptions = (
        db.query(JobDescription)
        .filter(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
        .all()
    )
    return job_descriptions


@router.get("/{jd_id}", response_model=JobDescriptionResponse)
def get_job_description(
    jd_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job_description = db.query(JobDescription).filter(JobDescription.id == jd_id).first()

    if not job_description:
        raise HTTPException(status_code=404, detail="Job description not found.")

    if job_description.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this job description.")

    return job_description