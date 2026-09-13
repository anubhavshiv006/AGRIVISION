import fs from 'fs';

async function testAnalyze() {
  const FormData = (await import('form-data')).default;
  const form = new FormData();
  
  form.append('cropType', 'Tomato');
  form.append('symptoms', 'Yellow leaves');
  form.append('language', 'en');
  form.append('image', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'), { filename: 'test.png', contentType: 'image/png' });

  const fetch = (await import('node-fetch')).default;
  const res = await fetch('http://localhost:3000/api/gemini/analyze-crop', {
    method: 'POST',
    body: form
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
testAnalyze();
