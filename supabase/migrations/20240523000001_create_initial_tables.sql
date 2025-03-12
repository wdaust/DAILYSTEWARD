-- Create tables for user data with user_id foreign key to auth.users

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  streak INTEGER DEFAULT 0,
  completedToday BOOLEAN DEFAULT FALSE,
  lastCompleted TEXT,
  progress FLOAT DEFAULT 0,
  showOnDashboard BOOLEAN DEFAULT TRUE,
  reminderTime TEXT,
  createdAt TEXT NOT NULL,
  completionHistory JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline TEXT NOT NULL,
  category TEXT NOT NULL,
  progress FLOAT DEFAULT 0,
  subGoals JSONB DEFAULT '[]'::JSONB,
  createdAt TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  preview TEXT,
  scriptures TEXT[] DEFAULT '{}',
  folder JSONB,
  tags JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME