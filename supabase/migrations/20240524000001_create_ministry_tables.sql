-- Create ministry_goals table
CREATE TABLE IF NOT EXISTS ministry_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  target NUMERIC NOT NULL,
  current NUMERIC DEFAULT 0,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministry_time_entries table
CREATE TABLE IF NOT EXISTS ministry_time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours NUMERIC NOT NULL,
  minutes INTEGER NOT NULL,
  ministry_type TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministry_types table
CREATE TABLE IF NOT EXISTS ministry_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bible_studies table
CREATE TABLE IF NOT EXISTS bible_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  last_study DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ministry_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for ministry_goals
CREATE POLICY "Users can view their own ministry goals"
ON ministry_goals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ministry goals"
ON ministry_goals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ministry goals"
ON ministry_goals
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ministry goals"
ON ministry_goals
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for ministry_time_entries
CREATE POLICY "Users can view their own ministry time entries"
ON ministry_time_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ministry time entries"
ON ministry_time_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ministry time entries"
ON ministry_time_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ministry time entries"
ON ministry_time_entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for ministry_types
CREATE POLICY "Users can view their own ministry types"
ON ministry_types
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ministry types"
ON ministry_types
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ministry types"
ON ministry_types
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ministry types"
ON ministry_types
FOR DELETE
USING (auth.uid() = user_id);

-- Create policies for bible_studies
CREATE POLICY "Users can view their own bible studies"
ON bible_studies
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bible studies"
ON bible_studies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bible studies"
ON bible_studies
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bible studies"
ON bible_studies
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table ministry_goals;
alter publication supabase_realtime add table ministry_time_entries;
alter publication supabase_realtime add table ministry_types;
alter publication supabase_realtime add table bible_studies;