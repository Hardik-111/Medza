from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer, JSON
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class VideoCall(Base):
    __tablename__ = "video_calls"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    appointment_id = Column(String, nullable=True, index=True)  # Optional link to appointment
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    patient_phone = Column(String, nullable=False)
    patient_email = Column(String, nullable=True)
    
    # Call details
    call_type = Column(String, nullable=False, default="VIDEO")  # VIDEO, AUDIO
    duration_minutes = Column(Integer, nullable=False)  # Paid duration in minutes
    scheduled_start_time = Column(DateTime(timezone=True), nullable=False)
    actual_start_time = Column(DateTime(timezone=True), nullable=True)
    actual_end_time = Column(DateTime(timezone=True), nullable=True)
    actual_duration_seconds = Column(Integer, nullable=True)  # Actual call duration
    
    # Status
    call_status = Column(String, nullable=False, default="SCHEDULED")  # SCHEDULED, ONGOING, COMPLETED, CANCELLED, EXPIRED
    
    # Payment
    consultation_fee = Column(Float, nullable=False)
    payment_status = Column(String, nullable=False, default="PENDING")  # PENDING, COMPLETED, FAILED, REFUNDED
    payment_method = Column(String, nullable=True)  # QR_SCAN; extend when adding methods
    payment_transaction_id = Column(String, nullable=True)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    
    # Video call provider details
    agora_channel_name = Column(String, nullable=True)
    agora_token = Column(String, nullable=True)
    agora_app_id = Column(String, nullable=True)
    
    # Calendar integration
    calendar_event_id = Column(String, nullable=True)
    meeting_link = Column(String, nullable=True)
    
    # Metadata
    call_metadata = Column(JSON, nullable=True)  # Store additional call data
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(String, nullable=True)
