/**
 * Express app configuration
 */

import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    service: 'CXI Word Building Game Server'
  });
});

// API routes (to be added)
app.get('/api/status', (req, res) => {
  res.json({
    online: true,
    version: '1.0.0',
    features: {
      multiplayer: true,
      themes: ['general', 'countries', 'animals'],
      maxPlayers: 8,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
