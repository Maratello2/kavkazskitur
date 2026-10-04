-- Kavkazskitur database schema (PostgreSQL)
-- Run: psql -U kavkazskitur_user -d kavkazskitur_db -f db/schema.sql

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  program TEXT,               -- day-by-day itinerary (markdown / plain text)
  included TEXT,               -- what's included, one item per line
  excluded TEXT,               -- what's not included, one item per line
  equipment TEXT,               -- required / recommended gear, one item per line
  price NUMERIC(10, 2) NOT NULL,
  difficulty VARCHAR(50),        -- e.g. 'Легкий', 'Средний', 'Сложный'
  start_altitude INTEGER,        -- meters
  peak_altitude INTEGER,         -- meters
  duration_days INTEGER,
  duration_nights INTEGER,
  image_url TEXT,
  photo_urls JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',      -- e.g. ["Хит сезона", "Малая группа"]
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  start_date DATE,
  end_date DATE,
  capacity INTEGER,
  seats_taken INTEGER DEFAULT 0,
  telegram_link TEXT,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category_id);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  role VARCHAR(150),
  bio TEXT,
  photo_url TEXT,
  experience_years INTEGER,
  certifications TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
  author VARCHAR(150) NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  status VARCHAR(20) DEFAULT 'approved', -- approved | pending | rejected
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leads captured from the "Order a call" quick modal and contact forms
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  tour_id INTEGER REFERENCES tours(id) ON DELETE SET NULL,
  tour_name VARCHAR(255),
  message TEXT,
  source VARCHAR(50) DEFAULT 'website', -- website | quick_order | contact_form
  status VARCHAR(30) DEFAULT 'new',     -- new | contacted | qualified | rejected
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings: a lead that picked a specific tour + departure date
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  tour_id INTEGER REFERENCES tours(id) ON DELETE SET NULL,
  tour_name VARCHAR(255),
  departure_date DATE,
  people_count INTEGER DEFAULT 1,
  comment TEXT,
  status VARCHAR(30) DEFAULT 'new', -- new | confirmed | paid | cancelled | completed
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Admin accounts with Telegram-based 2FA
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  telegram_chat_id VARCHAR(50), -- where 2FA codes are sent
  role VARCHAR(30) DEFAULT 'admin', -- admin | superadmin
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Short-lived 2FA codes sent to admin_users.telegram_chat_id
CREATE TABLE IF NOT EXISTS admin_2fa_codes (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
