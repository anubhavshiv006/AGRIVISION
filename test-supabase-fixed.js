import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
  if (url.includes('.')) url = `https://${url}`;
  else url = `https://${url}.supabase.co`;
}

console.log("Using URL:", url);
const supabase = createClient(url, key);

async function runTest() {
  const email = `anubhavshiv55+test${Date.now()}@gmail.com`;
  const password = 'TestPassword123!';
  
  console.log("2. Signing up dummy user:", email);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("❌ Auth Error:", authError.message);
    return;
  }
  console.log("✅ Auth successful! UID:", authData.user?.id);
  
  const uid = authData.user?.id;
  if (!uid) return;
  
  console.log("3. Saving profile data...");
  const { data: profileData, error: profileError } = await supabase.from('profiles').upsert({
    id: uid,
    name: 'Test Farmer',
    phone: '1234567890',
    location: 'Delhi',
    farm_size: '5 Acres',
    updated_at: new Date().toISOString()
  }).select();

  if (profileError) {
    console.error("❌ Profile Save Error:", profileError.message);
    return;
  }
  console.log("✅ Profile saved!", profileData);
  
  console.log("4. Reading profile data...");
  const { data: fetchProfile, error: fetchError } = await supabase.from('profiles').select('*').eq('id', uid).single();
  if (fetchError) {
     console.error("❌ Profile Read Error:", fetchError.message);
  } else {
     console.log("✅ Profile read successful!", fetchProfile.name);
  }
}

runTest();
