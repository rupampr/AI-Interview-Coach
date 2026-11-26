import os
import json
import secrets
import urllib.request
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserOut, GoogleAuthRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm gives us `.username` / `.password` fields
    # (this is what makes the Swagger UI "Authorize" button work).
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token)


@router.post("/google", response_model=Token)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticates a user via Google Sign-In.
    Accepts either:
    1. Google ID token (credential) from Google Identity Services
    2. OAuth2 access_token
    3. Dev/demo mode credentials for sandbox testing
    """
    email = None
    full_name = None

    # Handle demo/dev mode token
    if payload.credential == "demo-google-credential":
        email = payload.email or "google.user@example.com"
        full_name = payload.full_name or "Google Test User"

    # Option 1: Validate Google ID Token (JWT)
    elif payload.credential:
        verified = False
        # Try google.oauth2.id_token library
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests

            client_id = os.environ.get("GOOGLE_CLIENT_ID")
            id_info = id_token.verify_oauth2_token(
                payload.credential,
                google_requests.Request(),
                audience=client_id if client_id else None,
            )
            email = id_info.get("email")
            full_name = id_info.get("name")
            verified = True
        except Exception as e:
            logger.debug(f"google.oauth2.id_token verification failed: {e}. Trying Google tokeninfo API...")

        # Fallback to Google's public tokeninfo endpoint
        if not verified:
            try:
                url = f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.credential}"
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=5) as response:
                    data = json.loads(response.read().decode("utf-8"))
                    email = data.get("email")
                    full_name = data.get("name")
                    verified = True
            except Exception as e:
                logger.error(f"Google tokeninfo endpoint failed: {e}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid or expired Google token: {str(e)}",
                )

    # Option 2: Validate OAuth2 Access Token via Google userinfo endpoint
    elif payload.access_token:
        try:
            url = "https://www.googleapis.com/oauth2/v3/userinfo"
            req = urllib.request.Request(url, headers={"Authorization": f"Bearer {payload.access_token}"})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode("utf-8"))
                email = data.get("email")
                full_name = data.get("name")
        except Exception as e:
            logger.error(f"Google userinfo verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google access token: {str(e)}",
            )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve email from Google authentication",
        )

    # Check if user already exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create new user record with a secure random hashed password
        user = User(
            email=email,
            full_name=full_name or email.split("@")[0],
            hashed_password=hash_password(secrets.token_urlsafe(32)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif full_name and not user.full_name:
        user.full_name = full_name
        db.commit()

    # Issue our own JWT access token
    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token)


@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
