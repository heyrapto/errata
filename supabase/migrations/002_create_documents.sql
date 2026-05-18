-- Migration 002: Create documents table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  storage_path text not null,
  subject text,
  indexed boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.documents enable row level security;

-- Create policies
create policy "Users can read own documents" on public.documents
  for select using (auth.uid() = user_id);

create policy "Users can insert own documents" on public.documents
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own documents" on public.documents
  for delete using (auth.uid() = user_id);
