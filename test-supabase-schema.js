import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (url && !url.startsWith('http')) url = `https://${url}.supabase.co`;

const supabase = createClient(url, key);

async function run() {
  const { error } = await supabase.from('profiles').upsert({ id: '5eb0495e-8450-490f-8ae6-de6c22841050', name: 'Test' });
  if (error) {
    console.error("Insert Error:", error.message);
  } else {
    console.log("Insert Success!");
  }
}
run();
