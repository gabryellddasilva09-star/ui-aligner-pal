create table public.training_reminders (
  user_id uuid primary key default auth.uid(),
  remind_time text not null default '09:00' check (remind_time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  remind boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.training_reminders enable row level security;
grant select, insert, update, delete on public.training_reminders to authenticated;
grant all on public.training_reminders to service_role;
create policy "Own training reminder" on public.training_reminders for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);