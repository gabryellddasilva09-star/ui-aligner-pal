CREATE TABLE public.community_likes (
  message_id uuid NOT NULL REFERENCES public.community_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.community_likes TO authenticated;
GRANT ALL ON public.community_likes TO service_role;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY likes_read ON public.community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY likes_insert ON public.community_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY likes_delete ON public.community_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.community_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.community_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  author_name text NOT NULL DEFAULT 'Paciente',
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.community_replies TO authenticated;
GRANT ALL ON public.community_replies TO service_role;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY replies_read ON public.community_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY replies_insert ON public.community_replies FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY replies_delete ON public.community_replies FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'moderator'));

CREATE TABLE public.community_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.community_profiles TO authenticated;
GRANT ALL ON public.community_profiles TO service_role;
ALTER TABLE public.community_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY cp_read ON public.community_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY cp_insert ON public.community_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY cp_update ON public.community_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS cm_read ON public.community_messages;
CREATE POLICY cm_read ON public.community_messages FOR SELECT TO authenticated USING (true);