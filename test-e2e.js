import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (url && !url.startsWith('http')) url = `https://${url}.supabase.co`;

const supabase = createClient(url, key);

async function run() {
  const email = `test${Date.now()}@example.com`;
  console.log("Signing up", email);
  const { data: auth, error: authErr } = await supabase.auth.signUp({ email, password: 'password123' });
  if (authErr) { console.error("Auth err:", authErr); return; }
  
  const uid = auth.user.id;
  console.log("UID:", uid);
  
  console.log("Upserting profile...");
  const { data: prof, error: profErr } = await supabase.from('profiles').upsert({ id: uid, name: 'Anubhav' }).select();
  if (profErr) {
    console.error("Prof err:", profErr);
  } else {
    console.log("Success:", prof);
  }
}
run();
