const Product = require('../models/Product');

// Calculate EMI based on price, tenure, and interest rate
const calculateEMI = (principal, tenure, interestRate) => {
  if (interestRate === 0) {
    return Math.round(principal / tenure);
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  return Math.round(emi);
};

// Calculate dynamic EMI plans based on current price
const calculateDynamicEMIPlans = (basePrice, basePlans) => {
  return basePlans.map(plan => ({
    ...plan.toObject(),
    monthlyAmount: calculateEMI(basePrice - plan.downpayment, plan.tenure, plan.interestRate)
  }));
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate dynamic EMI plans for base price
    const productData = product.toObject();
    productData.emiPlans = calculateDynamicEMIPlans(productData.basePrice, product.emiPlans);
    
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID (can be MongoDB ID or slug)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    // Check if it's a valid MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      // Treat as slug
      product = await Product.findOne({ 
        slug: id, 
        isActive: true 
      });
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate dynamic EMI plans for current price
    const productData = product.toObject();
    productData.emiPlans = calculateDynamicEMIPlans(productData.basePrice, product.emiPlans);
    
    res.json(productData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate EMI for specific price and tenure
const calculateCustomEMI = async (req, res) => {
  try {
    const { productId, variantPrices, customTenure, customDownpayment } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Calculate total price with variant modifiers
    let totalPrice = product.basePrice;
    if (variantPrices && variantPrices.length > 0) {
      variantPrices.forEach(modifier => {
        totalPrice += modifier;
      });
    }
    
    let emiPlans;
    
    if (customTenure && customDownpayment !== undefined) {
      // Custom calculation
      const principal = totalPrice - customDownpayment;
      const emiOptions = [
        { tenure: customTenure, interestRate: 0 },
        { tenure: customTenure, interestRate: 10.5 },
        { tenure: customTenure, interestRate: 12 },
        { tenure: customTenure, interestRate: 13.5 }
      ];
      
      emiPlans = emiOptions.map(option => ({
        tenure: option.tenure,
        monthlyAmount: calculateEMI(principal, option.tenure, option.interestRate),
        interestRate: option.interestRate,
        downpayment: customDownpayment,
        totalPrice,
        isCustom: true
      }));
    } else {
      // Use default plans with updated price
      emiPlans = calculateDynamicEMIPlans(totalPrice, product.emiPlans);
      emiPlans = emiPlans.map(plan => ({ ...plan, totalPrice }));
    }
    
    res.json({
      totalPrice,
      emiPlans,
      savings: product.mrp - totalPrice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product (for admin use)
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  calculateCustomEMI,
  createProduct
};