# main.py
from fastapi import FastAPI, HTTPException, Depends, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import asyncio
import asyncpg
import os
from datetime import datetime, timedelta
import json
import aiohttp
import secrets
import string
from dotenv import load_dotenv
from twilio.rest import Client
from twilio.base.exceptions import TwilioException


# Load environment variables from .env file
load_dotenv(override=True)

# Debug: Print environment variables
print("🔍 Environment variables after load_dotenv:")
print(f"TWILIO_ACCOUNT_SID: {'✅ Set' if os.getenv('TWILIO_ACCOUNT_SID') else '❌ Missing'}")
print(f"TWILIO_AUTH_TOKEN: {'✅ Set' if os.getenv('TWILIO_AUTH_TOKEN') else '❌ Missing'}")
print(f"TWILIO_WHATSAPP_NUMBER: {'✅ Set' if os.getenv('TWILIO_WHATSAPP_NUMBER') else '❌ Missing'}")
print(f"DATABASE_URL: {'✅ Set' if os.getenv('DATABASE_URL') else '❌ Missing'}")

app = FastAPI(title="Twilio WhatsApp API", description="API for WhatsApp lead capture and follow-ups")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WhatsAppRequest(BaseModel):
    name: str
    phone: str
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()
    
    @validator('phone')
    def phone_must_be_valid(cls, v):
        # Basic phone validation - remove spaces and common characters
        cleaned = ''.join(filter(str.isdigit, v))
        if len(cleaned) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        # Ensure it starts with +
        if not v.startswith('+'):
            return '+' + cleaned
        return v

class WhatsAppResponse(BaseModel):
    success: bool
    message: str
    user_id: int = None

class FollowUpResponse(BaseModel):
    success: bool
    message: str
    processed_count: int = 0

# Database connection
async def get_database_connection():
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        # For local testing without database
        return None
    
    try:
        conn = await asyncpg.connect(database_url)
        return conn
    except Exception as e:
        # For local testing, return None instead of raising error
        print(f"Database connection failed: {str(e)}")
        return None

# Generate unique download token
def generate_download_token():
    """Generate a secure, unique token for download links"""
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(32))
    return token

# Create download token in database
async def create_download_token(user_id: int, file_type: str = 'roadmap'):
    """Create a unique download token for a user"""
    try:
        conn = await get_database_connection()
        if not conn:
            # For local testing, return a mock token
            return f"test_token_{user_id}_{int(datetime.now().timestamp())}"
        
        token = generate_download_token()
        expires_at = datetime.now() + timedelta(days=7)  # Token expires in 7 days
        
        # Insert token into database
        await conn.execute("""
            INSERT INTO download_tokens (user_id, token, file_type, expires_at, created_at)
            VALUES ($1, $2, $3, $4, $5)
        """, user_id, token, file_type, expires_at, datetime.now())
        
        await conn.close()
        print(f"📱 Created download token for user {user_id}: {token[:8]}...")
        return token
        
    except Exception as e:
        print(f"❌ Error creating download token: {e}")
        # Return a fallback token
        return f"fallback_token_{user_id}_{int(datetime.now().timestamp())}"

# Twilio WhatsApp API integration with template
async def send_whatsapp_message(name: str, phone: str, download_token: str):
    """Send WhatsApp message using Twilio WhatsApp API with template"""
    try:
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        from_whatsapp = os.getenv('TWILIO_WHATSAPP_NUMBER')
        
        print(f"🔑 Twilio Account SID: {'✅ Set' if account_sid else '❌ Missing'}")
        print(f"🔑 Twilio Auth Token: {'✅ Set' if auth_token else '❌ Missing'}")
        print(f"📱 Twilio WhatsApp Number: {'✅ Set' if from_whatsapp else '❌ Missing'}")
        
        if not account_sid or not auth_token or not from_whatsapp:
            print("⚠️ Twilio WhatsApp credentials not configured")
            return False
        
        # Initialize Twilio client
        client = Client(account_sid, auth_token)
        
        # Create download URL with token (configurable via environment)
        api_base_url = os.getenv('API_BASE_URL', 'http://localhost:8081')
        if api_base_url == 'http://localhost:8081':
            # Local development
            download_url = f"{api_base_url}/api/download/roadmap/{download_token}"
        else:
            # Production - use api.sdw.solutions subdomain
            download_url = f"https://api.sdw.solutions/api/download/roadmap/{download_token}"
        
        print(f"📱 Sending WhatsApp template message to: {phone}")
        print(f"📱 From WhatsApp number: {from_whatsapp}")
        print(f"📱 Download URL: {download_url}")
        
        # Send WhatsApp message using approved template (required for business messaging)
        try:
            # Use the correct Twilio template syntax with proper content variables format
            message = client.messages.create(
                from_=f"whatsapp:{from_whatsapp}",
                to=f"whatsapp:{phone}",
                content_sid='HX584cd3921e65d16cb56e7730855d4ecc',  # Your template SID
                content_variables=f'{{"name": "{name}"}}'  # JSON string format - using old template temporarily
            )
            print(f"✅ Template message sent successfully: {message.sid}")
        except TwilioException as e:
            print(f"❌ Twilio template error: {e}")
            print(f"❌ Error code: {e.code}")
            print(f"❌ Error message: {e.msg}")
            
            # Fallback to SMS if template fails
            print(f"📱 Falling back to SMS for {name}")
            try:
                sms_message = client.messages.create(
                    from_=from_whatsapp.replace('whatsapp:', ''),  # Remove whatsapp: prefix for SMS
                    to=phone,
                    body=f"Hello {name},\n\nHere is the roadmap I mentioned.\n\nIt shows how I turned 20K into 100+ paying clients by launching fast and scaling lean.\n\nPlease get in touch if you'd like to discuss it more, happy to walk you through the steps.\n\nBest,\nNicola Palumbo\n\nP.S. Your next 100 clients might be closer than you think!\n\nDownload: {download_url}"
                )
                print(f"✅ SMS sent successfully: {sms_message.sid}")
                return True
            except Exception as sms_error:
                print(f"❌ SMS fallback also failed: {sms_error}")
                raise e
        
        print(f"✅ WhatsApp message sent successfully to {name} ({phone})")
        print(f"📱 Message SID: {message.sid}")
        return True
        
    except TwilioException as e:
        print(f"❌ Twilio WhatsApp error: {e}")
        print(f"❌ Error code: {e.code}")
        print(f"❌ Error message: {e.msg}")
        return False
    except Exception as e:
        print(f"❌ Error sending WhatsApp message: {e}")
        import traceback
        traceback.print_exc()
        return False

# API Key validation
async def verify_api_key(request: Request):
    api_key = request.headers.get('Authorization')
    if not api_key or not api_key.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="API key required")
    
    expected_key = os.getenv('API_SECRET_KEY')
    if not expected_key or api_key != f"Bearer {expected_key}":
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return True

@app.get("/")
def read_root():
    return {"message": "WhatsApp API is running!"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/roadmap/{token}")
async def roadmap_landing_page(token: str):
    """Landing page for roadmap - used in WhatsApp template validation"""
    try:
        # Always serve the HTML page (no token validation for template approval)
        # This allows WhatsApp to validate the URL during template approval
        html_path = os.path.join(os.path.dirname(__file__), 'roadmap.html')
        if os.path.exists(html_path):
            with open(html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            from fastapi.responses import HTMLResponse
            return HTMLResponse(content=html_content)
        else:
            return {"error": "Roadmap page not found"}
            
    except Exception as e:
        print(f"❌ Error serving roadmap page: {e}")
        return {"error": "Internal server error"}

@app.get("/api/download/roadmap/{token}")
async def download_roadmap(token: str):
    """Download roadmap file using unique token"""
    try:
        conn = await get_database_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # Verify token exists and is not expired
        token_record = await conn.fetchrow("""
            SELECT user_id, expires_at, downloaded_at, file_type
            FROM download_tokens 
            WHERE token = $1
        """, token)
        
        if not token_record:
            raise HTTPException(status_code=404, detail="Invalid download token")
        
        # Check if token is expired
        if token_record['expires_at'] < datetime.now():
            raise HTTPException(status_code=410, detail="Download token has expired")
        
        # Mark as downloaded
        await conn.execute("""
            UPDATE download_tokens 
            SET downloaded_at = $1 
            WHERE token = $2
        """, datetime.now(), token)
        
        await conn.close()
        
        # Serve the actual file
        file_path = os.getenv('ROADMAP_FILE_PATH', 'roadmap.pdf')
        
        # Handle different deployment environments
        if not os.path.isabs(file_path):
            # If relative path, try multiple locations
            possible_paths = [
                file_path,  # Current directory
                os.path.join(os.path.dirname(__file__), file_path),  # Same directory as main.py
                os.path.join(os.getcwd(), file_path),  # Working directory
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    file_path = path
                    break
            else:
                print(f"❌ Roadmap file not found in any of these locations: {possible_paths}")
                raise HTTPException(status_code=404, detail="Roadmap file not found")
        
        print(f"📁 Serving roadmap from: {file_path}")
        try:
            with open(file_path, "rb") as file:
                file_content = file.read()
            
            from fastapi.responses import Response
            return Response(
                content=file_content,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename=growth-roadmap.pdf",
                    "Content-Length": str(len(file_content))
                }
            )
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Roadmap file not found")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing download: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/whatsapp/submit")
async def submit_whatsapp_form(request: WhatsAppRequest):
    """Submit WhatsApp lead capture form"""
    try:
        print(f"🔍 Processing form submission for: {request.name} ({request.phone})")
        
        # Connect to database
        conn = await get_database_connection()
        
        if conn:
            # Check if user already exists
            existing_user = await conn.fetchrow("""
                SELECT id FROM users WHERE phone = $1
            """, request.phone)
            
            if existing_user:
                # User exists, update their name and get their ID
                await conn.execute("""
                    UPDATE users SET name = $1, updated_at = $2 WHERE phone = $3
                """, request.name, datetime.now(), request.phone)
                user_id = existing_user['id']
                print(f"📱 Existing user updated - {request.name} ({request.phone})")
            else:
                # New user, insert them
                user_id = await conn.fetchval("""
                    INSERT INTO users (name, phone, created_at, status)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id
                """, request.name, request.phone, datetime.now(), 'new')
                print(f"📱 New user created - {request.name} ({request.phone})")
            
            # Log the submission
            await conn.execute("""
                INSERT INTO message_logs (user_id, message_type, content, created_at)
                VALUES ($1, $2, $3, $4)
            """, user_id, 'initial_submission', f"New lead: {request.name} - {request.phone}", datetime.now())
            
            await conn.close()
        else:
            # For local testing without database
            user_id = 999
            print(f"📱 Local test: New lead captured - {request.name} ({request.phone})")
        
        # Generate unique download token
        print(f"🔑 Generating download token for user {user_id}...")
        download_token = await create_download_token(user_id, 'roadmap')
        
        # Send WhatsApp message with download link
        print(f"📤 Attempting to send WhatsApp message...")
        whatsapp_sent = await send_whatsapp_message(request.name, request.phone, download_token)
        print(f"📤 WhatsApp send result: {whatsapp_sent}")
        
        if whatsapp_sent:
            return WhatsAppResponse(
                success=True,
                message="Thank you! We'll send the roadmap via WhatsApp shortly.",
                user_id=user_id
            )
        else:
            return WhatsAppResponse(
                success=False,
                message="Sorry, there was an error sending the roadmap. Please try again or contact us directly.",
                user_id=user_id
            )
        
    except Exception as e:
        print(f"❌ Error processing form submission: {e}")
        import traceback
        traceback.print_exc()
        return WhatsAppResponse(
            success=False,
            message="Sorry, there was an error. Please try again."
        )

@app.post("/api/whatsapp/follow-up")
async def send_follow_up(request: Request, api_key: bool = Depends(verify_api_key)):
    """Send follow-up messages to leads"""
    try:
        conn = await get_database_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # Get users who haven't received follow-up
        users = await conn.fetch("""
            SELECT id, name, phone FROM users 
            WHERE status = 'new' AND created_at < NOW() - INTERVAL '24 hours'
            LIMIT 10
        """)
        
        processed_count = 0
        
        for user in users:
            # Send follow-up message
            success = await send_whatsapp_message(
                user['name'], 
                user['phone']
            )
            
            if success:
                # Update user status
                await conn.execute("""
                    UPDATE users SET status = 'followed_up' WHERE id = $1
                """, user['id'])
                
                # Log the follow-up
                await conn.execute("""
                    INSERT INTO message_logs (user_id, message_type, content, created_at)
                    VALUES ($1, $2, $3, $4)
                """, user['id'], 'follow_up', f"Follow-up sent to {user['name']}", datetime.now())
                
                processed_count += 1
        
        await conn.close()
        
        return FollowUpResponse(
            success=True,
            message=f"Follow-up messages sent to {processed_count} users",
            processed_count=processed_count
        )
        
    except Exception as e:
        print(f"❌ Error sending follow-ups: {e}")
        return FollowUpResponse(
            success=False,
            message=f"Error sending follow-ups: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8081)
