from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class ReviewRequest(BaseModel):
    appointment_id: Optional[str] = Field(default_factory=lambda: f"appt_{uuid.uuid4().hex[:8]}")
    patient_id: Optional[str] = Field(default_factory=lambda: f"patient_{uuid.uuid4().hex[:8]}")
    patient_name: str
    patient_phone: Optional[str] = None
    rating: int = Field(ge=1, le=5)  # 1-5
    title: Optional[str] = None
    comment: Optional[str] = None
    category: str = "OVERALL"  # CONSULTATION, STAFF, FACILITY, OVERALL
    anonymous: bool = False

class ReviewResponse(BaseModel):
    id: str
    appointment_id: str
    patient_id: str
    patient_name: str
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    category: str
    verified: bool
    helpful: bool
    doctor_response: Optional[str] = None
    created_at: datetime
