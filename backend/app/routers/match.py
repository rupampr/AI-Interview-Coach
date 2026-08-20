from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID
from typing import List

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.resumes import Resume
from app.models.job_descriptions import JobDescription
from app.models.matches import Match
from app.services.matching_service import cosine_similarity, compare_skills

router = APIRouter(prefix="/match", tags=["match"])


class MatchResponse(BaseModel):
    resume_id: UUID
    jd_id: UUID
    similarity_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    extra_skills: List[str]


@router.post("/{jd_id}", response_model=MatchResponse)
def match_resume_to_jd(
    jd_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch the user's resume (one active resume per user, per Phase 2 design)
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found. Please upload one first.")

    if not resume.embedding:
        raise HTTPException(status_code=422, detail="Resume has no embedding. Try re-uploading.")

    # 2. Fetch the requested JD, with ownership check
    job_description = db.query(JobDescription).filter(JobDescription.id == jd_id).first()
    if not job_description:
        raise HTTPException(status_code=404, detail="Job description not found.")

    if job_description.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this job description.")

    if not job_description.embedding:
        raise HTTPException(status_code=422, detail="Job description has no embedding.")

    # 3. Compute similarity
    score = cosine_similarity(resume.embedding, job_description.embedding)

    # 4. Compute skill overlap
    resume_skills = (resume.extracted_data or {}).get("skills", [])
    jd_skills = (job_description.extracted_requirements or {}).get("skills", [])
    skill_comparison = compare_skills(resume_skills, jd_skills)

    # 5. Save match record
    match = Match(
        resume_id=resume.id,
        jd_id=job_description.id,
        user_id=current_user.id,
        similarity_score=round(score, 4),
        matched_skills=skill_comparison["matched_skills"],
        missing_skills=skill_comparison["missing_skills"],
    )

    db.add(match)
    db.commit()
    db.refresh(match)

    return {
        "resume_id": resume.id,
        "jd_id": job_description.id,
        "similarity_score": round(score, 4),
        **skill_comparison,
    }

@router.get("/history", response_model=List[MatchResponse])
def get_match_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    matches = (
        db.query(Match)
        .filter(Match.user_id == current_user.id)
        .order_by(Match.created_at.desc())
        .all()
    )

    return [
        {
            "resume_id": m.resume_id,
            "jd_id": m.jd_id,
            "similarity_score": m.similarity_score,
            "matched_skills": m.matched_skills or [],
            "missing_skills": m.missing_skills or [],
            "extra_skills": [],  # not stored, so left empty here
        }
        for m in matches
    ]