const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

/**
 * Middleware
 */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mosquito-alert.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * Routes
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

/**
 * Health Check Route
 */
app.get('/', (req, res) => {
  res.json({
    message: '🦟 Mosquito Alert+ API is running',
    version: '1.0.0',
    status: 'active',
  });
});

/**
 * One-time Admin Seeder Endpoint (REMOVE AFTER USE!)
 */
app.get('/seed-admin-now', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const Admin = require('./models/Admin');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@mosquitoalert.com' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists', email: existingAdmin.email });
    }
    
    // Create admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);
    
    const admin = await Admin.create({
      name: 'Admin User',
      email: 'admin@mosquitoalert.com',
      password: hashedPassword
    });
    
    res.json({ 
      message: 'Admin seeded successfully!', 
      email: admin.email,
      note: 'Now remove this endpoint from server.js!'
    });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/\n`);
});
