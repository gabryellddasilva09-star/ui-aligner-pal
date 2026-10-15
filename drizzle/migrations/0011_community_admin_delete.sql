DROP POLICY IF EXISTS cm_delete_own ON public.community_messages;
CREATE POLICY cm_delete_own ON public.community_messages FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS replies_delete ON public.community_replies;
CREATE POLICY replies_delete ON public.community_replies FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS likes_delete_admin ON public.community_likes;
CREATE POLICY likes_delete_admin ON public.community_likes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT conname, conrelid::regclass AS t FROM pg_constraint WHERE confrelid='public.community_messages'::regclass AND contype='f' AND confdeltype <> 'c' LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', r.t, r.conname);
    EXECUTE format('ALTER TABLE %s ADD CONSTRAINT %I FOREIGN KEY (message_id) REFERENCES public.community_messages(id) ON DELETE CASCADE', r.t, r.conname);
  END LOOP; END $$;