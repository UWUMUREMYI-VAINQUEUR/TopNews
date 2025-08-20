require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const { notificationSocket } = require('./sockets/notificationSocket');

const PORT = process.env.PORT || 10000;

const server = http.createServer(app);

// Socket.io CORS (matches backend)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Socket.io CORS not allowed: ${origin}`));
    },
    methods: ['GET','POST'],
    credentials: true
  }
});

// Initialize notifications
notificationSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io, server };
