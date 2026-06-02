const User = require('../models/User');

let ioInstance = null;

/**
 * Set up Socket.io event handlers.
 * @param {import('socket.io').Server} io
 */
const setupSocketHandlers = (io) => {
  ioInstance = io;

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`🔌 User connected: ${socket.user.name} (${userId})`);

    // Join personal room for direct notifications
    socket.join(`user:${userId}`);

    // Update user status to online
    try {
      await User.findByIdAndUpdate(userId, { status: 'online' });
    } catch (err) {
      console.error('Failed to update user status:', err.message);
    }

    // Broadcast online status to all connected users
    io.emit('userOnline', { userId, name: socket.user.name });

    // --------------- Event Handlers ---------------

    /**
     * Join a project room to receive project-specific events.
     */
    socket.on('joinProject', (projectId) => {
      if (projectId) {
        socket.join(`project:${projectId}`);
        console.log(`  → ${socket.user.name} joined project room: ${projectId}`);
      }
    });

    /**
     * Leave a project room.
     */
    socket.on('leaveProject', (projectId) => {
      if (projectId) {
        socket.leave(`project:${projectId}`);
        console.log(`  ← ${socket.user.name} left project room: ${projectId}`);
      }
    });

    /**
     * Handle disconnection.
     */
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.user.name} (${userId})`);

      try {
        await User.findByIdAndUpdate(userId, { status: 'offline' });
      } catch (err) {
        console.error('Failed to update user status:', err.message);
      }

      io.emit('userOffline', { userId, name: socket.user.name });
    });
  });
};

// --------------- Emit Helpers ---------------

/**
 * Emit an event to a specific user's personal room.
 * @param {string} userId
 * @param {string} event
 * @param {*} data
 */
const emitToUser = (userId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit an event to all members of a project room.
 * @param {string} projectId
 * @param {string} event
 * @param {*} data
 */
const emitToProject = (projectId, event, data) => {
  if (ioInstance) {
    ioInstance.to(`project:${projectId}`).emit(event, data);
  }
};

/**
 * Emit an event to all connected clients.
 * @param {string} event
 * @param {*} data
 */
const emitToAll = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = setupSocketHandlers;
module.exports.emitToUser = emitToUser;
module.exports.emitToProject = emitToProject;
module.exports.emitToAll = emitToAll;
