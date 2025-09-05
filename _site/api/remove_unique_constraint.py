#!/usr/bin/env python3
"""
Remove unique constraint on phone numbers to allow re-downloads
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def remove_unique_constraint():
    """Remove unique constraint on phone numbers"""
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL not found in .env file")
        return False
    
    try:
        # Connect to database
        print("🔌 Connecting to database...")
        conn = await asyncpg.connect(database_url)
        
        # Remove unique constraint
        print("🔓 Removing unique constraint on phone numbers...")
        await conn.execute("""
            ALTER TABLE users DROP CONSTRAINT IF EXISTS users_phone_key;
        """)
        
        print("✅ Unique constraint removed successfully!")
        
        # Test the change
        print("🧪 Testing the change...")
        result = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"✅ Users table is working (count: {result})")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error removing constraint: {e}")
        return False

if __name__ == "__main__":
    print("🔓 Removing unique constraint to allow re-downloads...")
    success = asyncio.run(remove_unique_constraint())
    
    if success:
        print("🎉 Unique constraint removed! Users can now re-download the roadmap.")
    else:
        print("💥 Failed to remove constraint. Check your DATABASE_URL and try again.")
