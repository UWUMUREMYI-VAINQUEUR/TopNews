const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const postSearchRoutes = require('./routes/postSearchRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tagRoutes = require('./routes/tagRoutes');
const profileRoutes = require('./routes/profileRoutes');

const { pool } = require('./config/db');

// same allowlist as server.js
const allowedOrigins = [
  process.env.FRONTEND_URL,      // e.g. https://topnews-frontend.onrender.com
  process.env.FRONTEND_URL_2,    // optional
  'http://localhost:5173'        // local dev
].filter(Boolean);

// CORS (don’t use "*" with credentials)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS (http): ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // only needed if you use cookies; fine to leave true
}));
// handle preflight
app.options('*', cors());

// body parsing
app.use(express.json({ limit: '10mb' }));

// routes
app.use('/api/posts/search', postSearchRoutes);
app.use('/api/posts', postRoutes);

app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/followers', followRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

// health checks
app.get('/api', (req, res) => res.json({ message: 'API is working!' }));

app.get('/api/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ databaseTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('News Blog API running...'));

module.exports = app;
