const http = require('http');

const data = JSON.stringify({
  messages: [{ role: 'user', parts: [{ text: 'Hello' }] }],
  language: 'en'
});

fetch('http://localhost:3000/api/gemini/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: data
}).then(res => res.text()).then(console.log).catch(console.error);
