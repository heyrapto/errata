-- Seed script for EduAgent AI
-- Seed a default user
insert into public.users (id, email, name, avatar_url)
values 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'tutor.demo@eduagent.ai', 'Demo Student', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Demo')
on conflict (id) do nothing;

-- Seed default schedules
insert into public.schedules (user_id, subject, day_of_week, start_time, duration_mins, active)
values
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Mathematics (Calculus Limits)', 1, '10:00:00', 45, true),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Physics (Quantum Mechanics)', 3, '14:30:00', 60, true),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Computer Science (Algorithms)', 5, '09:00:00', 30, true)
on conflict do nothing;

-- Seed initial progress
insert into public.progress (user_id, topic, score, weak_areas)
values
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Calculus Limits', 85, array['Infinite Limits', 'Limit Laws']),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Quantum Mechanics', 40, array['Schrodinger Equation', 'Wave-Particle Duality']),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Data Structures', 95, array[]::text[])
on conflict do nothing;
