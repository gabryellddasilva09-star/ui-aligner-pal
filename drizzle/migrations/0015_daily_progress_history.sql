CREATE TABLE public.daily_progress (
  user_id uuid NOT NULL,
  progress_date date NOT NULL,
  pct integer NOT NULL CHECK (pct BETWEEN 0 AND 100),
  exercises text[] NOT NULL DEFAULT '{}',
  exercises_total integer NOT NULL DEFAULT 0,
  meals text[] NOT NULL DEFAULT '{}',
  meals_total integer NOT NULL DEFAULT 0,
  sleep_done boolean NOT NULL DEFAULT false,
  water_cups integer NOT NULL DEFAULT 0 CHECK (water_cups BETWEEN 0 AND 40),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, progress_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_progress TO authenticated;
GRANT ALL ON public.daily_progress TO service_role;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress select" ON public.daily_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own progress insert" ON public.daily_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own progress update" ON public.daily_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own progress delete" ON public.daily_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);