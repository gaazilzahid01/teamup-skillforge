-- Add joined_by_individuals and joined_by_teams columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS joined_by_individuals uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS joined_by_teams uuid[] DEFAULT '{}';