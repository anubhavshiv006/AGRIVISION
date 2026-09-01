import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Ensure the URL is valid HTTP/HTTPS to prevent app crashes
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  // If user just provided the project ID or domain without https://
  if (supabaseUrl.includes('.')) {
    supabaseUrl = `https://${supabaseUrl}`;
  } else {
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
  }
}

// Final safety check
try {
  new URL(supabaseUrl);
} catch (e) {
  supabaseUrl = 'https://example-placeholder.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
