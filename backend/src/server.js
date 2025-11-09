const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
// CORS Configuration for local development
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'EMI Marketplace API is running!' });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'EMI Marketplace API',
    version: '1.0.0',
    description: 'REST API for EMI-based smartphone marketplace',
    endpoints: {
      'GET /api/products': 'Get all active products',
      'GET /api/products/:id': 'Get product by ID or slug',
      'POST /api/products': 'Create new product (admin)',
      'POST /api/products/calculate-emi': 'Calculate custom EMI plans'
    },
    examples: {
      'Get all products': 'GET /api/products',
      'Get iPhone by slug': 'GET /api/products/apple-iphone-17-pro',
      'Get by MongoDB ID': 'GET /api/products/674d8f2a1234567890abcdef'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});