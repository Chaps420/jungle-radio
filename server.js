const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// TEMP: Use your provided PostgreSQL URL directly here for now
const pool = new Pool({
  connectionString: 'postgresql://radio_user:1yar6SxTbuza4IgaN1maYKGATzJTgMgz@dpg-d1146aadbo4c739kl3i0-a/radio_user',
  ssl: { rejectUnauthorized: false }
});

const ADMIN_PASSWORD = 'FPT589'; // Or replace with process.env.ADMIN_PASSWORD if you move it to secrets

app.use(cors());
app.use(express.json());

app.get('/api/songs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songs ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/songs', async (req, res) => {
  const { name, song } = req.body;
  if (!name || !song) return res.status(400).json({ error: 'Missing fields' });
  try {
    await pool.query('INSERT INTO songs (name, song) VALUES ($1, $2)', [name, song]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/songs/:id', async (req, res) => {
  const auth = req.headers.authorization?.split(' ')[1];
  if (auth !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Forbidden' });
  try {
    await pool.query('DELETE FROM songs WHERE id = $1', [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
