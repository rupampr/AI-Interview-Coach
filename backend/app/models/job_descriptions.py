import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.session import Base


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)
    raw_text = Column(Text, nullable=False)
    extracted_requirements = Column(JSON, nullable=True)  # normalized skills/requirements
    created_at = Column(DateTime, default=datetime.utcnow)
    embedding = Column(JSON, nullable=True)
