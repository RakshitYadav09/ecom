# 🚀 Deployment Guide

## Prerequisites
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)

## Backend Deployment (Vercel)

### Step 1: Prepare Backend for Vercel
1. Your backend already has `vercel.json` configured
2. Make sure your MongoDB connection string is ready

### Step 2: Deploy Backend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend directory
cd backend

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: emi-marketplace-api
# - Directory: ./
```

### Step 3: Add Environment Variables in Vercel Dashboard
Go to your Vercel project dashboard and add:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: production

## Frontend Deployment (Vercel)

### Step 1: Update API URL
Update `frontend/.env` with your deployed backend URL:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

### Step 2: Deploy Frontend
```bash
# Navigate to frontend directory
cd frontend

# Build and deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: emi-marketplace
# - Directory: ./
```

## Alternative: Single Vercel Deployment

You can also deploy both from the root directory with separate projects.

## Environment Variables Summary

### Backend (Vercel)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: production

### Frontend (Vercel)
- `REACT_APP_API_URL`: Your backend API URL

## Post-Deployment Checklist
- [ ] Backend API accessible at `/api/products`
- [ ] Frontend loads and displays products
- [ ] EMI calculator works
- [ ] Product navigation works
- [ ] Mobile responsiveness verified

## Monitoring
- Check Vercel logs for any runtime errors
- Monitor MongoDB Atlas for connection issues
- Test all API endpoints after deployment