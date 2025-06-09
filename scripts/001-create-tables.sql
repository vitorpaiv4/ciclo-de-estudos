-- Create tables for the study cycles application

-- Users table (handled by Supabase Auth)

-- Study lists table
CREATE TABLE IF NOT EXISTS study_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cycle_duration INTEGER NOT NULL, -- in days
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study items table
CREATE TABLE IF NOT EXISTS study_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES study_lists(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  estimated_time INTEGER NOT NULL, -- in minutes
  is_completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study cycles table (to track completed cycles)
CREATE TABLE IF NOT EXISTS study_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES study_lists(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_time INTEGER NOT NULL, -- in minutes
  cycle_number INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE study_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_cycles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study lists" ON study_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study lists" ON study_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study lists" ON study_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study lists" ON study_lists
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view items from their own study lists" ON study_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_items.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items to their own study lists" ON study_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_items.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items from their own study lists" ON study_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_items.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their own study lists" ON study_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_items.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own study cycles" ON study_cycles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_cycles.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own study cycles" ON study_cycles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM study_lists 
      WHERE study_lists.id = study_cycles.list_id 
      AND study_lists.user_id = auth.uid()
    )
  );
