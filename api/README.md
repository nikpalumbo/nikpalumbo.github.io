# WhatsApp API

A FastAPI-based serverless API for WhatsApp lead capture and automated follow-ups, deployed on Vercel.

## 🚀 Features

- **Lead Capture**: Collect name and phone number via form submission
- **Database Storage**: PostgreSQL integration with asyncpg
- **Automated Follow-ups**: 3-day and 7-day follow-up system
- **API Security**: Bearer token authentication
- **CORS Support**: Cross-origin requests enabled
- **Input Validation**: Pydantic models with validation
- **Statistics**: API usage and user statistics

## 📋 API Endpoints

### Health Check
- `GET /` - API status
- `GET /api/health` - Health check with timestamp

### Lead Capture
- `POST /api/whatsapp/submit` - Submit lead form
  - Body: `{"name": "string", "phone": "string"}`
  - Headers: `Authorization: Bearer YOUR_API_KEY`

### Follow-ups
- `POST /api/follow-ups/process` - Process automated follow-ups
  - Headers: `Authorization: Bearer YOUR_API_KEY`

### Statistics
- `GET /api/stats` - Get API statistics
  - Headers: `Authorization: Bearer YOUR_API_KEY`

## 🗄️ Database Schema

The API uses PostgreSQL with the following tables:
- `users` - User information and status
- `message_logs` - Message history
- `follow_up_logs` - Follow-up tracking
- `user_responses` - User message responses
- `analytics_events` - Event tracking

## 🔧 Environment Variables

Set these in your Vercel dashboard:

- `DATABASE_URL` - PostgreSQL connection string
- `API_SECRET_KEY` - API authentication key

## 🚀 Deployment

This API is deployed on Vercel using:
- FastAPI framework
- Python 3.9 runtime
- PostgreSQL database
- Serverless functions

## 📝 Usage Example

```bash
# Submit a lead
curl -X POST "https://your-api.vercel.app/api/whatsapp/submit" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "1234567890"}'

# Check health
curl "https://your-api.vercel.app/api/health"

# Get statistics
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://your-api.vercel.app/api/stats"
```

## 🔄 Follow-up System

The API automatically processes follow-ups:
1. **3-day follow-up**: Sent to new users after 3 days
2. **7-day follow-up**: Sent to users who received the 3-day follow-up

Follow-ups are processed via the `/api/follow-ups/process` endpoint, which can be called by a cron job.

## 🛡️ Security

- API key authentication required for sensitive endpoints
- Input validation and sanitization
- CORS properly configured
- Database connection pooling
- Error handling and logging
