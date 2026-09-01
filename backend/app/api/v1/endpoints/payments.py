from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.appointment import Appointment
from app.models.video_call import VideoCall
from app.models.user import User
from app.models.patient import Patient
from app.dependencies import get_current_user
from app.core.payment_constants import ALLOWED_PAYMENT_METHOD
from datetime import datetime
from app.core.config import settings

router = APIRouter()

@router.get("/config")
async def payment_config():
    """Return the public checkout configuration. Never expose the key secret."""
    return {
        "enabled": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
        "razorpay_key_id": settings.RAZORPAY_KEY_ID or None,
    }

@router.get("/history")
async def get_payment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get payment history for the current user"""
    # Get patient by user's phone or email
    patient = db.query(Patient).filter(
        (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
    ).first()
    
    payments = []
    
    # Get appointment payments
    if patient:
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == patient.id,
            Appointment.consultation_fee.isnot(None)
        ).all()
        
        for apt in appointments:
            payment_details = apt.payment_details or {}
            payments.append({
                "id": apt.id,
                "type": "APPOINTMENT",
                "date": apt.appointment_date.isoformat(),
                "amount": apt.consultation_fee or 0.0,
                "payment_method": payment_details.get("payment_method", ALLOWED_PAYMENT_METHOD),
                "payment_status": payment_details.get("payment_status", "PENDING"),
                "description": f"Appointment - {apt.consultation_type or 'Consultation'}",
                "created_at": apt.created_at.isoformat() if apt.created_at else None
            })
    
    # Get video call payments
    video_calls = db.query(VideoCall).filter(
        VideoCall.patient_id == current_user.id,
        VideoCall.consultation_fee.isnot(None)
    ).all()
    
    for call in video_calls:
        payments.append({
            "id": call.id,
            "type": "VIDEO_CALL",
            "date": call.scheduled_start_time.isoformat(),
            "amount": call.consultation_fee,
            "payment_method": call.payment_method or ALLOWED_PAYMENT_METHOD,
            "payment_status": call.payment_status,
            "description": f"Video Call - {call.duration_minutes} minutes",
            "created_at": call.created_at.isoformat() if call.created_at else None
        })
    
    # Sort by date (newest first)
    payments.sort(key=lambda x: x["created_at"] or "", reverse=True)
    
    return {"payments": payments}
