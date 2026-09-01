# Google Calendar Integration Setup Guide

This guide will walk you through setting up Google Calendar integration for blocking time slots and preventing double-booking.

## Prerequisites

- A Google account (Gmail account)
- Access to Google Cloud Console
- The doctor's Google Calendar email address

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `MediAssist Calendar` (or any name you prefer)
5. Click **"Create"**
6. Wait for the project to be created and select it

### Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and click **"Enable"**
4. Wait for the API to be enabled

### Step 3: Create a Service Account

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"Service Account"**
4. Fill in the details:
   - **Service account name**: `mediassist-calendar` (or any name)
   - **Service account ID**: Will be auto-generated (e.g., `mediassist-calendar@your-project.iam.gserviceaccount.com`)
   - **Description**: `Service account for MediAssist calendar integration`
5. Click **"CREATE AND CONTINUE"**
6. Skip the optional steps (Grant access, Grant users access) and click **"DONE"**

### Step 4: Create and Download Service Account Key

1. In the **"Credentials"** page, find your newly created service account
2. Click on the service account email (e.g., `mediassist-calendar@your-project.iam.gserviceaccount.com`)
3. Go to the **"Keys"** tab
4. Click **"ADD KEY"** > **"Create new key"**
5. Select **"JSON"** format
6. Click **"CREATE"**
7. A JSON file will be downloaded - **SAVE THIS FILE SECURELY** (you'll need it in Step 6)

**Important**: The downloaded file will look like this:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "mediassist-calendar@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

### Step 5: Share Calendar with Service Account

**This is the most important step!** The service account needs permission to create events in the doctor's calendar.

1. Open [Google Calendar](https://calendar.google.com/)
2. Make sure you're logged in with the **doctor's Google account** (the one whose calendar you want to use)
3. On the left sidebar, find **"My calendars"** and hover over the calendar you want to use (usually "Primary" or your name)
4. Click the three dots (⋮) next to the calendar name
5. Select **"Settings and sharing"**
6. Scroll down to **"Share with specific people"**
7. Click **"Add people"**
8. Enter the **service account email** (from Step 3, e.g., `mediassist-calendar@your-project.iam.gserviceaccount.com`)
9. Set the permission to **"Make changes to events"** (important!)
10. Click **"Send"**
11. The service account will receive an email invitation - you can ignore this, the sharing is already active

### Step 6: Configure Backend

1. Copy the downloaded JSON file to your backend directory:
   ```bash
   cp ~/Downloads/your-project-xxxxx.json backend/google-calendar-credentials.json
   ```
   
   **Note**: Replace `your-project-xxxxx.json` with the actual filename you downloaded.

2. **IMPORTANT**: Add `google-calendar-credentials.json` to `.gitignore` to keep credentials secure:
   ```bash
   echo "google-calendar-credentials.json" >> backend/.gitignore
   ```

3. Update your `.env` file in the `backend/` directory:

   ```env
   # Google Calendar Configuration
   GOOGLE_CALENDAR_ID=primary
   GOOGLE_CREDENTIALS_FILE=/absolute/path/to/backend/google-calendar-credentials.json
   GOOGLE_CALENDAR_ENABLED=true
   ```

   **Important Notes**:
   - `GOOGLE_CALENDAR_ID`: 
     - Use `primary` for the main calendar (most common)
     - Or use the calendar ID if you want a specific calendar
     - To find a calendar ID: Google Calendar > Settings > Calendar > Scroll to "Integrate calendar" > Copy "Calendar ID"
   
   - `GOOGLE_CREDENTIALS_FILE`: 
     - Use **absolute path** (full path from root)
     - Example on Mac: `/Users/hasingh/Desktop/MediAssist/backend/google-calendar-credentials.json`
     - Example on Linux: `/home/username/MediAssist/backend/google-calendar-credentials.json`
     - Example on Windows: `C:\Users\username\Desktop\MediAssist\backend\google-calendar-credentials.json`
   
   - `GOOGLE_CALENDAR_ENABLED`: Set to `true` to enable, `false` to disable

### Step 7: Install Dependencies

Make sure you have the required Python packages:

```bash
cd backend
pip install -r requirements.txt
```

The required packages are already in `requirements.txt`:
- `google-api-python-client==2.108.0`
- `google-auth-httplib2==0.1.1`
- `google-auth-oauthlib==1.1.0`

### Step 8: Run Database Migration

If you haven't already, run the migration to add the `calendar_event_id` column:

```bash
cd backend
alembic upgrade head
```

### Step 9: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. Check the console output - you should see:
   ```
   Google Calendar service initialized successfully
   ```

3. Try booking a video call or appointment - it should:
   - Check availability
   - Create a calendar event in the doctor's Google Calendar
   - Prevent double-booking

## Troubleshooting

### Issue: "Google Calendar integration is disabled"
- Check that `GOOGLE_CALENDAR_ENABLED=true` in your `.env` file
- Restart the server after changing `.env`

### Issue: "Google Calendar credentials file not found"
- Verify the path in `GOOGLE_CREDENTIALS_FILE` is **absolute** (full path)
- Check that the file exists at that location
- Make sure the file has proper read permissions

### Issue: "Error initializing Google Calendar service"
- Verify the JSON credentials file is valid
- Check that Google Calendar API is enabled in Google Cloud Console
- Ensure the service account has the correct permissions

### Issue: "403 Forbidden" or "Permission denied"
- Make sure you shared the calendar with the service account email (Step 5)
- Verify the permission is set to **"Make changes to events"** (not just "See all event details")
- The service account email should match exactly (copy-paste it)

### Issue: Calendar events not appearing
- Check that the calendar was shared correctly (Step 5)
- Verify `GOOGLE_CALENDAR_ID` is correct (use `primary` for main calendar)
- Check the service account email has access to the calendar

## Which Email/Calendar to Use?

### Doctor's Email
- Use the **doctor's personal Gmail account** or Google Workspace account
- This is the account whose calendar will be blocked
- Example: `doctor.jayshankar@gmail.com` or `jayshankar@healthcareplus.com`

### Calendar ID
- **`primary`**: The main/default calendar (recommended for most cases)
- **Custom Calendar ID**: If the doctor wants a separate calendar for appointments
  - To find: Google Calendar > Settings > Calendar > "Integrate calendar" > Copy "Calendar ID"
  - Example: `abc123def456@group.calendar.google.com`

### Service Account Email
- This is **automatically generated** when you create the service account
- Format: `service-account-name@project-id.iam.gserviceaccount.com`
- Example: `mediassist-calendar@your-project-123456.iam.gserviceaccount.com`
- **You don't need to use this email** - it's just for authentication

## Security Best Practices

1. **Never commit credentials to Git**:
   - Add `google-calendar-credentials.json` to `.gitignore`
   - Add `.env` to `.gitignore` (if not already there)

2. **Use environment variables**:
   - Keep credentials in `.env` file (not in code)
   - Use absolute paths for credential files

3. **Limit service account permissions**:
   - Only grant "Make changes to events" permission
   - Don't grant "Make changes and manage sharing"

4. **Rotate credentials periodically**:
   - Create new service account keys if compromised
   - Revoke old keys in Google Cloud Console

## Example .env Configuration

```env
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=primary
GOOGLE_CREDENTIALS_FILE=/Users/hasingh/Desktop/MediAssist/backend/google-calendar-credentials.json
GOOGLE_CALENDAR_ENABLED=true

# Other existing configs...
DOCTOR_EMAIL=doctor.jayshankar@gmail.com
DOCTOR_PHONE=+917905152928
FRONTEND_URL=http://localhost:8080
```

## Quick Reference

- **Service Account Email**: `mediassist-calendar@your-project.iam.gserviceaccount.com` (from Step 3)
- **Doctor's Calendar Email**: `doctor.jayshankar@gmail.com` (the doctor's Gmail)
- **Calendar ID**: `primary` (or custom calendar ID)
- **Credentials File**: `backend/google-calendar-credentials.json` (the downloaded JSON file)

## Need Help?

If you encounter issues:
1. Check the backend console logs for error messages
2. Verify all steps were completed correctly
3. Ensure the service account email has calendar access
4. Test with `GOOGLE_CALENDAR_ENABLED=false` first to verify other functionality works
