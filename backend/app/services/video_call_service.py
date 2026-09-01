import hashlib
import hmac
import base64
import time
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.core.config import settings
import uuid

class VideoCallService:
    """Service for managing video calls using Agora"""
    
    def __init__(self):
        self.app_id = settings.AGORA_APP_ID
        self.app_certificate = settings.AGORA_APP_CERTIFICATE
    
    def generate_agora_token(self, channel_name: str, uid: str, role: int = 1, expiration: int = 3600) -> Optional[str]:
        """
        Generate Agora RTC token
        role: 1 = Publisher (can publish stream), 0 = Subscriber (can only subscribe)
        """
        if not self.app_id or not self.app_certificate:
            # Return mock token for development
            return f"mock_token_{channel_name}_{uid}_{int(time.time())}"
        
        try:
            # Calculate expiration timestamp
            expire_time = int(time.time()) + expiration
            
            # Build token
            token_builder = f"{self.app_id}:{self.app_certificate}:{channel_name}:{uid}:{expire_time}"
            
            # For production, use proper Agora token generation
            # This is a simplified version - use agora-token-service in production
            token = base64.b64encode(token_builder.encode()).decode()
            
            return token
        except Exception as e:
            print(f"Error generating Agora token: {e}")
            return None
    
    def calculate_call_fee(self, duration_minutes: int) -> float:
        """Calculate consultation fee based on duration"""
        pricing = {
            10: 250.0,   # Quick (10 min)
            15: 400.0,   # Standard (15 min)
            25: 600.0,   # Detailed (25 min)
            30: 850.0    # Extended (30+ min)
        }
        
        # Find the closest pricing tier
        if duration_minutes <= 10:
            return pricing[10]
        elif duration_minutes <= 15:
            return pricing[15]
        elif duration_minutes <= 25:
            return pricing[25]
        else:
            return pricing[30]
    
    def generate_channel_name(self, call_id: str) -> str:
        """Generate unique channel name for Agora"""
        return f"mediassist_{call_id}"
    
    def create_meeting_link(self, call_id: str) -> str:
        """Generate meeting link"""
        return f"http://localhost:8080/video-call/{call_id}"
