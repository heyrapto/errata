-- Migration 005: Create quizzes table
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  questions jsonb not null,
  score integer,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.quizzes enable row level security;

-- Create policies
create policy "Users can read own quizzes" on public.quizzes
  for select using (auth.uid() = user_id);

create policy "Users can insert own quizzes" on public.quizzes
  for insert with check (auth.uid() = user_id);

create policy "Users can update own quizzes" on public.quizzes
  for update using (auth.uid() = user_id);
