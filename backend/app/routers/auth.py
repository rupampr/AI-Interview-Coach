import os
import json
import secrets
import urllib.request
import urllib.parse
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
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


@router.get("/google/login")
def google_oauth_redirect():
    """
    Standard Google OAuth 2.0 Authorization Endpoint.
    Redirects the browser directly to Google's official accounts authorization screen.
    """
    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_ID environment variable is not configured on the backend.",
        )

    backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000")
    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", f"{backend_url.rstrip('/')}/auth/google/callback")

    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    }
    google_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=google_url)


@router.get("/google/callback")
def google_oauth_callback(code: str, db: Session = Depends(get_db)):
    """
    Standard Google OAuth 2.0 Callback Endpoint.
    Receives auth code from Google, exchanges it for access token,
    retrieves user profile, provisions account in PostgreSQL,
    and redirects user to frontend dashboard with application JWT.
    """
    client_id = os.environ.get("GOOGLE_CLIENT_ID")
    client_secret = os.environ.get("GOOGLE_CLIENT_SECRET")
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000")
    redirect_uri = os.environ.get("GOOGLE_REDIRECT_URI", f"{backend_url.rstrip('/')}/auth/google/callback")

    if not client_id or not client_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing on the server.",
        )

    # 1. Exchange authorization code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    payload = urllib.parse.urlencode({
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }).encode("utf-8")

    req = urllib.request.Request(
        token_url,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            token_response = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        logger.error(f"Failed to exchange Google OAuth code: {e}")
        return RedirectResponse(f"{frontend_url.rstrip('/')}/login?error=Google%20OAuth%20code%20exchange%20failed")

    access_token = token_response.get("access_token")
    if not access_token:
        return RedirectResponse(f"{frontend_url.rstrip('/')}/login?error=No%20access%20token%20returned%20by%20Google")

    # 2. Fetch user profile from Google userinfo API
    try:
        userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        req = urllib.request.Request(
            userinfo_url,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            profile = json.loads(response.read().decode("utf-8"))
    except Exception as e:
        logger.error(f"Failed to fetch Google userinfo: {e}")
        return RedirectResponse(f"{frontend_url.rstrip('/')}/login?error=Failed%20to%20fetch%20Google%20profile")

    email = profile.get("email")
    full_name = profile.get("name")
    if not email:
        return RedirectResponse(f"{frontend_url.rstrip('/')}/login?error=No%20email%20provided%20by%20Google")

    # 3. Retrieve or create user record
    user = db.query(User).filter(User.email == email).first()
    if not user:
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

    # 4. Issue application JWT and redirect
    app_jwt = create_access_token(subject=str(user.id))
    return RedirectResponse(f"{frontend_url.rstrip('/')}/login?google_token={app_jwt}")


@router.post("/google", response_model=Token)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Client-side Google Identity Services (GIS) / OAuth 2.0 Endpoint.
    Accepts:
    1. Google ID token (credential) from Google Identity Services
    2. OAuth2 access_token
    3. Dev/demo mode credentials for sandbox testing
    """
    email = None
    full_name = None

    # Handle demo/dev mode token
    if payload.credential == "demo-google-credential":
        email = payload.email or "google.user@example.com"
        full_name = payload.full_name or "Google Verified User"

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
