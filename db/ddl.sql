-- Database table structure for short links

CREATE TABLE short_links (
  id SERIAL PRIMARY KEY,
  short_code TEXT UNIQUE,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  clicks INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);