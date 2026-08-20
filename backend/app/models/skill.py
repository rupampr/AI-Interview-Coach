import uuid

from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class Skill(Base):
    """Normalized skill catalog (e.g. 'Python', 'React', 'SQL')."""
    __tablename__ = "skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=True)  # e.g. "programming", "ml", "soft-skill"


class UserSkill(Base):
    """Links a user/resume to a skill, with a confidence/proficiency score."""
    __tablename__ = "user_skills"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id"), nullable=False)
    proficiency_score = Column(Float, nullable=True)  # 0-1, derived from resume/interview data
