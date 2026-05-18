-- Migration 003: Create lessons table
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  topic text not null,
  mode text check (mode in ('beginner', 'deep', 'exam', 'revision')) not null,
  content jsonb not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.lessons enable row level security;

-- Create policies
create policy "Users can read own lessons" on public.lessons
  for select using (auth.uid() = user_id);

create policy "Users can insert own lessons" on public.lessons
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own lessons" on public.lessons
  for delete using (auth.uid() = user_id);
