import os
import requests
from datetime import datetime
from flask import Flask, request, jsonify
import asyncpg
import asyncio

app = Flask(__name__)

async def get_database_connection():
    """Get database connection"""
    return await asyncpg.connect(os.environ['DATABASE_URL'])

def send_whatsapp_message(phone, message):
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

async def get_user_by_phone(phone):
    """Get user by phone number"""
    conn = await get_database_connection()
    
    try:
        query = "SELECT * FROM users WHERE phone = $1"
        user = await conn.fetchrow(query, phone)
        return user
    except Exception as e:
        print(f"Database error: {e}")
        return None
    finally:
        await conn.close()

async def update_user_status(phone, status):
    """Update user status"""
    conn = await get_database_connection()
    
    try:
        query = "UPDATE users SET status = $1, updated_at = NOW() WHERE phone = $2"
        await conn.execute(query, status, phone)
    except Exception as e:
        print(f"Update error: {e}")
    finally:
        await conn.close()

async def log_user_response(phone, message, response_type):
    """Log user response"""
    conn = await get_database_connection()
    
    try:
        query = """
        INSERT INTO user_responses (phone, message, response_type, received_at)
        VALUES ($1, $2, $3, $4)
        """
        await conn.execute(query, phone, message, response_type, datetime.now())
    except Exception as e:
        print(f"Log error: {e}")
    finally:
        await conn.close()

def handle_user_response(phone, message_text):
    """Handle user responses to follow-ups"""
    message_text = message_text.lower().strip()
    
    # Log the response
    asyncio.run(log_user_response(phone, message_text, 'user_message'))
    
    # Handle different response types
    if 'unsubscribe' in message_text or 'stop' in message_text:
        asyncio.run(update_user_status(phone, 'unsubscribed'))
        return "You've been unsubscribed from follow-up messages. You can resubscribe anytime by sending 'START'."
    
    elif 'help' in message_text:
        return """Here's how I can help you:

🚀 **Implementation Support:**
• AI Agent Development
• Growth System Setup
• Client Acquisition Strategy
• MVP Development

💡 **Resources:**
• Detailed guides for each roadmap section
• Case studies and examples
• Best practices and tips

🎯 **Next Steps:**
Reply with what you'd like to focus on, and I'll send you specific resources!

What would you like help with?"""
    
    elif 'interested' in message_text or 'yes' in message_text:
        asyncio.run(update_user_status(phone, 'interested'))
        return """Great! 🎉 Let's take your growth to the next level.

I offer personalized consultation sessions to help you implement the roadmap strategies.

📅 **Book a Strategy Call:**
https://calendar.google.com/calendar/appointments/schedules/AcZssZ0-NcwHUpy2VQTbjOwTbXwdd0qIVBbaPQvmwg8sujsRnwtn8LEFTFOVc_qFpKQKZASWyQwaIJO8?gv=true

💰 **Investment:** $0 (Free Strategy Session)

During our call, we'll:
• Review your current situation
• Identify the biggest opportunities
• Create your personalized action plan
• Answer all your questions

Would you like to book a call?"""
    
    elif 'consultation' in message_text or 'call' in message_text:
        return """Perfect! Let's get you scheduled for a strategy call.

📅 **Book Your Free Strategy Session:**
https://calendar.google.com/calendar/appointments/schedules/AcZssZ0-NcwHUpy2VQTbjOwTbXwdd0qIVBbaPQvmwg8sujsRnwtn8LEFTFOVc_qFpKQKZASWyQwaIJO8?gv=true

⏰ **Duration:** 30 minutes
💰 **Investment:** Free

**What to expect:**
• Deep dive into your business
• Customized growth strategy
• Implementation roadmap
• Q&A session

Book your slot and I'll send you a calendar confirmation!"""
    
    else:
        return """Thanks for your message! 

I'm here to help you implement the roadmap strategies and scale your business.

💡 **Quick options:**
• Reply "HELP" for implementation support
• Reply "INTERESTED" to book a strategy call
• Reply "STOP" to unsubscribe

What would you like to focus on?"""

@app.route('/api/webhook', methods=['POST'])
def webhook_handler():
    """Handle WhatsApp webhook"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        # Handle WhatsApp Business API webhook
        if data.get('object') == 'whatsapp_business_account':
            for entry in data.get('entry', []):
                for change in entry.get('changes', []):
                    if change.get('value', {}).get('messages'):
                        for message in change['value']['messages']:
                            if message.get('type') == 'text':
                                phone = message.get('from')
                                text = message.get('text', {}).get('body', '')
                                
                                # Handle the user response
                                response_message = handle_user_response(phone, text)
                                
                                # Send response back
                                if response_message:
                                    send_whatsapp_message(phone, response_message)
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Webhook error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/webhook', methods=['GET'])
def webhook_verification():
    """Handle WhatsApp webhook verification"""
    mode = request.args.get('hub.mode')
    token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    
    # Verify token (should match your webhook verification token)
    if mode == 'subscribe' and token == os.environ.get('WEBHOOK_VERIFY_TOKEN'):
        return challenge
    else:
        return jsonify({'error': 'Verification failed'}), 403

@app.route('/api/unsubscribe', methods=['POST'])
def unsubscribe_user():
    """Handle unsubscribe requests"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        
        if phone:
            asyncio.run(update_user_status(phone, 'unsubscribed'))
            confirmation_message = "You've been unsubscribed from follow-up messages. You can resubscribe anytime by sending 'START'."
            send_whatsapp_message(phone, confirmation_message)
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Unsubscribe error: {e}")
        return jsonify({'error': str(e)}), 500

# Vercel handler
def handler(request):
    return app(request)
