/**
 * Main Application Server
 * Sets up Express app with all routes, middleware, and error handling
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const playerRoutes = require('./routes/playerRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const matchRoutes = require('./routes/matchRoutes');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize app
const app = express();

// ===== Middleware =====
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors()); // CORS
app.use(express.json()); // JSON parser

// ===== API Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/news', newsRoutes);

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== Root Endpoint =====
app.get('/', (req, res) => {
  res.json({
    message: 'Mongolian Table Tennis Federation API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      players: '/api/players',
      tournaments: '/api/tournaments',
      matches: '/api/matches',
      news: '/api/news',
    },
    health: '/health',
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path,
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     Mongolian Table Tennis Federation API Server          ║
╠═══════════════════════════════════════════════════════════╣
║ Server running on: http://localhost:${PORT}
║ Environment: ${NODE_ENV}
║ Health check: http://localhost:${PORT}/health
║ API Docs: http://localhost:${PORT}
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
