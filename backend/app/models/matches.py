# app/models/matches.py
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, JSON, Float
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=False)
    jd_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"), nullable=False)
    similarity_score = Column(Float, nullable=False)
    matched_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)