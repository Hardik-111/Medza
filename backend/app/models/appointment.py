from sqlalchemy import Column, String, Boolean, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    patient_phone = Column(String, nullable=False)
    patient_email = Column(String, nullable=True)
    
    consultation_type = Column(String, nullable=True)
    consultation_plan = Column(String, nullable=True)
    consultation_fee = Column(Float, nullable=True)
    original_fee = Column(Float, nullable=True)
    discount_amount = Column(Float, nullable=True)
    
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    appointment_time = Column(String, nullable=True)
    appointment_status = Column(String, nullable=False, default="SCHEDULED")  # SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
    
    symptoms = Column(String, nullable=True)
    diagnosis = Column(String, nullable=True)
    prescription = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    
    # Payment Details stored as JSON
    payment_details = Column(JSON, nullable=True)
    
    # Notification Details stored as JSON
    notification_details = Column(JSON, nullable=True)
    
    # Calendar integration
    calendar_event_id = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(String, nullable=True)
