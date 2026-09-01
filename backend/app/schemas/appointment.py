from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime

from app.core.payment_constants import ALLOWED_PAYMENT_METHOD

class AppointmentRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    patient_name: str
    patient_phone: str
    patient_email: Optional[str] = None
    consultation_type: Optional[str] = None
    consultation_plan: Optional[str] = None
    appointment_date: datetime
    appointment_time: Optional[str] = None
    symptoms: Optional[str] = None
    payment_method: Literal["QR_SCAN"] = Field(
        default=ALLOWED_PAYMENT_METHOD,
        alias="paymentMethod",
    )

class RescheduleRequest(BaseModel):
    new_date: datetime
    new_time: Optional[str] = None

class AppointmentResponse(BaseModel):
    success: bool
    message: str
    appointment_id: Optional[str] = None
    appointment: Optional[dict] = None
