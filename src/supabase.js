import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Temporarily disabled Supabase requirement
let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials not found. Running in demo mode.");
  supabase = null;
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };