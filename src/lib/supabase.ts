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
      
    if (error) console.error("Error ensuring profile:", error);
  } catch (err) {
    console.error("Supabase profile error:", err);
  }
};

export const logout = async () => {
  await supabase.auth.signOut();
};
