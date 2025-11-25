-- Create eco_points table for tracking user eco-friendly activities
CREATE TABLE IF NOT EXISTS eco_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  activity TEXT NOT NULL,
  activity_type VARCHAR(50),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create eco_store table for eco-friendly products
CREATE TABLE IF NOT EXISTS eco_store (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_cost INT NOT NULL,
  category VARCHAR(100),
  image_url TEXT,
  stock INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_eco_purchases table for tracking redemptions
CREATE TABLE IF NOT EXISTS user_eco_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES eco_store(id),
  points_spent INT NOT NULL,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE eco_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_eco_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own eco_points" ON eco_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own purchases" ON user_eco_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_eco_points_user_id ON eco_points(user_id);
CREATE INDEX idx_user_eco_purchases_user_id ON user_eco_purchases(user_id);
CREATE INDEX idx_eco_points_activity_type ON eco_points(activity_type);

-- Insert sample eco-friendly products
INSERT INTO eco_store (name, description, points_cost, category, stock) VALUES
  ('Biodegradable Bags (50 pcs)', 'Compostable trash bags made from plant-based materials', 150, 'Bags', 100),
  ('Bamboo Utensil Set', 'Reusable bamboo cutlery set with carrying case', 200, 'Utensils', 50),
  ('Metal Water Bottle', 'Stainless steel water bottle - 750ml', 180, 'Bottles', 75),
  ('Bamboo Toothbrush (3 pack)', 'Eco-friendly biodegradable toothbrushes', 80, 'Personal Care', 100),
  ('Cloth Napkins (6 pack)', 'Organic cotton cloth napkins for reusable use', 120, 'Kitchen', 60),
  ('Beeswax Food Wraps', 'Organic cotton wraps with beeswax coating', 150, 'Kitchen', 80),
  ('Recycled Notebook', 'Handmade journal from 100% recycled paper', 100, 'Stationery', 90),
  ('Eco Cleaning Kit', 'Natural cleaning products starter pack', 250, 'Cleaning', 40);
