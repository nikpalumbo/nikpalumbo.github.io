#!/usr/bin/env python3
"""
Database setup script for WhatsApp API
This script creates all necessary tables in your Supabase database
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def setup_database():
    """Create all database tables"""
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL not found in .env file")
        return False
    
    try:
        # Connect to database
        print("🔌 Connecting to database...")
        conn = await asyncpg.connect(database_url)
        
        # Read and execute schema
        print("📋 Creating database tables...")
        with open('database_schema.sql', 'r') as f:
            schema = f.read()
        
        await conn.execute(schema)
        
        print("✅ Database tables created successfully!")
        
        # Test the tables
        print("🧪 Testing database connection...")
        result = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"✅ Users table is working (count: {result})")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Setting up WhatsApp API database...")
    success = asyncio.run(setup_database())
    
    if success:
        print("🎉 Database setup complete! Your API should now work properly.")
    else:
        print("💥 Database setup failed. Check your DATABASE_URL and try again.")
