import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.');
}

// Client for standard actions
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations that bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
