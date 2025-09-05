-- Database schema for WhatsApp API

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Message logs table
CREATE TABLE IF NOT EXISTS message_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message_type VARCHAR(50) NOT NULL,
    content TEXT,
    whatsapp_message_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-up logs table
CREATE TABLE IF NOT EXISTS follow_up_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    follow_up_type VARCHAR(50) NOT NULL,
    message_content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'sent'
);

-- User responses table
CREATE TABLE IF NOT EXISTS user_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message_content TEXT,
    response_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_message_logs_user_id ON message_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_logs_user_id ON follow_up_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_logs_sent_at ON follow_up_logs(sent_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
