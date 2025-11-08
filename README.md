# EMI Marketplace - Full-Stack Web Application

A modern full-stack web application for purchasing smartphones with flexible EMI (Equated Monthly Installment) plans backed by mutual funds. Built with React, Node.js, Express, and MongoDB.

![EMI Marketplace](https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop)

## 🚀 Features

- **Dynamic Product Catalog**: Browse latest smartphones with detailed specifications
- **Flexible EMI Plans**: Multiple EMI options (3-12 months) with competitive interest rates
- **Variant Selection**: Choose storage, color, and finish options
- **Responsive Design**: Optimized for all devices with modern UI/UX
- **Real-time Data**: All product and EMI data served from MongoDB database
- **SEO-Friendly URLs**: Unique product URLs (e.g., `/products/iphone-17-pro`)
- **Interactive Components**: Image galleries, variant selectors, and EMI calculators

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Additional Tools
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/emi-marketplace.git
cd emi-marketplace
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Update .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/emi_marketplace

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on `http://localhost:3000`

## 🗄️ Database Schema

### Products Collection

```javascript
{
  _id: ObjectId,
  name: String,           // "Apple iPhone 17 Pro"
  slug: String,           // "apple-iphone-17-pro"
  brand: String,          // "Apple"
  category: String,       // "Smart Phones"
  basePrice: Number,      // 134900
  mrp: Number,           // 149900
  description: String,
  features: [String],
  images: [String],
  variants: [{
    name: String,         // "Storage" | "Color"
    type: String,         // "storage" | "color" | "finish"
    value: String,        // "256 GB" | "Silver"
    priceModifier: Number // 0 | 10000
  }],
  emiPlans: [{
    tenure: Number,       // 3, 6, 9, 12
    monthlyAmount: Number,
    interestRate: Number,
    cashback: Number,
    downpayment: Number,
    isPopular: Boolean
  }],
  isActive: Boolean,
  createdAt: Date
}
```

## 🌐 API Endpoints

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all active products |
| GET | `/api/products/:id` | Get product by ID or slug |
| POST | `/api/products` | Create new product |
| POST | `/api/products/calculate-emi` | Calculate custom EMI plans |

### Example API Response

```json
{
  "_id": "674d8f2a1234567890abcdef",
  "name": "Apple iPhone 17 Pro",
  "slug": "apple-iphone-17-pro",
  "brand": "Apple",
  "category": "Smart Phones",
  "basePrice": 134900,
  "mrp": 149900,
  "variants": [
    {
      "name": "Storage",
      "type": "storage",
      "value": "256 GB",
      "priceModifier": 10000
    }
  ],
  "emiPlans": [
    {
      "tenure": 3,
      "monthlyAmount": 38221,
      "interestRate": 0,
      "downpayment": 20235,
      "isPopular": true
    }
  ]
}
```

## 📱 Product Catalog

The application includes 4 flagship smartphones:

1. **Apple iPhone 17 Pro** - Starting ₹1,34,900
2. **Samsung Galaxy S24 Ultra** - Starting ₹1,24,999  
3. **OnePlus 12 Pro** - Starting ₹89,999
4. **Google Pixel 8 Pro** - Starting ₹1,06,999

Each product features:
- Multiple storage variants (128GB, 256GB, 512GB, 1TB)
- Color options (Silver, Black, Purple, etc.)
- 4 EMI plans (3, 6, 9, 12 months)
- Interest rates from 0% to 13.5%
- Cashback offers up to ₹2,000

## 🎨 Color Scheme & Design

The application uses a professional indigo and dark blue color palette:

- **Primary Colors**: Indigo shades (#6366f1 to #312e81)
- **Secondary Colors**: Dark blue/slate (#0f172a to #64748b) 
- **Background**: Clean white (#ffffff) and light gray (#f8fafc)
- **No Gradients**: Solid colors for a clean, professional look

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render or Railway
2. Connect your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `FRONTEND_URL`
4. Deploy the `backend` directory

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel or Netlify
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variable: `REACT_APP_API_URL`

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/emi_marketplace
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Design inspiration from Snapmint
- Icons from Heroicons
- Images from Unsplash
- UI components styled with Tailwind CSS

---

**Live Demo**: [https://emi-marketplace.vercel.app](https://emi-marketplace.vercel.app)

**API Documentation**: [https://emi-marketplace-api.render.com/api](https://emi-marketplace-api.render.com/api)