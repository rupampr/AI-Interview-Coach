"""
Central app configuration.

Everything here is read from environment variables (see docker-compose.yml
and .env.example). Keeping config in one place means no secrets are
hardcoded anywhere else in the codebase.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database ---
    database_url: str = "postgresql://postgres:postgres@db:5432/interview_coach"

    # --- Auth / JWT ---
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # --- App ---
    app_name: str = "AI Interview Coach API"
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# A single shared instance imported everywhere else in the app.
settings = Settings()
