#!/bin/bash

# Test Vercel token
echo "Testing Vercel token..."

# Check if token is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ VERCEL_TOKEN is not set"
    exit 1
fi

# Test the token with Vercel API
response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/v9/user)

if [[ $response == *"id"* ]]; then
    echo "✅ Token is valid!"
    echo "User info: $response"
else
    echo "❌ Token is invalid"
    echo "Response: $response"
    exit 1
fi

