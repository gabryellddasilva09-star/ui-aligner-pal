CREATE TABLE public.program_enrollments (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  started_on date NOT NULL DEFAULT CURRENT_DATE,
  remind_time text NOT NULL DEFAULT '09:00',
  remind boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_enrollments TO authenticated;
GRANT ALL ON public.program_enrollments TO service_role;
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own enrollment" ON public.program_enrollments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.program_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  day smallint NOT NULL CHECK (day BETWEEN 1 AND 30),
  feeling text,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_progress TO authenticated;
GRANT ALL ON public.program_progress TO service_role;
ALTER TABLE public.program_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress" ON public.program_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);