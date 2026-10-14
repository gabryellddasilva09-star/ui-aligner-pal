CREATE TABLE public.movement_exercise_completions (
 user_id uuid NOT NULL,
 exercise_id text NOT NULL CHECK (exercise_id IN ('pescoco','ombros','bracos','quadril','pernas','cadeira')),
 activity_date date NOT NULL,
 completed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id, exercise_id, activity_date)
);
GRANT SELECT, INSERT ON public.movement_exercise_completions TO authenticated;
GRANT ALL ON public.movement_exercise_completions TO service_role;
ALTER TABLE public.movement_exercise_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own exercise completions" ON public.movement_exercise_completions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Complete own scheduled exercises" ON public.movement_exercise_completions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.movement_exercise_schedule s WHERE s.user_id = auth.uid() AND s.exercise_id = movement_exercise_completions.exercise_id AND EXTRACT(DOW FROM movement_exercise_completions.activity_date)::integer = ANY(s.weekdays)));
