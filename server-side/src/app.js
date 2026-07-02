import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LionDesk Help-Desk API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[LionDesk Server] running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
