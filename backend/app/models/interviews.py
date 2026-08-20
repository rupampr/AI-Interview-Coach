import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.session import Base


class Interview(Base):
    """A single mock-interview session."""
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id"), nullable=True)
    job_description_id = Column(UUID(as_uuid=True), ForeignKey("job_descriptions.id"), nullable=True)
    interview_type = Column(String, nullable=False)  # e.g. "technical", "behavioral", "hr", "dsa"
    status = Column(String, default="in_progress")  # in_progress | completed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    owner = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")


class Question(Base):
    """A question generated/asked during an interview."""
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"), nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String, nullable=True)  # dsa, ml, projects, behavioral, hr, etc.
    difficulty = Column(String, nullable=True)  # easy | medium | hard
    order_index = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False, cascade="all, delete-orphan")


class Answer(Base):
    """Candidate's response to a question, plus AI evaluation results."""
    __tablename__ = "answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    text = Column(Text, nullable=False)
    source = Column(String, default="text")  # "text" | "voice"

    # Evaluation dimensions (section 9 of the plan)
    technical_score = Column(Float, nullable=True)
    relevance_score = Column(Float, nullable=True)
    completeness_score = Column(Float, nullable=True)
    clarity_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question", back_populates="answer")
