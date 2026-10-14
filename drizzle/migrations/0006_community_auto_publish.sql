ALTER TABLE public.community_messages ALTER COLUMN status SET DEFAULT 'approved';
DROP POLICY IF EXISTS cm_insert ON public.community_messages;
CREATE POLICY cm_insert ON public.community_messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'approved');
UPDATE public.community_messages SET status = 'approved' WHERE status = 'pending';
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$ select public.has_role(auth.uid(),'admin') $$;