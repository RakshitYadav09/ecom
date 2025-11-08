import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by slug (now uses the main endpoint)
  getProductBySlug: async (slug) => {
    try {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Calculate custom EMI based on variants and options
  calculateCustomEMI: async (productId, variantPrices, customTenure = null, customDownpayment = null) => {
    try {
      const response = await api.post('/products/calculate-emi', {
        productId,
        variantPrices,
        customTenure,
        customDownpayment
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating EMI:', error);
      throw error;
    }
  }
};

export default api;