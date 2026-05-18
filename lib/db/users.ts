import { supabaseAdmin } from './supabase';
import { User } from '@/types/user';

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error.message);
    return null;
  }
  return data;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }
  return data;
}

export async function upsertUser(user: Partial<User> & { id: string; email: string }): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user:', error.message);
    return null;
  }
  return data;
}
