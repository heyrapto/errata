-- Migration 004: Create notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  content jsonb not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Create policies
create policy "Users can read own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "Users can insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notes" on public.notes
  for update using (auth.uid() = user_id);

create policy "Users can delete own notes" on public.notes
  for delete using (auth.uid() = user_id);
