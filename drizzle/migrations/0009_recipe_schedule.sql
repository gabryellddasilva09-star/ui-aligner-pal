CREATE TABLE public.recipe_schedule (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  recipe_id text NOT NULL,
  weekdays integer[] NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id),
  CHECK (weekdays <@ ARRAY[0,1,2,3,4,5,6])
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipe_schedule TO authenticated;
GRANT ALL ON public.recipe_schedule TO service_role;
ALTER TABLE public.recipe_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own recipe schedule" ON public.recipe_schedule FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);