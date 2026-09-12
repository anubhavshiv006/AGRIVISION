import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function test() {
  const form = new FormData();
  form.append('cropType', 'Auto Detect (AI)');
  form.append('language', 'en');
  
  // download a real plant image
  const imgRes = await fetch('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Wheat_rust_1.jpg/800px-Wheat_rust_1.jpg');
  const buffer = await imgRes.buffer();

  form.append('image', buffer, { filename: 'dummy.jpg', contentType: 'image/jpeg' });

  try {
    const res = await fetch('http://localhost:3000/api/gemini/analyze-crop', {
      method: 'POST',
      body: form,
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error(err);
  }
}
test();
