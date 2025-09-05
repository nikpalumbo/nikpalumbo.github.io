#!/bin/bash

# WhatsApp API Deployment Script
echo "🚀 Deploying WhatsApp API to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the api directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Please run this script from the api directory"
    exit 1
fi

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Configure WhatsApp Business API"
echo "3. Set up database and run schema"
echo "4. Update frontend API URL"
echo ""
echo "📖 See README.md for detailed setup instructions"
