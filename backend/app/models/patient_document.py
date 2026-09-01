from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class PatientDocument(Base):
    __tablename__ = "patient_documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, nullable=False, index=True)
    document_name = Column(String, nullable=False)
    document_type = Column(String, nullable=False)  # PRESCRIPTION, REPORT, XRAY, LAB, OTHER
    file_url = Column(String, nullable=False)
    file_size = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String, nullable=True)
