# SMTP Configuration Issue Solution

## Problem
The error "Missing credentials for PLAIN" indicates that the backend server is trying to send OTP emails but doesn't have proper SMTP authentication credentials configured.

## Root Cause
This is a backend configuration issue, not a frontend issue. The backend server needs SMTP credentials to send OTP emails.

## Frontend Improvements Made
1. Enhanced error handling in `staff-login.tsx` to provide better user feedback
2. Added specific error messages for SMTP/email service issues
3. Improved the generic API error handler to catch SMTP-related errors
4. Created environment configuration templates

## Backend Solution Required
The backend team needs to configure SMTP settings in their environment. Here's what they need to add to their backend `.env` file:

```env
# SMTP Configuration for sending OTP emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

## For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" (not your regular password)
3. Use the app password in SMTP_PASS

## Alternative Email Services:
- **SendGrid**: Professional email service with API
- **AWS SES**: Amazon's email service
- **Outlook/Hotmail**: Use `smtp-mail.outlook.com`
- **Yahoo**: Use `smtp.mail.yahoo.com`

## Testing
After backend SMTP configuration:
1. Try the staff login with a valid email/password
2. The system should successfully send OTP emails
3. User will receive better error messages if email service fails

## Temporary Workaround
If SMTP cannot be configured immediately:
1. Backend could implement a mock email service for development
2. OTP could be logged to console instead of emailed
3. Use a development-only endpoint that skips email verification

## Production Considerations
- Use a professional email service (SendGrid, AWS SES)
- Implement proper error logging and monitoring
- Add retry mechanisms for failed email sends
- Consider email templates for better user experience
