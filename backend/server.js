require('dotenv').config();
const http = require('http');
const app = require('./app');
const socketio = require('socket.io');
const { notificationSocket } = require('./sockets/notificationSocket');

// Render assigns a PORT automatically via process.env.PORT
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*', // Allow your deployed frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

// Initialize socket events
notificationSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
