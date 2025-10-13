-- Enable RLS on colleges table
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Enable RLS on friends table
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Add basic policies for events (everyone can view)
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Add basic policies for teams (everyone can view)
CREATE POLICY "Anyone can view teams"
ON public.teams
FOR SELECT
USING (true);

-- Add basic policies for friends (users can view their own friendships)
CREATE POLICY "Users can view their own friendships"
ON public.friends
FOR SELECT
USING (auth.uid() = userid1 OR auth.uid() = userid2);