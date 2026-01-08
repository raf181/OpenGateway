"""Core configuration for GeoCustody backend."""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings."""
    
    APP_NAME: str = "GeoCustody"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///./data/geocustody.db"
    
    # JWT Settings
    SECRET_KEY: str = "geocustody-demo-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for demo
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # Telefónica Open Gateway Settings
    # Mode: "mock" (local), "sandbox" (Telefónica sandbox), "production" (Telefónica prod)
    GATEWAY_MODE: str = "mock"
    GATEWAY_CLIENT_ID: Optional[str] = None
    GATEWAY_CLIENT_SECRET: Optional[str] = None
    GATEWAY_BASE_URL: Optional[str] = None  # Override default URL if needed
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
