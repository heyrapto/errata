-- Migration 006: Create schedules table
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  subject text not null,
  day_of_week integer check (day_of_week between 0 and 6) not null,
  start_time time not null,
  duration_mins integer default 30 not null,
  active boolean default true not null
);

-- Enable Row Level Security (RLS)
alter table public.schedules enable row level security;

-- Create policies
create policy "Users can read own schedules" on public.schedules
  for select using (auth.uid() = user_id);

create policy "Users can insert own schedules" on public.schedules
  for insert with check (auth.uid() = user_id);

create policy "Users can update own schedules" on public.schedules
  for update using (auth.uid() = user_id);

create policy "Users can delete own schedules" on public.schedules
  for delete using (auth.uid() = user_id);
