const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const connectDB = require('./config/database');

const sampleProducts = [
  {
    name: "Apple iPhone 17 Pro",
    slug: "apple-iphone-17-pro",
    brand: "Apple",
    category: "Smart Phones",
    basePrice: 134900,
    mrp: 149900,
    description: "The most advanced iPhone yet with powerful A18 Pro chip, enhanced camera system, and all-day battery life.",
    features: [
      "6.1-inch Super Retina XDR display",
      "A18 Pro chip with 6-core GPU", 
      "Pro camera system with 48MP main camera",
      "Up to 27 hours video playback",
      "5G connectivity",
      "Face ID for secure authentication"
    ],
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58863c7c4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607936898994-502b7de81df6?w=500&h=500&fit=crop"
    ],
    variants: [
      { name: "Storage", type: "storage", value: "128 GB", priceModifier: 0 },
      { name: "Storage", type: "storage", value: "256 GB", priceModifier: 10000 },
      { name: "Storage", type: "storage", value: "512 GB", priceModifier: 20000 },
      { 
        name: "Color", 
        type: "color", 
        value: "Silver", 
        priceModifier: 0,
        hexCode: "#E5E7EB",
        images: [
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1565849904461-04a58863c7c4?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1607936898994-502b7de81df6?w=500&h=500&fit=crop"
        ]
      },
      { 
        name: "Color", 
        type: "color", 
        value: "Space Black", 
        priceModifier: 0,
        hexCode: "#1F2937",
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop"
        ]
      },
      { 
        name: "Color", 
        type: "color", 
        value: "Deep Purple", 
        priceModifier: 0,
        hexCode: "#7C3AED",
        images: [
          "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop"
        ]
      }
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 38221, interestRate: 0, cashback: 0, downpayment: 20235, isPopular: true },
      { tenure: 6, monthlyAmount: 21442, interestRate: 10.5, cashback: 500, downpayment: 40470 },
      { tenure: 9, monthlyAmount: 15281, interestRate: 12, cashback: 1000, downpayment: 40470 },
      { tenure: 12, monthlyAmount: 12106, interestRate: 13.5, cashback: 1500, downpayment: 40470 }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    category: "Smart Phones", 
    basePrice: 124999,
    mrp: 139999,
    description: "Ultimate creativity and productivity with built-in S Pen, advanced AI features, and powerful performance.",
    features: [
      "6.8-inch Dynamic AMOLED 2X display",
      "Snapdragon 8 Gen 3 processor",
      "200MP main camera with Space Zoom",
      "Built-in S Pen",
      "5000mAh battery with 45W fast charging",
      "Galaxy AI features"
    ],
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop"
    ],
    variants: [
      { name: "Storage", type: "storage", value: "256 GB", priceModifier: 0 },
      { name: "Storage", type: "storage", value: "512 GB", priceModifier: 15000 },
      { name: "Storage", type: "storage", value: "1 TB", priceModifier: 25000 },
      { 
        name: "Color", 
        type: "color", 
        value: "Titanium Black", 
        priceModifier: 0,
        hexCode: "#1F2937",
        images: [
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop"
        ]
      },
      { 
        name: "Color", 
        type: "color", 
        value: "Titanium Gray", 
        priceModifier: 0,
        hexCode: "#6B7280",
        images: [
          "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop"
        ]
      },
      { 
        name: "Color", 
        type: "color", 
        value: "Titanium Violet", 
        priceModifier: 0,
        hexCode: "#8B5CF6",
        images: [
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1565849904461-04a58863c7c4?w=500&h=500&fit=crop",
          "https://images.unsplash.com/photo-1607936898994-502b7de81df6?w=500&h=500&fit=crop"
        ]
      }
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 35416, interestRate: 0, cashback: 0, downpayment: 18750, isPopular: true },
      { tenure: 6, monthlyAmount: 19861, interestRate: 10.5, cashback: 750, downpayment: 37500 },
      { tenure: 9, monthlyAmount: 14153, interestRate: 12, cashback: 1250, downpayment: 37500 },
      { tenure: 12, downpayment: 37500, monthlyAmount: 11203, interestRate: 13.5, cashback: 2000 }
    ]
  },
  {
    name: "OnePlus 12 Pro",
    slug: "oneplus-12-pro", 
    brand: "OnePlus",
    category: "Smart Phones",
    basePrice: 89999,
    mrp: 99999,
    description: "Flagship performance meets elegant design with Snapdragon 8 Gen 3, Hasselblad cameras, and 100W fast charging.",
    features: [
      "6.82-inch Fluid AMOLED display with 120Hz",
      "Snapdragon 8 Gen 3 processor",
      "Hasselblad camera system with 50MP main",
      "5400mAh battery with 100W SuperVOOC",
      "OxygenOS based on Android 14",
      "Premium glass and metal design"
    ],
    images: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop", 
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop"
    ],
    variants: [
      { name: "Storage", type: "storage", value: "256 GB", priceModifier: 0 },
      { name: "Storage", type: "storage", value: "512 GB", priceModifier: 10000 },
      { name: "Color", type: "color", value: "Flowy Emerald", priceModifier: 0 },
      { name: "Color", type: "color", value: "Silky Black", priceModifier: 0 },
      { name: "Color", type: "color", value: "Timeless Blue", priceModifier: 0 }
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 25528, interestRate: 0, cashback: 0, downpayment: 13500, isPopular: true },
      { tenure: 6, monthlyAmount: 14319, interestRate: 10.5, cashback: 500, downpayment: 27000 },
      { tenure: 9, monthlyAmount: 10207, interestRate: 12, cashback: 750, downpayment: 27000 },
      { tenure: 12, monthlyAmount: 8074, interestRate: 13.5, cashback: 1000, downpayment: 27000 }
    ]
  },
  {
    name: "Google Pixel 8 Pro", 
    slug: "google-pixel-8-pro",
    brand: "Google",
    category: "Smart Phones",
    basePrice: 106999,
    mrp: 119999,
    description: "Pure Android experience powered by Google AI with the best computational photography and Titan M security chip.",
    features: [
      "6.7-inch LTPO OLED display with 120Hz", 
      "Google Tensor G3 chip with AI processing",
      "Pro triple camera system with Magic Eraser",
      "5050mAh battery with wireless charging",
      "7 years of OS and security updates",
      "Call Screen and Live Translate features"
    ],
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1607936898994-502b7de81df6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop"
    ],
    variants: [
      { name: "Storage", type: "storage", value: "128 GB", priceModifier: 0 },
      { name: "Storage", type: "storage", value: "256 GB", priceModifier: 7000 },
      { name: "Storage", type: "storage", value: "512 GB", priceModifier: 14000 },
      { name: "Color", type: "color", value: "Obsidian", priceModifier: 0 },
      { name: "Color", type: "color", value: "Porcelain", priceModifier: 0 },
      { name: "Color", type: "color", value: "Bay Blue", priceModifier: 0 }
    ],
    emiPlans: [
      { tenure: 3, monthlyAmount: 30361, interestRate: 0, cashback: 0, downpayment: 16050, isPopular: true },
      { tenure: 6, monthlyAmount: 17032, interestRate: 10.5, cashback: 600, downpayment: 32100 },
      { tenure: 9, monthlyAmount: 12139, interestRate: 12, cashback: 900, downpayment: 32100 },
      { tenure: 12, monthlyAmount: 9600, interestRate: 13.5, cashback: 1200, downpayment: 32100 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} products inserted successfully`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();