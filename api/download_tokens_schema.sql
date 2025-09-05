-- Download tokens table for secure file access
CREATE TABLE IF NOT EXISTS download_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    file_type VARCHAR(50) DEFAULT 'roadmap',
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
    downloaded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_download_tokens_token ON download_tokens(token);
CREATE INDEX IF NOT EXISTS idx_download_tokens_user_id ON download_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_download_tokens_expires_at ON download_tokens(expires_at);
