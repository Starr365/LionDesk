import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// Config imports
import { testConnection } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';

// Swagger documentation
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

// Services imports
import { initSocket } from './services/socket.service.js';
import { startEscalationCron } from './services/escalation.service.js';

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Setup CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LionDesk Help-Desk API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

// Create HTTP server
const httpServer = createServer(app);

// Mount Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role }
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid or expired token'));
  }
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.user.id} (${socket.user.role})`);

  // Room subscriptions
  socket.join(`user:${socket.user.id}`);
  socket.join(`role:${socket.user.role}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.user.id}`);
  });
});

// Initialize Socket emitter service
initSocket(io);

// Start operations
const startServer = async () => {
  // 1. Verify DB connection
  await testConnection();

  // 2. Start cron job
  startEscalationCron();

  // 3. Listen to port
  httpServer.listen(PORT, () => {
    console.log(`[LionDesk Server] HTTP & WebSockets running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
