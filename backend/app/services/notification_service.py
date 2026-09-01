import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from twilio.rest import Client
from datetime import datetime
from typing import Dict, Optional

class NotificationService:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        
        # Initialize Twilio client if credentials are available
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            self.twilio_phone = settings.TWILIO_PHONE_NUMBER
        else:
            self.twilio_client = None
    
    def send_email(self, to_email: str, subject: str, body: str):
        """Send an email"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    def send_sms(self, to_phone: str, message: str):
        """Send an SMS"""
        if not self.twilio_client:
            print("Twilio not configured")
            return False
        
        try:
            message = self.twilio_client.messages.create(
                body=message,
                from_=self.twilio_phone,
                to=to_phone
            )
            return True
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return False
    
    def send_appointment_confirmation_email(self, email: str, appointment_details: dict):
        """Send appointment confirmation email"""
        subject = "Appointment Confirmation - HealthCare Plus"
        body = f"""
        <h2>Appointment Confirmed</h2>
        <p>Dear {appointment_details.get('patient_name')},</p>
        <p>Your appointment has been confirmed.</p>
        <p><strong>Date:</strong> {appointment_details.get('appointment_date')}</p>
        <p><strong>Time:</strong> {appointment_details.get('appointment_time')}</p>
        <p><strong>Consultation Fee:</strong> ₹{appointment_details.get('consultation_fee')}</p>
        <p>Thank you for choosing HealthCare Plus.</p>
        """
        return self.send_email(email, subject, body)
    
    def send_password_reset_email(self, email: str, reset_token: str):
        """Send password reset email"""
        subject = "Password Reset - HealthCare Plus"
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        body = f"""
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p><a href="{reset_url}">{reset_url}</a></p>
        <p>This link will expire in 1 hour.</p>
        """
        return self.send_email(email, subject, body)
    
    def send_video_call_invite_to_doctor(
        self, 
        call_id: str,
        meeting_link: str,
        patient_name: str,
        call_type: str,
        duration_minutes: int,
        consultation_fee: float,
        scheduled_time: datetime,
        patient_phone: Optional[str] = None
    ):
        """Send video call invite to doctor via email and SMS"""
        # Format scheduled time
        scheduled_str = scheduled_time.strftime("%B %d, %Y at %I:%M %p")
        
        # Determine call type label
        call_type_labels = {
            10: "Quick Consult",
            15: "Standard Consult",
            25: "Detailed Consult",
            30: "Extended Consult"
        }
        call_type_label = call_type_labels.get(duration_minutes, f"{duration_minutes} min")
        
        # Send Email
        email_subject = f"New Video Call Appointment - {patient_name}"
        email_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .info-box {{ background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }}
                .info-row {{ margin: 10px 0; }}
                .label {{ font-weight: bold; color: #666; }}
                .value {{ color: #333; }}
                .button {{ display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }}
                .button:hover {{ background: #2563eb; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📹 New Video Call Appointment</h1>
                </div>
                <div class="content">
                    <p>Dear Dr. Jayshankar Prasad Singh,</p>
                    <p>You have a new video consultation scheduled:</p>
                    
                    <div class="info-box">
                        <div class="info-row">
                            <span class="label">Patient Name:</span>
                            <span class="value">{patient_name}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Call Type:</span>
                            <span class="value">{call_type_label} ({duration_minutes} minutes)</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Scheduled Time:</span>
                            <span class="value">{scheduled_str}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Consultation Fee:</span>
                            <span class="value">₹{consultation_fee}</span>
                        </div>
                        {f'<div class="info-row"><span class="label">Patient Phone:</span><span class="value">{patient_phone}</span></div>' if patient_phone else ''}
                        <div class="info-row">
                            <span class="label">Call ID:</span>
                            <span class="value">{call_id}</span>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{meeting_link}" class="button">Join Video Call</a>
                    </div>
                    
                    <p style="margin-top: 20px;">
                        <strong>Meeting Link:</strong><br>
                        <a href="{meeting_link}" style="color: #3b82f6; word-break: break-all;">{meeting_link}</a>
                    </p>
                    
                    <p style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; border-left: 4px solid #f59e0b;">
                        <strong>Note:</strong> Please join the call a few minutes before the scheduled time. 
                        The call will automatically end after {duration_minutes} minutes.
                    </p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from HealthCare Plus</p>
                    <p>© {datetime.now().year} HealthCare Plus. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        email_sent = False
        if settings.DOCTOR_EMAIL:
            email_sent = self.send_email(settings.DOCTOR_EMAIL, email_subject, email_body)
            print(f"Video call invite email sent to doctor: {email_sent}")
        else:
            print("Doctor email not configured, skipping email notification")
        
        # Send SMS
        sms_message = f"""New Video Call Appointment

Patient: {patient_name}
Type: {call_type_label} ({duration_minutes} min)
Date & Time: {scheduled_str}
Fee: ₹{consultation_fee}

Join: {meeting_link}

Call ID: {call_id}"""
        
        sms_sent = False
        if settings.DOCTOR_PHONE:
            sms_sent = self.send_sms(settings.DOCTOR_PHONE, sms_message)
            print(f"Video call invite SMS sent to doctor: {sms_sent}")
        else:
            print("Doctor phone not configured, skipping SMS notification")
        
        return {
            "email_sent": email_sent,
            "sms_sent": sms_sent
        }