from sqlalchemy import Column, String, Boolean, DateTime, Integer, Date, ARRAY, JSON
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    pincode = Column(String, nullable=True)
    
    emergency_contact = Column(String, nullable=True)
    emergency_phone = Column(String, nullable=True)
    relationship = Column(String, nullable=True)
    
    allergies = Column(ARRAY(String), nullable=True)
    medical_conditions = Column(ARRAY(String), nullable=True)
    current_medications = Column(ARRAY(String), nullable=True)
    
    occupation = Column(String, nullable=True)
    marital_status = Column(String, nullable=True)
    insurance_provider = Column(String, nullable=True)
    insurance_number = Column(String, nullable=True)
    
    first_visit_date = Column(DateTime(timezone=True), nullable=True)
    last_visit_date = Column(DateTime(timezone=True), nullable=True)
    total_visits = Column(Integer, default=0, nullable=False)
    
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Medical History stored as JSON
    medical_history = Column(JSON, nullable=True)
