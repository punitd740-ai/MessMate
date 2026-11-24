require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { connectDB, getDbStatus } = require('./config/db');
const { seedDatabase } = require('./seed/seedData');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const messOwnerRoutes = require('./routes/messOwnerRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS Configuration
const frontendUrl = process.env.FRONTEND_URL;
const corsOptions = {
  origin: frontendUrl
    ? [frontendUrl.replace(/\/+$/, ''), 'http://localhost:5173', 'http://127.0.0.1:5173']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Database Initialization & Seeding
(async () => {
  await connectDB();
  await seedDatabase(false);
})();

// Health Check API
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  return res.json({
    status: 'online',
    platform: 'MessMate – Smart Mess Management System',
    tagline: 'Save Food. Save Money. Manage Smartly.',
    version: '1.0.0',
    dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Quick Seed Reset Endpoint (Protected in production)
app.post('/api/seed/reset', async (req, res) => {
  if (process.env.NODE_ENV === 'production' && !req.headers['x-admin-key']) {
    return res.status(403).json({
      success: false,
      message: 'Database reset endpoint is restricted in production.'
    });
  }
  try {
    await seedDatabase(true);
    return res.json({
      success: true,
      message: 'MessMate database reset and seeded with fresh demo data.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/owner', messOwnerRoutes);
app.use('/api/admin', superAdminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 MessMate Server running on http://localhost:${PORT}`);
  console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💡 Shared Savings Engine: Active`);
  console.log(`=======================================================`);
});
