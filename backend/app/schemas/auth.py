from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirm_password: str = Field(..., alias="confirmPassword")
    
    class Config:
        populate_by_name = True  # Allow both confirmPassword and confirm_password

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    userId: Optional[str] = None  # Match frontend expectation
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    
    class Config:
        populate_by_name = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
