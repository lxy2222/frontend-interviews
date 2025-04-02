import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in your .env.local file
// For development, you can create a .env.local file with these values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn(
      'Supabase URL or Anonymous Key is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 