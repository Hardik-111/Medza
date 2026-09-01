from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, Literal
from datetime import datetime

from app.core.payment_constants import ALLOWED_PAYMENT_METHOD

class VideoCallRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    patient_name: str
    patient_phone: str
    patient_email: Optional[EmailStr] = None
    call_type: str = "VIDEO"  # VIDEO or AUDIO
    duration_minutes: int  # 10, 15, 25, 30+
    scheduled_start_time: datetime
    payment_method: Literal["QR_SCAN"] = ALLOWED_PAYMENT_METHOD

class VideoCallResponse(BaseModel):
    success: bool
    message: str
    call_id: Optional[str] = None
    agora_app_id: Optional[str] = None
    agora_channel_name: Optional[str] = None
    agora_token: Optional[str] = None
    meeting_link: Optional[str] = None
    payment_order_id: Optional[str] = None
    payment_amount: Optional[float] = None
    call: Optional[Dict[str, Any]] = None

class JoinCallRequest(BaseModel):
    call_id: str
    user_role: str  # PATIENT or DOCTOR

class EndCallRequest(BaseModel):
    call_id: str

class CallHistoryResponse(BaseModel):
    id: str
    appointment_id: Optional[str] = None
    patient_name: str
    scheduled_start_time: datetime
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    duration_minutes: int
    actual_duration_seconds: Optional[int] = None
    call_status: str
    consultation_fee: float
    payment_status: str
    payment_method: Optional[str] = None
    created_at: datetime
