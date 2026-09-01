from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    appointment_id = Column(String, nullable=False, index=True)
    patient_id = Column(String, nullable=False, index=True)
    patient_name = Column(String, nullable=False)
    patient_phone = Column(String, nullable=True)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String, nullable=True)
    comment = Column(String, nullable=True)
    category = Column(String, nullable=False)  # CONSULTATION, STAFF, FACILITY, OVERALL
    
    anonymous = Column(Boolean, default=False, nullable=False)
    verified = Column(Boolean, default=False, nullable=False)
    helpful = Column(Boolean, default=False, nullable=False)
    
    doctor_response = Column(String, nullable=True)
    response_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
