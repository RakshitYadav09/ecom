const mongoose = require('mongoose');

const emiPlanSchema = new mongoose.Schema({
  tenure: {
    type: Number,
    required: true
  },
  monthlyAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  cashback: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  downpayment: {
    type: Number,
    required: true
  }
});

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['storage', 'color', 'finish']
  },
  value: {
    type: String,
    required: true
  },
  priceModifier: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  hexCode: {
    type: String
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  images: [{
    type: String,
    required: true
  }],
  variants: [variantSchema],
  emiPlans: [emiPlanSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);