const fs = require('fs');

async function run() {
  const fetch = (await import('node-fetch')).default;
  const FormData = (await import('form-data')).default;
  
  const form = new FormData();
  form.append('cropType', 'Wheat');
  form.append('symptoms', 'Yellow leaves');
  form.append('language', 'en');
  // Just use a dummy text file as image, or create a small 1x1 image
  form.append('image', Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), { filename: 'dummy.gif', contentType: 'image/gif' });

  fetch('http://localhost:3000/api/gemini/analyze-crop', {
    method: 'POST',
    body: form
  }).then(res => res.text()).then(console.log).catch(console.error);
}
run();
