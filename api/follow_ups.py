import os
import requests
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import asyncpg
import asyncio
from typing import List, Optional

app = FastAPI(
    title="Follow-ups API",
    description="API for automated WhatsApp follow-up messages",
    version="1.0.0"
)

# Security
security = HTTPBearer()

# Pydantic models
class FollowUpResponse(BaseModel):
    success: bool
    processed: int
    results: List[dict]
    timestamp: str

class FollowUpStatus(BaseModel):
    success: bool
    statistics: dict
    recent_logs: List[dict]

# Configuration
FOLLOW_UP_SCHEDULE = {
    1: 3,    # 3 days after roadmap
    2: 7,    # 7 days after roadmap
    3: 14,   # 14 days after roadmap
}

FOLLOW_UP_MESSAGES = {
    1: "Hi {name}! 👋 Did you get a chance to review the roadmap? I'd love to hear your thoughts!",
    2: "Hey {name}! 🚀 How's the roadmap implementation going? Any questions?",
    3: "Hi {name}! 💡 Ready to take your growth to the next level? Let's discuss your strategy!"
}

async def get_database_connection():
    """Get database connection"""
    return await asyncpg.connect(os.environ['DATABASE_URL'])

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

async def get_users_for_follow_up():
    """Get users who need follow-up messages"""
    conn = await get_database_connection()
    
    try:
        # Get users who received roadmap but haven't been contacted recently
        query = """
        SELECT id, name, phone, created_at, roadmap_sent,
               follow_up_1_sent, follow_up_2_sent, follow_up_3_sent
        FROM users 
        WHERE roadmap_sent = true 
        AND status = 'active'
        AND created_at <= NOW() - INTERVAL '3 days'
        ORDER BY created_at ASC
        """
        
        users = await conn.fetch(query)
        return users
        
    except Exception as e:
        print(f"Database error: {e}")
        return []
    finally:
        await conn.close()

def should_send_follow_up(user, follow_up_number):
    """Check if follow-up should be sent"""
    days_since_roadmap = (datetime.now() - user['created_at']).days
    
    if follow_up_number == 1 and not user['follow_up_1_sent'] and days_since_roadmap >= 3:
        return True
    elif follow_up_number == 2 and not user['follow_up_2_sent'] and days_since_roadmap >= 7:
        return True
    elif follow_up_number == 3 and not user['follow_up_3_sent'] and days_since_roadmap >= 14:
        return True
    
    return False

async def send_follow_up(user, follow_up_number):
    """Send follow-up message"""
    message = FOLLOW_UP_MESSAGES[follow_up_number].format(name=user['name'])
    
    try:
        # Send WhatsApp message
        result = send_whatsapp_message(user['phone'], message)
        
        # Log the follow-up
        await log_follow_up(user['id'], follow_up_number, message, result)
        
        # Update user record
        await update_user_follow_up_status(user['id'], follow_up_number)
        
        return {"success": True, "user_id": user['id'], "follow_up": follow_up_number}
        
    except Exception as e:
        print(f"Error sending follow-up: {e}")
        return {"success": False, "error": str(e)}

async def log_follow_up(user_id: int, follow_up_number: int, message: str, result: dict):
    """Log follow-up message"""
    conn = await get_database_connection()
    
    try:
        query = """
        INSERT INTO follow_up_logs (user_id, follow_up_number, message_sent, sent_at, result)
        VALUES ($1, $2, $3, $4, $5)
        """
        
        await conn.execute(query, user_id, follow_up_number, message, datetime.now(), str(result))
        
    except Exception as e:
        print(f"Log error: {e}")
    finally:
        await conn.close()

async def update_user_follow_up_status(user_id: int, follow_up_number: int):
    """Update user's follow-up status"""
    conn = await get_database_connection()
    
    try:
        if follow_up_number == 1:
            query = "UPDATE users SET follow_up_1_sent = true, last_contact_date = NOW() WHERE id = $1"
        elif follow_up_number == 2:
            query = "UPDATE users SET follow_up_2_sent = true, last_contact_date = NOW() WHERE id = $1"
        elif follow_up_number == 3:
            query = "UPDATE users SET follow_up_3_sent = true, last_contact_date = NOW() WHERE id = $1"
        
        await conn.execute(query, user_id)
        
    except Exception as e:
        print(f"Update error: {e}")
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

@app.post("/api/follow-ups/process", response_model=FollowUpResponse)
async def process_follow_ups(api_key: str = Depends(verify_api_key)):
    """Process all pending follow-ups"""
    
    try:
        users = await get_users_for_follow_up()
        results = []
        
        for user in users:
            # Check each follow-up number
            for follow_up_number in [1, 2, 3]:
                if should_send_follow_up(user, follow_up_number):
                    result = await send_follow_up(user, follow_up_number)
                    results.append(result)
        
        return FollowUpResponse(
            success=True, 
            processed=len(results), 
            results=results,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        print(f"Error in process_follow_ups: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/follow-ups/status", response_model=FollowUpStatus)
async def get_follow_up_status(api_key: str = Depends(verify_api_key)):
    """Get follow-up status and statistics"""
    
    try:
        conn = await get_database_connection()
        
        # Get statistics
        query = """
        SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN roadmap_sent = true THEN 1 END) as roadmap_sent,
            COUNT(CASE WHEN follow_up_1_sent = true THEN 1 END) as follow_up_1_sent,
            COUNT(CASE WHEN follow_up_2_sent = true THEN 1 END) as follow_up_2_sent,
            COUNT(CASE WHEN follow_up_3_sent = true THEN 1 END) as follow_up_3_sent,
            COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users
        FROM users
        """
        
        stats = await conn.fetchrow(query)
        
        # Get recent follow-up logs
        query = """
        SELECT fl.*, u.name, u.phone
        FROM follow_up_logs fl
        JOIN users u ON fl.user_id = u.id
        ORDER BY fl.sent_at DESC
        LIMIT 10
        """
        
        recent_logs = await conn.fetch(query)
        
        await conn.close()
        
        return FollowUpStatus(
            success=True,
            statistics=dict(stats) if stats else {},
            recent_logs=[dict(log) for log in recent_logs]
        )
        
    except Exception as e:
        print(f"Error in get_follow_up_status: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Vercel handler for serverless deployment
def handler(request):
    import uvicorn
    from fastapi import Request
    from fastapi.responses import Response
    
    # Convert Vercel request to FastAPI request
    async def app_handler():
        return await app(request)
    
    return asyncio.run(app_handler())
