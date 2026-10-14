CREATE TABLE public.movement_exercise_schedule (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  exercise_id text NOT NULL CHECK (exercise_id IN ('pescoco','ombros','bracos','quadril','pernas','cadeira')),
  weekdays integer[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exercise_id),
  CHECK (weekdays <@ ARRAY[0,1,2,3,4,5,6])
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.movement_exercise_schedule TO authenticated;
GRANT ALL ON public.movement_exercise_schedule TO service_role;
ALTER TABLE public.movement_exercise_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own movement exercise schedule" ON public.movement_exercise_schedule FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);