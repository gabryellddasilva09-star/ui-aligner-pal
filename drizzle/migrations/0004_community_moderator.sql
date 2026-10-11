INSERT INTO public.user_roles (user_id, role) VALUES ('698f6513-08dc-4ba5-8516-fc8cdd124432','moderator') ON CONFLICT DO NOTHING;
DROP POLICY IF EXISTS cm_update_own ON public.community_messages;
CREATE POLICY cm_update_mod ON public.community_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'moderator')) WITH CHECK (public.has_role(auth.uid(),'moderator'));
CREATE OR REPLACE FUNCTION public.is_moderator() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ select public.has_role(auth.uid(),'moderator') $$;
GRANT EXECUTE ON FUNCTION public.is_moderator() TO authenticated;