import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  if (supabaseUrl.includes('.')) {
    supabaseUrl = `https://${supabaseUrl}`;
  } else {
    supabaseUrl = `https://${supabaseUrl}.supabase.co`;
  }
}

try {
  new URL(supabaseUrl);
} catch (e) {
  supabaseUrl = 'https://example-placeholder.supabase.co';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ensureUserProfile = async (user: any) => {
  if (!user) return;
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name: user.user_metadata?.full_name || user.phone || 'KisanMitra User',
        phone: user.phone || '',
        photo_url: user.user_metadata?.avatar_url || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id', ignoreDuplicates: true });
      
    if (error) {
      if (error.message?.includes('Failed to fetch') || error.message?.includes('FetchError')) {
        console.warn("Could not connect to Supabase (Failed to fetch). If you are in the preview, ensure your Supabase URL is correct and the project is active.");
      } else {
        console.error("Error ensuring profile:", error);
      }
    }
  } catch (err: any) {
    if (err?.message === 'Failed to fetch' || err?.message?.includes('FetchError') || err?.toString().includes('TypeError: Failed to fetch')) {
      console.warn("Could not connect to Supabase (Failed to fetch). Please check your Supabase project status.");
    } else {
      console.error("Supabase profile error:", err);
    }
  }
};

export const logout = async () => {
  await supabase.auth.signOut();
};
