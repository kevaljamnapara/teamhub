require('dotenv').config();

const http = require('http');
const connectDB = require('./src/config/db');
const { configureCloudinary } = require('./src/config/cloudinary');
const { initializeSocket } = require('./src/config/socket');
const setupSocketHandlers = require('./src/sockets');
const createApp = require('./src/app');

const PORT = process.env.PORT || 3001;

/**
 * Bootstrap the server:
 * 1. Connect to MongoDB
 * 2. Configure Cloudinary
 * 3. Create Express app
 * 4. Create HTTP server
 * 5. Initialize Socket.io
 * 6. Start listening
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Configure Cloudinary
    configureCloudinary();

    // 3. Create Express application
    const app = createApp();

    // 4. Create HTTP server (required for Socket.io)
    const server = http.createServer(app);

    // 5. Initialize Socket.io and attach handlers
    const io = initializeSocket(server);
    setupSocketHandlers(io);

    // 6. Start listening
    server.listen(PORT, () => {
      console.log(`\n🚀 TeamHub Server is running`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   API:         http://localhost:${PORT}/api`);
      console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
