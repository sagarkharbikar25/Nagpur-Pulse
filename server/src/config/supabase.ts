import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Client for public operations (respects RLS)
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

// Client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);