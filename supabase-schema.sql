-- YouTube Video Staging Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workflow types enum
CREATE TYPE workflow_type AS ENUM ('semi-auto', 'full-auto', 'empire');

-- Video status enum
CREATE TYPE video_status AS ENUM (
  'idea',
  'script',
  'voiceover',
  'video',
  'thumbnail',
  'ready',
  'uploaded',
  'rejected'
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workflow_type workflow_type NOT NULL DEFAULT 'semi-auto',
  status video_status NOT NULL DEFAULT 'idea',
  
  -- Content fields
  title TEXT,
  script TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- File URLs (Supabase Storage)
  voiceover_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  
  -- YouTube integration
  youtube_video_id TEXT,
  channel_id UUID REFERENCES channels(id),
  
  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels table
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  youtube_channel_id TEXT,
  workflow_type workflow_type NOT NULL DEFAULT 'semi-auto',
  auto_upload BOOLEAN DEFAULT FALSE,
  upload_schedule JSONB DEFAULT '{"time": "18:00", "timezone": "Europe/Kiev"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX videos_user_id_idx ON videos(user_id);
CREATE INDEX videos_status_idx ON videos(status);
CREATE INDEX videos_workflow_type_idx ON videos(workflow_type);
CREATE INDEX videos_scheduled_at_idx ON videos(scheduled_at);
CREATE INDEX channels_user_id_idx ON channels(user_id);

-- Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Users can view own videos"
  ON videos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
  ON videos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  USING (auth.uid() = user_id);

-- Channels policies
CREATE POLICY "Users can view own channels"
  ON channels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own channels"
  ON channels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own channels"
  ON channels FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own channels"
  ON channels FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at
  BEFORE UPDATE ON channels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets (run these in Supabase Dashboard > Storage)
-- 1. Create bucket: 'videos'
-- 2. Create bucket: 'voiceovers'
-- 3. Create bucket: 'thumbnails'
-- 4. Set policies for each bucket to allow authenticated users to upload/read their own files
