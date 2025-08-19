require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { notificationSocket } = require('./sockets/notificationSocket');

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

// allow both prod and local (optional second prod via FRONTEND_URL_2)
const allowedOrigins = [
  process.env.FRONTEND_URL,      // e.g. https://topnews-frontend.onrender.com
  process.env.FRONTEND_URL_2,    // optional second domain if you ever need it
  'http://localhost:5173'        // local dev
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS (socket.io): ${origin}`));
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// wire up your socket events
notificationSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io, server };
