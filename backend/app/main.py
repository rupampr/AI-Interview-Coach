"""
App entrypoint. Run with:
    uvicorn app.main:app --reload
(or via Docker Compose, see ../docker-compose.yml)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, engine
from app.routers import auth
from app.routers import resume
from app.routers import job_description
from app.routers import match
from app.routers import interview
from app.routers import answer
from app.routers import report

# Import models so SQLAlchemy knows about every table before create_all runs.
from app import models  # noqa: F401

app = FastAPI(title=settings.app_name)

# Allow the Next.js frontend (running on a different port) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-interview-coach-eight-eosin.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # For local dev, auto-create tables. Once the schema stabilizes,
    # switch to Alembic migrations instead (see backend/alembic/).
    Base.metadata.create_all(bind=engine)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok", "environment": settings.environment}


app.include_router(auth.router)

app.include_router(resume.router)

app.include_router(job_description.router)

app.include_router(match.router)

app.include_router(interview.router)

app.include_router(answer.router)

app.include_router(report.router)
