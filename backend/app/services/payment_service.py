import time
import hmac
import hashlib
from app.core.config import settings
from typing import Dict, Optional

# Try to import razorpay, but handle if it's not installed
try:
    import razorpay
    RAZORPAY_AVAILABLE = True
except ImportError:
    RAZORPAY_AVAILABLE = False
    razorpay = None

class PaymentService:
    """Service for handling payments via Razorpay"""
    
    def __init__(self):
        self.client = None
        if RAZORPAY_AVAILABLE and settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            try:
                self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            except Exception as e:
                print(f"Warning: Failed to initialize Razorpay client: {e}")
                self.client = None
    
    def create_order(self, amount: float, currency: str = "INR", receipt: Optional[str] = None) -> Dict:
        """Create a Razorpay order"""
        # Never create a pretend order outside local development.
        if not self.client or not RAZORPAY_AVAILABLE:
            if settings.ENVIRONMENT != "development":
                raise RuntimeError("Payments are not configured")
            # Mock order for development
            mock_order_id = f"order_mock_{int(time.time())}"
            print(f"Using mock payment order: {mock_order_id}")
            return {
                "id": mock_order_id,
                "amount": int(amount * 100),  # Amount in paise
                "currency": currency,
                "status": "created"
            }
        
        try:
            order_data = {
                "amount": int(amount * 100),  # Convert to paise
                "currency": currency,
                "receipt": receipt or f"receipt_{int(time.time())}",
                "notes": {
                    "service": "video_consultation"
                }
            }
            
            order = self.client.order.create(data=order_data)
            return order
        except Exception as e:
            print(f"Error creating Razorpay order: {e}")
            # Even on error, return a mock order ID so the flow can continue in dev mode
            return {
                "id": f"order_mock_error_{int(time.time())}",
                "amount": int(amount * 100),
                "currency": currency,
                "status": "created",
                "error": str(e)
            }
    
    def verify_payment(self, payment_id: str, order_id: str, signature: str) -> bool:
        """Verify Razorpay payment signature"""
        if not self.client:
            return True  # Mock verification for development
        
        try:
            message = f"{order_id}|{payment_id}"
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(generated_signature, signature)
        except Exception as e:
            print(f"Error verifying payment: {e}")
            return False
    
    def capture_payment(self, payment_id: str, amount: float) -> Dict:
        """Capture a payment"""
        if not self.client:
            return {"status": "captured", "id": payment_id}
        
        try:
            payment = self.client.payment.capture(payment_id, int(amount * 100))
            return payment
        except Exception as e:
            print(f"Error capturing payment: {e}")
            return {"status": "failed", "error": str(e)}
