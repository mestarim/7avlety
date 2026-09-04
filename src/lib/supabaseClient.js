import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://swadzlaylihpngcbdacl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YWR6bGF5bGlocG5nY2JkYWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MTE0MTgsImV4cCI6MjEwNDA4NzQxOH0.Pk_uFVdlzekCl6hb0RUmSGNM0UmfhUCucl8OO_7Ze9U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
