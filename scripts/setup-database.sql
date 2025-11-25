-- Create complete database schema for WasteWise platform

-- Enable PostGIS for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extended profile)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  household_size INTEGER DEFAULT 1,
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waste logs table (enhanced)
CREATE TABLE IF NOT EXISTS waste_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  kitchen_kg DECIMAL(10, 2) DEFAULT 0,
  plastic_kg DECIMAL(10, 2) DEFAULT 0,
  paper_kg DECIMAL(10, 2) DEFAULT 0,
  garden_kg DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  total_kg DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calculations table
CREATE TABLE IF NOT EXISTS calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_id UUID REFERENCES waste_logs(id) ON DELETE SET NULL,
  biogas_l DECIMAL(10, 2) NOT NULL,
  electricity_kwh DECIMAL(10, 2) NOT NULL,
  cost_savings_inr DECIMAL(12, 2) NOT NULL,
  co2_reduction_kg DECIMAL(10, 2) NOT NULL,
  fertilizer_kg DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Community locations table
CREATE TABLE IF NOT EXISTS community_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('digester', 'compost', 'pickup')),
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  address TEXT NOT NULL,
  contact TEXT,
  capacity INTEGER,
  available_slots INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for location-based queries
CREATE INDEX idx_community_locations_geom ON community_locations USING GIST(location);

-- Habit nudges table
CREATE TABLE IF NOT EXISTS habit_nudges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nudge_text TEXT NOT NULL,
  nudge_type TEXT NOT NULL CHECK (nudge_type IN ('success', 'warning', 'info', 'tip')),
  shown_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  clicked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event food donations table
CREATE TABLE IF NOT EXISTS event_food_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  food_quantity_kg DECIMAL(10, 2) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  ngo_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NGOs table
CREATE TABLE IF NOT EXISTS ngos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  coverage_area GEOGRAPHY(POLYGON, 4326),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utensil rentals table
CREATE TABLE IF NOT EXISTS utensil_rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rental_type TEXT NOT NULL CHECK (rental_type IN ('steel_plates', 'glasses', 'utensils')),
  quantity INTEGER NOT NULL,
  event_date DATE NOT NULL,
  delivery_address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'returned', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE utensil_rentals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read own waste logs" ON waste_logs
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own waste logs" ON waste_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own calculations" ON calculations
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own calculations" ON calculations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Indexes for performance
CREATE INDEX idx_waste_logs_user_id ON waste_logs(user_id);
CREATE INDEX idx_waste_logs_date ON waste_logs(date);
CREATE INDEX idx_calculations_user_id ON calculations(user_id);
CREATE INDEX idx_habit_nudges_user_id ON habit_nudges(user_id);
CREATE INDEX idx_event_donations_user_id ON event_food_donations(user_id);
CREATE INDEX idx_utensil_rentals_user_id ON utensil_rentals(user_id);
