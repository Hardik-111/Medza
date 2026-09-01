from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict
from app.core.database import get_db
from app.models.video_call import VideoCall
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.user import User
from app.schemas.video_call import (
    VideoCallRequest, VideoCallResponse, JoinCallRequest, 
    EndCallRequest, CallHistoryResponse
)
from app.services.video_call_service import VideoCallService
from app.services.payment_service import PaymentService
from app.services.notification_service import NotificationService
from app.services.calendar_service import CalendarService
from app.dependencies import get_current_user
from app.core.payment_constants import ALLOWED_PAYMENT_METHOD
from app.core.config import settings
from datetime import datetime, timedelta
import uuid

router = APIRouter()
video_call_service = VideoCallService()
payment_service = PaymentService()
notification_service = NotificationService()
calendar_service = CalendarService()

def confirm_booking_after_payment(video_call: VideoCall, db: Session) -> None:
    """Fulfil a call only after its payment has been verified server-side."""
    appointment = db.query(Appointment).filter(Appointment.id == video_call.appointment_id).first()
    if appointment:
        details = dict(appointment.payment_details or {})
        details.update({"payment_status": "COMPLETED", "amount_paid": video_call.consultation_fee})
        appointment.payment_details = details

    if not video_call.calendar_event_id:
        call_type_label = {10: "Quick Consult", 15: "Standard Consult", 25: "Detailed Consult", 30: "Extended Consult"}.get(video_call.duration_minutes, f"{video_call.duration_minutes} min")
        video_call.calendar_event_id = calendar_service.create_calendar_event(
            title=f"Video Consultation - {video_call.patient_name}",
            start_time=video_call.scheduled_start_time,
            duration_minutes=video_call.duration_minutes,
            description=f"Video consultation with {video_call.patient_name}\nCall Type: {call_type_label}\nFee: ₹{video_call.consultation_fee}",
            meeting_link=video_call.meeting_link,
        )
        try:
            notification_service.send_video_call_invite_to_doctor(
                call_id=video_call.id,
                meeting_link=video_call.meeting_link,
                patient_name=video_call.patient_name,
                call_type=call_type_label,
                duration_minutes=video_call.duration_minutes,
                consultation_fee=video_call.consultation_fee,
                scheduled_time=video_call.scheduled_start_time,
                patient_phone=video_call.patient_phone,
            )
        except Exception as error:
            print(f"Error sending doctor notification: {error}")

@router.post("/create", response_model=VideoCallResponse)
async def create_video_call(
    request: VideoCallRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new video call with payment"""
    try:
        # Check availability before proceeding
        is_available = calendar_service.check_availability(
            start_time=request.scheduled_start_time,
            duration_minutes=request.duration_minutes,
            db=db
        )
        
        if not is_available:
            return VideoCallResponse(
                success=False,
                message="This time slot is already booked. Please choose another time."
            )
        
        # Calculate fee based on duration
        consultation_fee = video_call_service.calculate_call_fee(request.duration_minutes)
        
        # Create Razorpay order
        order = payment_service.create_order(
            amount=consultation_fee,
            receipt=f"video_call_{int(datetime.utcnow().timestamp())}"
        )
        
        # Debug logging
        print(f"Payment order created: {order}")
        print(f"Order ID: {order.get('id')}")
        
        if not order.get("id"):
            print(f"ERROR: Order has no ID. Order object: {order}")
            return VideoCallResponse(
                success=False,
                message=f"Failed to create payment order. Order: {order}"
            )
        
        # Generate call ID and channel name
        call_id = str(uuid.uuid4())
        channel_name = video_call_service.generate_channel_name(call_id)
        
        # Generate Agora token
        agora_token = video_call_service.generate_agora_token(
            channel_name=channel_name,
            uid=current_user.id,
            expiration=request.duration_minutes * 60
        )
        
        # Find or create patient
        patient = db.query(Patient).filter(
            (Patient.phone == request.patient_phone) | (Patient.email == request.patient_email)
        ).first()
        
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
            db.flush()
        
        # Create appointment for video call
        appointment = Appointment(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            patient_name=request.patient_name,
            patient_phone=request.patient_phone,
            patient_email=request.patient_email,
            consultation_type="VIDEO_CALL",
            consultation_plan=None,
            consultation_fee=consultation_fee,
            original_fee=consultation_fee,
            discount_amount=0.0,
            appointment_date=request.scheduled_start_time,
            appointment_time=request.scheduled_start_time.strftime("%H:%M") if request.scheduled_start_time else None,
            appointment_status="SCHEDULED",
            symptoms=f"Video consultation - {request.duration_minutes} minutes",
            payment_details={
                "payment_method": request.payment_method,
                "payment_status": "PENDING",
                "amount_paid": 0.0
            },
            notification_details={
                "sms_sent": False,
                "email_sent": False
            }
        )
        db.add(appointment)
        db.flush()
        
        # Create meeting link
        meeting_link = video_call_service.create_meeting_link(call_id)
        
        # Create video call record with appointment link
        video_call = VideoCall(
            id=call_id,
            appointment_id=appointment.id,
            patient_id=current_user.id,
            patient_name=request.patient_name,
            patient_phone=request.patient_phone,
            patient_email=request.patient_email,
            call_type=request.call_type,
            duration_minutes=request.duration_minutes,
            scheduled_start_time=request.scheduled_start_time,
            consultation_fee=consultation_fee,
            payment_status="PENDING",
            payment_method=request.payment_method,
            razorpay_order_id=order.get("id"),
            agora_channel_name=channel_name,
            agora_token=agora_token,
            agora_app_id=video_call_service.app_id or "mock_app_id",
            meeting_link=meeting_link,
            calendar_event_id=None,
            call_status="SCHEDULED"
        )
        
        db.add(video_call)
        db.commit()
        db.refresh(video_call)
        
        return VideoCallResponse(
            success=True,
            message="Video call created successfully. Please complete payment to start the call.",
            call_id=call_id,
            agora_app_id=video_call.agora_app_id,
            agora_channel_name=channel_name,
            agora_token=agora_token,
            meeting_link=video_call.meeting_link,
            payment_order_id=order.get("id"),
            payment_amount=consultation_fee,
            call={
                "id": call_id,
                "scheduled_start_time": request.scheduled_start_time.isoformat(),
                "duration_minutes": request.duration_minutes,
                "consultation_fee": consultation_fee
            }
        )
    except Exception as e:
        db.rollback()
        return VideoCallResponse(
            success=False,
            message=f"Failed to create video call: {str(e)}"
        )

@router.post("/join", response_model=VideoCallResponse)
async def join_video_call(
    request: JoinCallRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Join an existing video call"""
    video_call = db.query(VideoCall).filter(VideoCall.id == request.call_id).first()
    
    if not video_call:
        raise HTTPException(status_code=404, detail="Video call not found")
    
    # Check if payment is completed
    if video_call.payment_status != "COMPLETED":
        raise HTTPException(
            status_code=402,
            detail="Payment required. Please complete payment to join the call."
        )
    
    # Check if call is scheduled for future
    if video_call.scheduled_start_time > datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail=f"Call is scheduled for {video_call.scheduled_start_time}. Please wait until then."
        )
    
    # Check if call has expired
    call_end_time = video_call.scheduled_start_time + timedelta(minutes=video_call.duration_minutes)
    if datetime.utcnow() > call_end_time and video_call.call_status != "ONGOING":
        video_call.call_status = "EXPIRED"
        db.commit()
        raise HTTPException(status_code=400, detail="This call has expired")
    
    # Start call if not already started
    if video_call.call_status == "SCHEDULED":
        video_call.call_status = "ONGOING"
        video_call.actual_start_time = datetime.utcnow()
        db.commit()
    
    # Generate token for the user
    agora_token = video_call_service.generate_agora_token(
        channel_name=video_call.agora_channel_name,
        uid=current_user.id,
        expiration=video_call.duration_minutes * 60
    )
    
    return VideoCallResponse(
        success=True,
        message="Joining video call",
        call_id=video_call.id,
        agora_app_id=video_call.agora_app_id,
        agora_channel_name=video_call.agora_channel_name,
        agora_token=agora_token,
        meeting_link=video_call.meeting_link
    )

@router.post("/end", response_model=Dict)
async def end_video_call(
    request: EndCallRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """End a video call"""
    video_call = db.query(VideoCall).filter(VideoCall.id == request.call_id).first()
    
    if not video_call:
        raise HTTPException(status_code=404, detail="Video call not found")
    
    if video_call.call_status != "ONGOING":
        raise HTTPException(status_code=400, detail="Call is not currently active")
    
    # Calculate actual duration
    if video_call.actual_start_time:
        duration = (datetime.utcnow() - video_call.actual_start_time).total_seconds()
        video_call.actual_duration_seconds = int(duration)
    
    video_call.call_status = "COMPLETED"
    video_call.actual_end_time = datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": "Call ended successfully",
        "call_id": video_call.id,
        "duration_seconds": video_call.actual_duration_seconds
    }

@router.post("/payment/verify")
async def verify_payment(
    call_id: str,
    payment_id: str,
    signature: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Verify and complete payment for video call"""
    video_call = db.query(VideoCall).filter(VideoCall.id == call_id, VideoCall.patient_id == current_user.id).first()
    
    if not video_call:
        raise HTTPException(status_code=404, detail="Video call not found")
    
    # Check if this is a mock payment (for development/testing)
    is_mock_payment = (
        settings.ENVIRONMENT == "development"
        and bool(video_call.razorpay_order_id and video_call.razorpay_order_id.startswith("order_mock"))
        and payment_id.startswith("mock_payment")
        and signature == "mock_signature"
    )
    
    if is_mock_payment:
        # Auto-approve mock payments for testing
        print(f"Mock payment detected for call {call_id}. Auto-approving for testing.")
        video_call.payment_status = "COMPLETED"
        video_call.razorpay_payment_id = payment_id
        video_call.payment_transaction_id = payment_id
        confirm_booking_after_payment(video_call, db)
        db.commit()
        
        return {
            "success": True,
            "message": "Mock payment verified successfully (testing mode)",
            "call_id": call_id,
            "meeting_link": video_call.meeting_link
        }
    
    # Verify real payment signature
    is_valid = payment_service.verify_payment(
        payment_id=payment_id,
        order_id=video_call.razorpay_order_id,
        signature=signature
    )
    
    if not is_valid:
        video_call.payment_status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Update payment status
    video_call.payment_status = "COMPLETED"
    video_call.razorpay_payment_id = payment_id
    video_call.payment_transaction_id = payment_id
    confirm_booking_after_payment(video_call, db)
    db.commit()
    
    return {
        "success": True,
        "message": "Payment verified successfully",
        "call_id": call_id,
        "meeting_link": video_call.meeting_link
    }

@router.get("/history", response_model=List[CallHistoryResponse])
async def get_call_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get call history for current user"""
    calls = db.query(VideoCall).filter(
        VideoCall.patient_id == current_user.id
    ).order_by(VideoCall.created_at.desc()).all()
    
    # Create appointments for video calls that don't have one (for existing calls)
    for call in calls:
        if not call.appointment_id:
            # Find or create patient
            patient = db.query(Patient).filter(
                (Patient.phone == call.patient_phone) | (Patient.email == call.patient_email)
            ).first()
            
            if not patient:
                patient = Patient(
                    id=str(uuid.uuid4()),
                    phone=call.patient_phone,
                    email=call.patient_email or "",
                    name=call.patient_name,
                    first_visit_date=datetime.utcnow(),
                    total_visits=1,
                    active=True
                )
                db.add(patient)
                db.flush()
            
            # Create appointment for this video call
            appointment = Appointment(
                id=str(uuid.uuid4()),
                patient_id=patient.id,
                patient_name=call.patient_name,
                patient_phone=call.patient_phone,
                patient_email=call.patient_email,
                consultation_type="VIDEO_CALL",
                consultation_plan=None,
                consultation_fee=call.consultation_fee,
                original_fee=call.consultation_fee,
                discount_amount=0.0,
                appointment_date=call.scheduled_start_time,
                appointment_time=call.scheduled_start_time.strftime("%H:%M") if call.scheduled_start_time else None,
                appointment_status=call.call_status if call.call_status in ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED"] else "SCHEDULED",
                symptoms=f"Video consultation - {call.duration_minutes} minutes",
                payment_details={
                    "payment_method": call.payment_method or ALLOWED_PAYMENT_METHOD,
                    "payment_status": call.payment_status,
                    "amount_paid": call.consultation_fee if call.payment_status == "COMPLETED" else 0.0
                },
                notification_details={
                    "sms_sent": False,
                    "email_sent": False
                }
            )
            db.add(appointment)
            db.flush()
            
            # Link video call to appointment
            call.appointment_id = appointment.id
            db.commit()
    
    # Refresh calls to get updated appointment_ids
    calls = db.query(VideoCall).filter(
        VideoCall.patient_id == current_user.id
    ).order_by(VideoCall.created_at.desc()).all()
    
    return [
        CallHistoryResponse(
            id=c.id,
            appointment_id=c.appointment_id,
            patient_name=c.patient_name,
            scheduled_start_time=c.scheduled_start_time,
            actual_start_time=c.actual_start_time,
            actual_end_time=c.actual_end_time,
            duration_minutes=c.duration_minutes,
            actual_duration_seconds=c.actual_duration_seconds,
            call_status=c.call_status,
            consultation_fee=c.consultation_fee,
            payment_status=c.payment_status,
            payment_method=c.payment_method,
            created_at=c.created_at
        )
        for c in calls
    ]

@router.get("/{call_id}")
async def get_call_details(
    call_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get details of a specific video call"""
    video_call = db.query(VideoCall).filter(VideoCall.id == call_id).first()
    
    if not video_call:
        raise HTTPException(status_code=404, detail="Video call not found")
    
    return {
        "id": video_call.id,
        "patient_name": video_call.patient_name,
        "scheduled_start_time": video_call.scheduled_start_time,
        "duration_minutes": video_call.duration_minutes,
        "consultation_fee": video_call.consultation_fee,
        "payment_status": video_call.payment_status,
        "call_status": video_call.call_status,
        "meeting_link": video_call.meeting_link
    }
