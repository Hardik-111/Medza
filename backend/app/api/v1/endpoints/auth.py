from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import LoginRequest, SignupRequest, AuthResponse, ForgotPasswordRequest, ResetPasswordRequest
from app.models.user import User
from app.services.notification_service import NotificationService
from datetime import datetime, timedelta
import uuid

router = APIRouter()

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )
    
    if not user.active:
        return AuthResponse(
            success=False,
            message="Account is deactivated"
        )
    
    if not verify_password(request.password, user.password):
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )
    
    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    
    return AuthResponse(
        success=True,
        message="Login successful",
        token=access_token,
        userId=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role
    )

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Signup endpoint"""
    # Check if user already exists
    if db.query(User).filter(User.email == request.email).first():
        return AuthResponse(
            success=False,
            message="Email already registered"
        )
    
    # Validate password confirmation
    if request.password != request.confirm_password:
        return AuthResponse(
            success=False,
            message="Password and confirm password do not match"
        )
    
    # Create new user
    user = User(
        id=str(uuid.uuid4()),
        name=request.name,
        username=request.email,
        email=request.email,
        password=get_password_hash(request.password),
        role="PATIENT",
        active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    
    return AuthResponse(
        success=True,
        message="Account created successfully",
        token=access_token,
        userId=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role
    )

@router.post("/forgot-password", response_model=AuthResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Forgot password endpoint"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Don't reveal if email exists for security
        return AuthResponse(
            success=True,
            message="If the email exists, a reset link has been sent"
        )
    
    # Generate reset token (simplified - in production use proper token generation)
    reset_token = str(uuid.uuid4())
    # Store token (in production, use Redis or database)
    
    # Send reset email
    notification_service = NotificationService()
    notification_service.send_password_reset_email(user.email, reset_token)
    
    return AuthResponse(
        success=True,
        message="If the email exists, a reset link has been sent"
    )

@router.post("/reset-password", response_model=AuthResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password endpoint"""
    # In production, validate token from storage
    # For now, simplified implementation
    
    return AuthResponse(
        success=False,
        message="Password reset functionality needs token validation"
    )

@router.post("/logout")
async def logout():
    """Logout endpoint (JWT handled client-side)"""
    return {"message": "Logged out successfully"}
