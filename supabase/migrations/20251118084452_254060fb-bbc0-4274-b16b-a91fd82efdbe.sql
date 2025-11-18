-- Create colleges table
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create studentdetails table
CREATE TABLE IF NOT EXISTS public.studentdetails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  college_id UUID REFERENCES public.colleges(id),
  year INTEGER,
  branch TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  eventid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_by UUID NOT NULL,
  joined_by_individuals UUID[] DEFAULT '{}',
  joined_by_teams UUID[] DEFAULT '{}',
  max_participants INTEGER,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  members UUID[] DEFAULT '{}',
  description TEXT,
  location TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  skills TEXT[] DEFAULT '{}',
  neededroles TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  type TEXT DEFAULT 'custom',
  difficulty TEXT DEFAULT 'medium',
  event_id UUID,
  createdat TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create friends table
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Enable Row Level Security
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studentdetails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Colleges RLS Policies (public read, authenticated write)
CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create colleges"
  ON public.colleges FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Student Details RLS Policies
CREATE POLICY "Users can view their own details"
  ON public.studentdetails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own details"
  ON public.studentdetails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own details"
  ON public.studentdetails FOR UPDATE
  USING (auth.uid() = user_id);

-- Events RLS Policies (comprehensive)
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
  ON public.events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can update events they join"
  ON public.events FOR UPDATE
  USING (auth.uid() = ANY(joined_by_individuals));

CREATE POLICY "Event creators can delete their events"
  ON public.events FOR DELETE
  USING (auth.uid() = created_by);

-- Teams RLS Policies (comprehensive)
CREATE POLICY "Anyone can view teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update their teams"
  ON public.teams FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Team members can update team they belong to"
  ON public.teams FOR UPDATE
  USING (auth.uid() = ANY(members));

CREATE POLICY "Team creators can delete their teams"
  ON public.teams FOR DELETE
  USING (auth.uid() = created_by);

-- Friends RLS Policies
CREATE POLICY "Users can view their own friendships"
  ON public.friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
  ON public.friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friend requests"
  ON public.friends FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
  ON public.friends FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);