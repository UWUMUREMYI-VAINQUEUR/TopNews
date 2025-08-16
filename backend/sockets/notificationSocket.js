let ioInstance;

function notificationSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user-specific room, client emits 'joinRoom' with userId after login
    socket.on('joinRoom', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

// Function to send notification to a user and save it to DB
async function sendNotification(userId, type, data) {
  if (!ioInstance) {
    console.warn('Socket.io not initialized');
    return;
  }

  // Save notification in DB
  const db = require('../config/db');
  try {
    await db.query(
      `INSERT INTO notifications (user_id, type, data, read, created_at) 
       VALUES ($1, $2, $3, false, NOW())`,
      [userId, type, JSON.stringify(data)]
    );
  } catch (err) {
    console.error('Error saving notification to DB:', err);
  }

  // Emit live notification event
  ioInstance.to(`user_${userId}`).emit('notification', { type, data });
}

module.exports = { notificationSocket, sendNotification };
