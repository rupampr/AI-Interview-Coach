import uuid

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4
import os
import shutil

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.resumes import Resume
from app.services.resume_parser import extract_text_from_pdf, extract_skills
from app.services.embedding_service import generate_embedding

router = APIRouter(prefix="/resume", tags=["resume"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Validate filename exists
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is missing.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    # 2. Validate file size
    # Read into memory once to check size, since UploadFile doesn't expose
    # size directly without consuming the stream
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size is {MAX_FILE_SIZE // (1024 * 1024)}MB.",
        )
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 3. Generate unique filename for disk storage
    stored_filename = f"{uuid4()}.pdf"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)

    try:
        # Save PDF (we already have the bytes from the size check above)
        with open(file_path, "wb") as buffer:
            buffer.write(file_bytes)

        # 4. Extract text
        raw_text = extract_text_from_pdf(file_path)

        if not raw_text.strip():
            raise HTTPException(status_code=422, detail="No text could be extracted from the PDF.")

        # 5. Extract skills
        extracted_skills = extract_skills(raw_text)
        extracted_data = {"skills": extracted_skills}

        embedding = generate_embedding(raw_text)

        # 6. Replace-existing-resume logic: one active resume per user
        existing_resume = (
            db.query(Resume).filter(Resume.user_id == current_user.id).first()
        )
        if existing_resume:
            old_path = os.path.join(UPLOAD_DIR, existing_resume.stored_filename)
            if os.path.exists(old_path):
                os.remove(old_path)
            db.delete(existing_resume)
            db.commit()

        # 7. Create new Resume row
        resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            stored_filename=stored_filename,
            raw_text=raw_text,
            extracted_data=extracted_data,
            embedding = embedding,
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return {
            "message": "Resume uploaded successfully",
            "resume_id": resume.id,
            "filename": resume.filename,
            "extracted_data": resume.extracted_data,
        }

    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    except ValueError as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=422, detail=str(e))

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


@router.get("/me")
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this user.")

    return {
        "resume_id": resume.id,
        "filename": resume.filename,
        "raw_text": resume.raw_text,
        "extracted_data": resume.extracted_data,
    }


@router.get("/{resume_id}")
def get_resume_by_id(
    resume_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    # Ownership check — prevent one user from reading another user's resume by guessing IDs
    if resume.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this resume.")

    return {
        "resume_id": resume.id,
        "filename": resume.filename,
        "raw_text": resume.raw_text,
        "extracted_data": resume.extracted_data,
    }