# Video Call Feature - Setup Guide

## Overview
This application now includes a complete end-to-end video call feature similar to Google Meet, with payment integration, scheduling, and call history tracking.

## Features Implemented

### 1. **Video Call Booking**
- Patients can book video consultations with duration options:
  - Quick (10 min) - ₹250
  - Standard (15 min) - ₹400
  - Detailed (25 min) - ₹600
  - Extended (30+ min) - ₹850
- Date and time selection
- Payment method selection (UPI, Net Banking, Credit/Debit Cards)

### 2. **Payment Integration**
- Razorpay integration for secure payments
- Payment verification before call access
- Multiple payment methods supported

### 3. **Video Call Room**
- Real-time video and audio communication
- Video/Audio toggle controls
- Call timer showing remaining time
- Automatic call termination when time expires
- Call history tracking (date, time, duration)

### 4. **Call History**
- View all past and upcoming video calls
- See payment status, duration, and call details
- Filter by status (SCHEDULED, ONGOING, COMPLETED, CANCELLED, EXPIRED)

## Backend Setup

### Database Migration
The video calls table has been created. Run migrations if needed:
```bash
cd backend
alembic upgrade head
```

### Environment Variables
Add these to your `.env` file:
```env
# Agora Video SDK (for production)
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_certificate

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Note:** For development, the system uses mock tokens and payment orders. For production, you'll need:
1. Agora account for video calling
2. Razorpay account for payments

### API Endpoints

#### Create Video Call
```
POST /api/video-calls/create
Body: {
  "patient_name": "string",
  "patient_phone": "string",
  "patient_email": "string",
  "call_type": "VIDEO",
  "duration_minutes": 15,
  "scheduled_start_time": "2024-01-20T10:00:00Z",
  "payment_method": "UPI"
}
```

#### Join Video Call
```
POST /api/video-calls/join
Body: {
  "call_id": "string",
  "user_role": "PATIENT"
}
```

#### End Video Call
```
POST /api/video-calls/end
Body: {
  "call_id": "string"
}
```

#### Verify Payment
```
POST /api/video-calls/payment/verify?call_id={call_id}&payment_id={payment_id}&signature={signature}
```

#### Get Call History
```
GET /api/video-calls/history
```

#### Get Call Details
```
GET /api/video-calls/{call_id}
```

## Frontend Routes

- `/video-call` - Book a new video call
- `/video-call/:callId` - Join an active video call
- `/call-history` - View call history

## How It Works

### Booking Flow
1. Patient selects date, time, and duration
2. System calculates consultation fee based on duration
3. Razorpay payment order is created
4. Patient completes payment via Razorpay
5. Payment is verified on backend
6. Video call is scheduled and meeting link is generated

### Call Flow
1. Patient clicks meeting link or navigates to `/video-call/{callId}`
2. System checks payment status
3. If payment completed, patient joins video call room
4. Call timer starts counting down from scheduled duration
5. Video/audio controls available
6. Call automatically ends when time expires or manually ended
7. Call history is updated with actual duration

## Production Setup

### 1. Agora Integration
For production video calling, you'll need to:
1. Sign up at https://www.agora.io/
2. Create a project and get App ID and App Certificate
3. Install Agora SDK: `npm install agora-rtc-sdk-ng`
4. Update `VideoCallRoom.tsx` to use Agora SDK instead of basic WebRTC

### 2. Razorpay Setup
1. Sign up at https://razorpay.com/
2. Get your Key ID and Key Secret from dashboard
3. Add them to backend `.env` file
4. Update Razorpay key in `VideoCallBooking.tsx` (line with `rzp_test_...`)

### 3. Calendar Integration (Optional)
The system is ready for calendar integration. You can add:
- Google Calendar API
- Outlook Calendar API
- iCal export

## Testing

### Development Mode
- Mock tokens and payment orders are used
- No actual payment processing
- Basic WebRTC for video (camera/microphone access required)

### Production Mode
- Real Agora video calls
- Real Razorpay payments
- Full calendar integration

## Security Features

- JWT authentication required for all endpoints
- Payment signature verification
- Call access restricted to authenticated users
- Payment required before call access
- Automatic call expiration handling

## Future Enhancements

- Doctor-side video call interface
- Screen sharing
- Chat during call
- Recording functionality
- Email/SMS notifications
- Calendar sync (Google/Outlook)
- Waiting room feature
- Multi-participant calls
