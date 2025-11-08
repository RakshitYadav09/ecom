const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getProductById,
  calculateCustomEMI,
  createProduct
} = require('../controllers/productController');

// GET /api/products - Get all products
router.get('/', getProducts);

// GET /api/products/:id - Get product by ID (can be MongoDB ID or slug)
router.get('/:id', getProductById);

// GET /api/products/slug/:slug - Get product by slug (keep for legacy)
router.get('/slug/:slug', getProductBySlug);

// POST /api/products/calculate-emi - Calculate custom EMI
router.post('/calculate-emi', calculateCustomEMI);

// POST /api/products - Create new product
router.post('/', createProduct);

module.exports = router;