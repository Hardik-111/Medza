from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/mediassist"
    
    # JWT
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    
    # Razorpay
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    
    # Twilio
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # AWS S3
    AWS_S3_BUCKET: str = "mediassist-files"
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY: str = ""
    AWS_SECRET_KEY: str = ""
    
    # Video
    DYTE_API_KEY: str = ""
    DYTE_ORG_ID: str = ""
    AGORA_APP_ID: str = ""
    AGORA_APP_CERTIFICATE: str = ""
    
    # Doctor Contact Info
    DOCTOR_EMAIL: str = "doctor@healthcareplus.com"
    DOCTOR_PHONE: str = "+917905152928"
    
    # Google Calendar
    GOOGLE_CALENDAR_ID: str = "primary"  # Doctor's calendar ID
    GOOGLE_CREDENTIALS_FILE: str = ""  # Path to service account credentials JSON
    GOOGLE_CALENDAR_ENABLED: bool = False  # Enable/disable calendar integration
    
    # App
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "http://localhost:8080,http://127.0.0.1:8080"
    FRONTEND_URL: str = "http://localhost:8080"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env that aren't in Settings
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()
