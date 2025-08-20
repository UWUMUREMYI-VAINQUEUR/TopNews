require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
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

// Allowed origins for both prod and local
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2
].filter(Boolean);

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Routes
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

// Health check
app.get('/', (req, res) => res.send('News Blog API running...'));

module.exports = app;
