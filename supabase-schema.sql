-- Loops table (habits ke liye)
CREATE TABLE loops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL, -- e.g., "Read 10 pages"
  frequency TEXT NOT NULL, -- e.g., "Daily", "Weekdays"
  start_date DATE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE, -- Public ya Private
  emoji TEXT, -- Optional emoji
  cover_image TEXT, -- Optional image
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaks table (progress track karne ke liye)
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loop_id UUID REFERENCES loops(id),
  date DATE NOT NULL,
  status TEXT NOT NULL, -- "Active", "Broken", "Completed"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reactions table (cheer ya emoji ke liye)
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loop_id UUID REFERENCES loops(id),
  user_id UUID REFERENCES auth.users(id),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security ke liye RLS (Row Level Security) on karo
ALTER TABLE loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Loops ke liye policies
CREATE POLICY "Public loops are viewable" ON loops
FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Users can manage own loops" ON loops
FOR ALL USING (auth.uid() = user_id);

-- Streaks ke liye policies
CREATE POLICY "Users can manage own streaks" ON streaks
FOR ALL USING (auth.uid() = (SELECT user_id FROM loops WHERE loops.id = loop_id));

-- Reactions ke liye policies
CREATE POLICY "Authenticated users can react" ON reactions
FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public reactions are viewable" ON reactions
FOR SELECT USING (TRUE);