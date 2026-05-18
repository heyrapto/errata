-- Migration 007: Create progress table
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  topic text not null,
  score integer check (score between 0 and 100) not null,
  weak_areas text[] default '{}'::text[] not null,
  recorded_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.progress enable row level security;

-- Create policies
create policy "Users can read own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.progress
  for update using (auth.uid() = user_id);
