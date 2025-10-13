-- Allow authenticated users to view all colleges
CREATE POLICY "Anyone can view colleges"
ON public.colleges
FOR SELECT
USING (true);