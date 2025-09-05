import os
import requests
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, Header, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import asyncpg
import asyncio
from typing import Optional

app = FastAPI(
    title="WhatsApp API",
    description="API for WhatsApp lead capture and messaging",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models for request/response validation
class WhatsAppRequest(BaseModel):
    name: str
    phone: str
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v.strip()
    
    @validator('phone')
    def validate_phone(cls, v):
        # Basic phone validation
        if not v or len(v.replace('+', '').replace(' ', '').replace('-', '')) < 10:
            raise ValueError('Phone number must be at least 10 digits')
        return v.strip()

class WhatsAppResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[int] = None

async def get_database_connection():
    """Get database connection"""
    return await asyncpg.connect(os.environ['DATABASE_URL'])

def validate_phone_number(phone: str) -> bool:
    """Validate phone number format"""
    import re
    # Remove all non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone)
    # Check if it has at least 10 digits
    digits = re.sub(r'[^\d]', '', cleaned)
    return len(digits) >= 10

def sanitize_input(text: str) -> str:
    """Sanitize input to prevent injection"""
    import html
    return html.escape(text.strip())

def send_whatsapp_message(phone: str, message: str):
    """Send WhatsApp message via Business API"""
    url = f"https://graph.facebook.com/v17.0/{os.environ['WHATSAPP_PHONE_ID']}/messages"
    
    headers = {
        'Authorization': f"Bearer {os.environ['WHATSAPP_TOKEN']}",
        'Content-Type': 'application/json'
    }
    
    data = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": message}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"WhatsApp API error: {e}")
        return {"error": str(e)}

async def store_user_in_database(name: str, phone: str):
    """Store user in database"""
    conn = await get_database_connection()
    
    try:
        query = """
        INSERT INTO users (name, phone, created_at, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        """
        
        user_id = await conn.fetchval(query, name, phone, datetime.now(), 'active')
        return user_id
        
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        await conn.close()

async def log_message(user_id: int, message: str, result: dict):
    """Log message to database"""
    conn = await get_database_connection()
    
    try:
        query = """
        INSERT INTO message_logs (user_id, message_sent, sent_at, result)
        VALUES ($1, $2, $3, $4)
        """
        
        await conn.execute(query, user_id, message, datetime.now(), str(result))
        
    except Exception as e:
        print(f"Log error: {e}")
    finally:
        await conn.close()

async def track_analytics(event_type: str, user_id: int = None, phone: str = None):
    """Track analytics events"""
    conn = await get_database_connection()
    
    try:
        query = """
        INSERT INTO analytics_events (event_type, user_id, phone, created_at)
        VALUES ($1, $2, $3, $4)
        """
        
        await conn.execute(query, event_type, user_id, phone, datetime.now())
        
    except Exception as e:
        print(f"Analytics error: {e}")
    finally:
        await conn.close()

async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key"""
    api_key = credentials.credentials
    expected_key = os.environ.get('API_SECRET_KEY')
    
    if not expected_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    if api_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return api_key

@app.post("/api/whatsapp/submit", response_model=WhatsAppResponse)
async def submit_whatsapp_form(
    request: WhatsAppRequest,
    api_key: str = Depends(verify_api_key)
):
    """Submit WhatsApp form and send initial message"""
    
    try:
        # Validate phone number
        if not validate_phone_number(request.phone):
            raise HTTPException(status_code=400, detail="Invalid phone number format")
        
        # Sanitize inputs
        name = sanitize_input(request.name)
        phone = sanitize_input(request.phone)
        
        # Store user in database
        user_id = await store_user_in_database(name, phone)
        
        # Send WhatsApp message
        message = f"""Hi {name}! 👋

Thank you for requesting the roadmap!

🚀 **Your Growth Roadmap is Ready:**

📋 **Step 1: AI Agent Development**
• Build your first AI agent
• Automate customer support
• Scale operations 10x

📈 **Step 2: Growth System Setup**
• Implement lead generation
• Create conversion funnels
• Optimize for growth

👥 **Step 3: Client Acquisition**
• Develop your unique value proposition
• Build a referral system
• Scale to 100+ clients

💡 **Next Steps:**
I'll send you detailed guides for each section over the next few days.

Would you like me to help you implement any of these strategies?

Best regards,
Your Growth Partner"""

        result = send_whatsapp_message(phone, message)
        
        # Log the message
        await log_message(user_id, message, result)
        
        # Track analytics
        await track_analytics('roadmap_requested', user_id, phone)
        
        # Update user status
        conn = await get_database_connection()
        await conn.execute(
            "UPDATE users SET roadmap_sent = true, roadmap_sent_at = NOW() WHERE id = $1",
            user_id
        )
        await conn.close()
        
        return WhatsAppResponse(
            success=True,
            message="Roadmap sent successfully! Check your WhatsApp.",
            user_id=user_id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in submit_whatsapp_form: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/test")
async def test_endpoint():
    """Simple test endpoint without authentication"""
    return {
        "message": "API is working!",
        "timestamp": datetime.now().isoformat(),
        "framework": "FastAPI"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/docs")
async def get_docs():
    """Get API documentation"""
    return {
        "message": "API Documentation",
        "endpoints": {
            "POST /api/whatsapp/submit": "Submit WhatsApp form",
            "GET /api/health": "Health check",
            "GET /api/docs": "This documentation"
        },
        "authentication": "Bearer token required in Authorization header"
    }

# Vercel handler for serverless deployment
def handler(request):
    """Vercel serverless function handler"""
    from mangum import Adapter
    
    # Create Mangum adapter for FastAPI
    adapter = Adapter(app)
    
    # Handle the request
    return adapter(request)
