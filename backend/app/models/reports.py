import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Float, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class Report(Base):
    """Final summary report for a completed interview."""
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"), nullable=False, unique=True)
    overall_score = Column(Float, nullable=True)
    strengths = Column(JSON, nullable=True)         # list[str]
    weaknesses = Column(JSON, nullable=True)         # list[str]
    improvement_areas = Column(JSON, nullable=True)  # list[str]
    summary_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Progress(Base):
    """Historical performance tracking across interviews, for trend charts."""
    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"), nullable=False)
    category = Column(String, nullable=True)  # e.g. "dsa", "behavioral"
    score = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow)
