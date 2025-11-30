-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  board_id TEXT NOT NULL,
  board_name TEXT NOT NULL,
  board_fqbn TEXT NOT NULL,
  board_platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own projects
CREATE POLICY "Users can only access their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_updated_at_idx ON projects(updated_at DESC);

-- Create community_projects table for shared projects
CREATE TABLE IF NOT EXISTS community_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  board_id TEXT NOT NULL,
  board_name TEXT NOT NULL,
  board_platform TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table for community projects
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES community_projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Enable RLS for community tables
ALTER TABLE community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;

-- Policies for community_projects (public read, owner write)
CREATE POLICY "Anyone can view public community projects" ON community_projects
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own community projects" ON community_projects
  FOR ALL USING (auth.uid() = user_id);

-- Policies for community_likes
CREATE POLICY "Anyone can view likes" ON community_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON community_likes
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for community tables
CREATE INDEX IF NOT EXISTS community_projects_category_idx ON community_projects(category);
CREATE INDEX IF NOT EXISTS community_projects_created_at_idx ON community_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS community_projects_likes_idx ON community_projects(likes_count DESC);
CREATE INDEX IF NOT EXISTS community_likes_project_idx ON community_likes(project_id);