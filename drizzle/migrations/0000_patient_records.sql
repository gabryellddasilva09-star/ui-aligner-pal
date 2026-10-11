CREATE TABLE public.daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  record_date date NOT NULL DEFAULT current_date,
  mood text NOT NULL,
  sleep text NOT NULL,
  pain smallint NOT NULL CHECK (pain BETWEEN 0 AND 10),
  fatigue text NOT NULL,
  disposition text NOT NULL,
  body_pain jsonb NOT NULL DEFAULT '{}'::jsonb,
  bed_time time,
  wake_time time,
  awakenings smallint CHECK (awakenings BETWEEN 0 AND 20),
  brain_fog text,
  brain_fog_note text CHECK (char_length(brain_fog_note) <= 1000),
  cycle text,
  triggers text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, record_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_records TO authenticated;
GRANT ALL ON public.daily_records TO service_role;
ALTER TABLE public.daily_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own records select" ON public.daily_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own records insert" ON public.daily_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own records update" ON public.daily_records FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own records delete" ON public.daily_records FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.relaxation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  seconds integer NOT NULL CHECK (seconds >= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.relaxation_sessions TO authenticated;
GRANT ALL ON public.relaxation_sessions TO service_role;
ALTER TABLE public.relaxation_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own sessions select" ON public.relaxation_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own sessions insert" ON public.relaxation_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own sessions delete" ON public.relaxation_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER daily_records_touch BEFORE UPDATE ON public.daily_records FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();