CREATE TABLE public.checkin_reminders (
  user_id uuid not null default auth.uid() primary key,
  remind_time text not null default '20:00',
  remind boolean not null default true,
  frequency text not null default 'daily' check (frequency in ('daily','twice_week','weekly','monthly')),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkin_reminders TO authenticated;
GRANT ALL ON public.checkin_reminders TO service_role;
ALTER TABLE public.checkin_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own checkin reminder" ON public.checkin_reminders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);