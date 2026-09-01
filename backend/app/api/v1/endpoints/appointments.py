from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.user import User
from app.schemas.appointment import AppointmentRequest, AppointmentResponse, RescheduleRequest
from app.services.calendar_service import CalendarService
from app.dependencies import get_current_user
from datetime import datetime, timedelta
import uuid

router = APIRouter()
calendar_service = CalendarService()

@router.post("/book", response_model=AppointmentResponse)
async def book_appointment(request: AppointmentRequest, db: Session = Depends(get_db)):
    """Book a new appointment"""
    try:
        # Parse appointment date and time
        appointment_datetime = request.appointment_date
        if isinstance(appointment_datetime, str):
            appointment_datetime = datetime.fromisoformat(appointment_datetime.replace('Z', '+00:00'))
        
        # Default duration for appointments (30 minutes)
        appointment_duration = 30
        
        # Check availability before proceeding
        is_available = calendar_service.check_availability(
            start_time=appointment_datetime,
            duration_minutes=appointment_duration,
            db=db
        )
        
        if not is_available:
            return AppointmentResponse(
                success=False,
                message="This time slot is already booked. Please choose another time."
            )
        
        # Find or create patient
        patient = db.query(Patient).filter(Patient.phone == request.patient_phone).first()
        
        if not patient:
            patient = Patient(
                id=str(uuid.uuid4()),
                phone=request.patient_phone,
                email=request.patient_email or "",
                name=request.patient_name,
                first_visit_date=datetime.utcnow(),
                total_visits=1,
                active=True
            )
            db.add(patient)
        else:
            patient.total_visits = (patient.total_visits or 0) + 1
            patient.last_visit_date = datetime.utcnow()
        
        # Calculate fees (simplified)
        consultation_fee = 499.0  # Default first visit fee
        if request.consultation_plan:
            plan_fees = {
                "WEEKLY": 999.0,
                "BI_WEEKLY": 1799.0,
                "MONTHLY": 3499.0
            }
            consultation_fee = plan_fees.get(request.consultation_plan, 499.0)
        
        # Create calendar event
        calendar_event_id = calendar_service.create_calendar_event(
            title=f"Appointment - {request.patient_name}",
            start_time=appointment_datetime,
            duration_minutes=appointment_duration,
            description=f"Appointment with {request.patient_name}\nType: {request.consultation_type or 'General'}\nFee: ₹{consultation_fee}\nSymptoms: {request.symptoms or 'N/A'}"
        )
        
        # Create appointment
        appointment = Appointment(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            patient_name=request.patient_name,
            patient_phone=request.patient_phone,
            patient_email=request.patient_email,
            consultation_type=request.consultation_type,
            consultation_plan=request.consultation_plan,
            consultation_fee=consultation_fee,
            original_fee=consultation_fee,
            discount_amount=0.0,
            appointment_date=request.appointment_date,
            appointment_time=request.appointment_time,
            appointment_status="SCHEDULED",
            symptoms=request.symptoms,
            payment_details={
                "payment_method": request.payment_method,
                "payment_status": "PENDING",
                "amount_paid": 0.0
            },
            notification_details={
                "sms_sent": False,
                "email_sent": False
            },
            calendar_event_id=calendar_event_id
        )
        
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        return AppointmentResponse(
            success=True,
            message="Appointment booked successfully",
            appointment_id=appointment.id,
            appointment={
                "id": appointment.id,
                "patient_name": appointment.patient_name,
                "appointment_date": appointment.appointment_date.isoformat(),
                "appointment_status": appointment.appointment_status,
                "consultation_fee": appointment.consultation_fee
            }
        )
    except Exception as e:
        db.rollback()
        return AppointmentResponse(
            success=False,
            message=f"Failed to book appointment: {str(e)}"
        )

@router.get("/my-appointments")
async def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all appointments for the current user"""
    # Get patient by user's phone or email
    patient = db.query(Patient).filter(
        (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
    ).first()
    
    if not patient:
        return {"upcoming": [], "past": []}
    
    now = datetime.utcnow()
    all_appointments = db.query(Appointment).filter(
        Appointment.patient_id == patient.id
    ).order_by(Appointment.appointment_date.desc()).all()
    
    upcoming = []
    past = []
    
    for apt in all_appointments:
        apt_data = {
            "id": apt.id,
            "patient_name": apt.patient_name,
            "appointment_date": apt.appointment_date.isoformat(),
            "appointment_time": apt.appointment_time,
            "appointment_status": apt.appointment_status,
            "consultation_type": apt.consultation_type,
            "consultation_fee": apt.consultation_fee,
            "symptoms": apt.symptoms,
            "created_at": apt.created_at.isoformat() if apt.created_at else None
        }
        
        if apt.appointment_date >= now and apt.appointment_status in ["SCHEDULED", "CONFIRMED"]:
            upcoming.append(apt_data)
        else:
            past.append(apt_data)
    
    return {"upcoming": upcoming, "past": past}

@router.put("/{appointment_id}/reschedule")
async def reschedule_appointment(
    appointment_id: str,
    request: RescheduleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Reschedule an appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify ownership
    patient = db.query(Patient).filter(
        (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
    ).first()
    
    if not patient or appointment.patient_id != patient.id:
        raise HTTPException(status_code=403, detail="Not authorized to reschedule this appointment")
    
    if appointment.appointment_status not in ["SCHEDULED", "CONFIRMED"]:
        raise HTTPException(status_code=400, detail="Cannot reschedule a completed or cancelled appointment")
    
    # Parse new date
    new_datetime = request.new_date
    if isinstance(new_datetime, str):
        new_datetime = datetime.fromisoformat(new_datetime.replace('Z', '+00:00'))
    
    # Default duration for appointments (30 minutes)
    appointment_duration = 30
    
    # Check availability for new time slot
    is_available = calendar_service.check_availability(
        start_time=new_datetime,
        duration_minutes=appointment_duration,
        db=db,
        exclude_appointment_id=appointment_id
    )
    
    if not is_available:
        raise HTTPException(status_code=400, detail="This time slot is already booked. Please choose another time.")
    
    # Update calendar event if it exists
    if appointment.calendar_event_id:
        calendar_service.update_calendar_event(
            event_id=appointment.calendar_event_id,
            title=f"Appointment - {appointment.patient_name}",
            start_time=new_datetime,
            duration_minutes=appointment_duration,
            description=f"Appointment with {appointment.patient_name}\nType: {appointment.consultation_type or 'General'}\nFee: ₹{appointment.consultation_fee}\nSymptoms: {appointment.symptoms or 'N/A'}"
        )
    else:
        # Create new calendar event if it doesn't exist
        calendar_event_id = calendar_service.create_calendar_event(
            title=f"Appointment - {appointment.patient_name}",
            start_time=new_datetime,
            duration_minutes=appointment_duration,
            description=f"Appointment with {appointment.patient_name}\nType: {appointment.consultation_type or 'General'}\nFee: ₹{appointment.consultation_fee}\nSymptoms: {appointment.symptoms or 'N/A'}"
        )
        appointment.calendar_event_id = calendar_event_id
    
    appointment.appointment_date = new_datetime
    if request.new_time:
        appointment.appointment_time = request.new_time
    appointment.appointment_status = "SCHEDULED"
    db.commit()
    db.refresh(appointment)
    
    return {
        "success": True,
        "message": "Appointment rescheduled successfully",
        "appointment": {
            "id": appointment.id,
            "appointment_date": appointment.appointment_date.isoformat(),
            "appointment_time": appointment.appointment_time
        }
    }

@router.get("/patient/{phone}")
async def get_patient_appointments(phone: str, db: Session = Depends(get_db)):
    """Get appointments for a patient by phone"""
    patient = db.query(Patient).filter(Patient.phone == phone).first()
    if not patient:
        return []
    
    appointments = db.query(Appointment).filter(Appointment.patient_id == patient.id).all()
    return appointments

@router.get("/upcoming")
async def get_upcoming_appointments(db: Session = Depends(get_db)):
    """Get all upcoming appointments"""
    now = datetime.utcnow()
    appointments = db.query(Appointment).filter(
        Appointment.appointment_date >= now,
        Appointment.appointment_status.in_(["SCHEDULED", "CONFIRMED"])
    ).order_by(Appointment.appointment_date).all()
    return appointments

@router.put("/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: str,
    status: str,
    db: Session = Depends(get_db)
):
    """Update appointment status"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.appointment_status = status
    db.commit()
    db.refresh(appointment)
    return appointment

@router.delete("/{appointment_id}")
async def cancel_appointment(appointment_id: str, db: Session = Depends(get_db)):
    """Cancel an appointment"""
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.appointment_status = "CANCELLED"
    db.commit()
    return {"message": "Appointment cancelled successfully"}
