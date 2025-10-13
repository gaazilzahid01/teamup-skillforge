-- Enable RLS on studentdetails table
ALTER TABLE public.studentdetails ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.studentdetails
FOR SELECT
USING (auth.uid() = userid);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.studentdetails
FOR INSERT
WITH CHECK (auth.uid() = userid);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.studentdetails
FOR UPDATE
USING (auth.uid() = userid);

-- Create trigger to automatically update updatedat timestamp
CREATE OR REPLACE FUNCTION public.update_studentdetails_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updatedat = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_studentdetails_updatedat
BEFORE UPDATE ON public.studentdetails
FOR EACH ROW
EXECUTE FUNCTION public.update_studentdetails_timestamp();