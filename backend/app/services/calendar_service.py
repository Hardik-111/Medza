import os
from datetime import datetime, timedelta
from typing import Optional, List, Dict
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from app.core.config import settings
from app.models.appointment import Appointment
from app.models.video_call import VideoCall
from sqlalchemy.orm import Session

class CalendarService:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CalendarService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        # Only initialize once
        if CalendarService._initialized:
            return
        
        CalendarService._initialized = True
        self.calendar_id = settings.GOOGLE_CALENDAR_ID
        self.enabled = settings.GOOGLE_CALENDAR_ENABLED
        
        if not self.enabled:
            print("Google Calendar integration is disabled")
            self.service = None
            return
        
        try:
            if settings.GOOGLE_CREDENTIALS_FILE and os.path.exists(settings.GOOGLE_CREDENTIALS_FILE):
                credentials = service_account.Credentials.from_service_account_file(
                    settings.GOOGLE_CREDENTIALS_FILE,
                    scopes=['https://www.googleapis.com/auth/calendar']
                )
                self.service = build('calendar', 'v3', credentials=credentials)
                print("Google Calendar service initialized successfully")
            else:
                print("Google Calendar credentials file not found, calendar integration disabled")
                self.service = None
                self.enabled = False
        except Exception as e:
            print(f"Error initializing Google Calendar service: {e}")
            self.service = None
            self.enabled = False
    
    def check_availability(
        self, 
        start_time: datetime, 
        duration_minutes: int,
        db: Session,
        exclude_appointment_id: Optional[str] = None,
        exclude_video_call_id: Optional[str] = None
    ) -> bool:
        """
        Check if a time slot is available
        Returns True if available, False if booked
        """
        end_time = start_time + timedelta(minutes=duration_minutes)
        
        # Check database appointments
        # Default appointment duration is 30 minutes
        appointment_duration = timedelta(minutes=30)
        conflicting_appointments = db.query(Appointment).filter(
            Appointment.appointment_status.in_(["SCHEDULED", "CONFIRMED"]),
            Appointment.appointment_date < end_time
        ).all()
        
        # Filter appointments that actually overlap (check end time in Python)
        overlapping_appointments = []
        for apt in conflicting_appointments:
            apt_end_time = apt.appointment_date + appointment_duration
            if apt_end_time > start_time:
                overlapping_appointments.append(apt)
        
        # Exclude the appointment being rescheduled
        if exclude_appointment_id:
            overlapping_appointments = [apt for apt in overlapping_appointments if apt.id != exclude_appointment_id]
        
        if overlapping_appointments:
            print(f"Found {len(overlapping_appointments)} conflicting appointments in database")
            return False
        
        # Check database video calls
        conflicting_video_calls = db.query(VideoCall).filter(
            VideoCall.call_status.in_(["SCHEDULED", "ONGOING"]),
            VideoCall.scheduled_start_time < end_time
        ).all()
        
        # Filter video calls that actually overlap (check end time in Python)
        overlapping_video_calls = []
        for vc in conflicting_video_calls:
            vc_end_time = vc.scheduled_start_time + timedelta(minutes=vc.duration_minutes)
            if vc_end_time > start_time:
                overlapping_video_calls.append(vc)
        
        # Exclude the video call being rescheduled
        if exclude_video_call_id:
            overlapping_video_calls = [vc for vc in overlapping_video_calls if vc.id != exclude_video_call_id]
        
        if overlapping_video_calls:
            print(f"Found {len(overlapping_video_calls)} conflicting video calls in database")
            return False
        
        # Check Google Calendar if enabled
        if self.enabled and self.service:
            try:
                # Convert to RFC3339 format for Google Calendar
                time_min = start_time.isoformat() + 'Z'
                time_max = end_time.isoformat() + 'Z'
                
                events_result = self.service.events().list(
                    calendarId=self.calendar_id,
                    timeMin=time_min,
                    timeMax=time_max,
                    singleEvents=True,
                    orderBy='startTime'
                ).execute()
                
                events = events_result.get('items', [])
                
                # Filter out events that don't actually conflict
                for event in events:
                    event_start = event.get('start', {}).get('dateTime') or event.get('start', {}).get('date')
                    event_end = event.get('end', {}).get('dateTime') or event.get('end', {}).get('date')
                    
                    if event_start and event_end:
                        # Parse event times
                        if 'T' in event_start:
                            event_start_dt = datetime.fromisoformat(event_start.replace('Z', '+00:00'))
                            event_end_dt = datetime.fromisoformat(event_end.replace('Z', '+00:00'))
                        else:
                            # All-day event
                            event_start_dt = datetime.fromisoformat(event_start)
                            event_end_dt = datetime.fromisoformat(event_end) + timedelta(days=1)
                        
                        # Check for overlap
                        if event_start_dt < end_time and event_end_dt > start_time:
                            print(f"Found conflicting Google Calendar event: {event.get('summary', 'Untitled')}")
                            return False
                
            except HttpError as e:
                print(f"Error checking Google Calendar: {e}")
                # If calendar check fails, rely on database check only
                pass
        
        return True
    
    def create_calendar_event(
        self,
        title: str,
        start_time: datetime,
        duration_minutes: int,
        description: str = "",
        meeting_link: Optional[str] = None
    ) -> Optional[str]:
        """
        Create a calendar event and return the event ID
        """
        if not self.enabled or not self.service:
            print("Google Calendar not enabled, skipping event creation")
            return None
        
        try:
            end_time = start_time + timedelta(minutes=duration_minutes)
            
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                },
            }
            
            if meeting_link:
                event['location'] = meeting_link
                event['description'] = f"{description}\n\nMeeting Link: {meeting_link}"
            
            created_event = self.service.events().insert(
                calendarId=self.calendar_id,
                body=event
            ).execute()
            
            event_id = created_event.get('id')
            print(f"Created Google Calendar event: {event_id}")
            return event_id
            
        except HttpError as e:
            print(f"Error creating Google Calendar event: {e}")
            return None
    
    def delete_calendar_event(self, event_id: str) -> bool:
        """
        Delete a calendar event
        """
        if not self.enabled or not self.service:
            return False
        
        try:
            self.service.events().delete(
                calendarId=self.calendar_id,
                eventId=event_id
            ).execute()
            print(f"Deleted Google Calendar event: {event_id}")
            return True
        except HttpError as e:
            print(f"Error deleting Google Calendar event: {e}")
            return False
    
    def update_calendar_event(
        self,
        event_id: str,
        title: str,
        start_time: datetime,
        duration_minutes: int,
        description: str = "",
        meeting_link: Optional[str] = None
    ) -> bool:
        """
        Update a calendar event
        """
        if not self.enabled or not self.service:
            return False
        
        try:
            end_time = start_time + timedelta(minutes=duration_minutes)
            
            event = {
                'summary': title,
                'description': description,
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                },
            }
            
            if meeting_link:
                event['location'] = meeting_link
                event['description'] = f"{description}\n\nMeeting Link: {meeting_link}"
            
            self.service.events().update(
                calendarId=self.calendar_id,
                eventId=event_id,
                body=event
            ).execute()
            
            print(f"Updated Google Calendar event: {event_id}")
            return True
            
        except HttpError as e:
            print(f"Error updating Google Calendar event: {e}")
            return False
