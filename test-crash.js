import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function test() {
  const form = new FormData();
  form.append('cropType', 'Wheat');
  form.append('language', 'en');
  // Create a 5MB dummy image
  const buffer = Buffer.alloc(5 * 1024 * 1024, 'a');
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
