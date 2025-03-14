-- Add new columns to reading_history table for tracking detailed progress
ALTER TABLE reading_history ADD COLUMN IF NOT EXISTS completed_chapters TEXT DEFAULT '[]';
ALTER TABLE reading_history ADD COLUMN IF NOT EXISTS completed_verses TEXT DEFAULT '[]';
ALTER TABLE reading_history ADD COLUMN IF NOT EXISTS total_pages INTEGER DEFAULT 0;
ALTER TABLE reading_history ADD COLUMN IF NOT EXISTS completed_pages TEXT DEFAULT '[]';
