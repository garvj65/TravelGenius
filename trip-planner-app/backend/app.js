const express = require('express');
const supabase = require('./config/supabase');

const app = express();

app.get('/test-supabase', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).send(error);
  res.send(data);
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
