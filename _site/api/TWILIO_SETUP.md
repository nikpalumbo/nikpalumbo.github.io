# Twilio WhatsApp Setup Guide

## Step 1: Create a Twilio Account
1. Go to [twilio.com](https://www.twilio.com) and sign up for a free account
2. Verify your email and phone number

## Step 2: Get Your Credentials
1. Go to your Twilio Console Dashboard
2. Copy your **Account SID** and **Auth Token**
3. Note: Keep your Auth Token secure - it's like a password!

## Step 3: Enable WhatsApp Sandbox
1. In the Twilio Console, go to "Messaging" → "Try it out" → "Send a WhatsApp message"
2. Follow the instructions to join your WhatsApp sandbox
3. Copy your sandbox number (it will be something like +14155238886)

## Step 4: Configure Environment Variables
1. Copy `env_template.txt` to `.env`
2. Replace the placeholder values:
   ```
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_actual_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ```

## Step 5: Install Dependencies
```bash
cd api
pip3 install -r requirements.txt
```

## Step 6: Test the Setup
1. Start the API server: `python3 main.py`
2. The server will show if your Twilio credentials are properly configured
3. Test by submitting the form on your landing page

## Troubleshooting
- **"Invalid phone number"**: Make sure the phone number starts with + and country code
- **"Authentication failed"**: Check your Account SID and Auth Token
- **"Phone number not verified"**: In trial accounts, you can only send to verified numbers
- **"WhatsApp sandbox"**: Users need to join your WhatsApp sandbox first

## Free Trial Limits
- Twilio free trial: $15-20 credit
- WhatsApp messages: Free in sandbox mode
- Production WhatsApp: Requires approval from Twilio