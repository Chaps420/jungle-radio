const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FPT589';

// In-memory storage (replace with MongoDB later)
let songs = [];

// Basic URL parsing (no API calls)
function parseSongFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    let title = '';
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      title = urlObj.searchParams.get('title') || urlObj.searchParams.get('t') || urlObj.searchParams.get('v') || pathParts.pop() || '';
      title = title
        ? decodeURIComponent(title).replace(/[-_]/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim()
        : 'YouTube Song';
    } else if (urlObj.hostname.includes('spotify.com')) {
      title = pathParts[pathParts.indexOf('track') + 1] || pathParts.pop() || '';
      title = title
        ? decodeURIComponent(title).replace(/[-_]/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim()
        : 'Spotify Song';
    }
    return title || 'Unknown Song';
  } catch (error) {
    return 'Unknown Song';
  }
}

// Middleware to check admin password
function checkAdmin(req, res, next) {
  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Submit a song
app.post('/api/songs', async (req, res) => {
  const { url, title, artist, requesterName } = req.body;
  if (!url && !title) {
    return res.status(400).json({ error: 'URL or song title required' });
  }
  if (url && !url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|spotify\.com)/i)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const songTitle = title || (url ? parseSongFromUrl(url) : 'Unknown Song');
    const song = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: url || null,
      title: songTitle,
      artist: artist || null,
      requesterName: requesterName || 'Anonymous',
      createdAt: new Date().toISOString(),
      isProcessed: false,
    };
    songs.push(song);
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Get all songs
app.get('/api/songs', (req, res) => {
  res.json(songs);
});

// Mark song as played
app.post('/api/songs/:id/mark-played', checkAdmin, (req, res) => {
  const { id } = req.params;
  songs = songs.map(song => (song.id === id ? { ...song, isProcessed: true } : song));
  res.json({ success: true });
});

// Delete song
app.delete('/api/songs/:id', checkAdmin, (req, res) => {
  const { id } = req.params;
  songs = songs.filter(song => song.id !== id);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
