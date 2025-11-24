# 🚀 Walx Deployment Guide

## Overview

Since this is a full-stack application with a Rust backend and React frontend, we'll use a **split deployment strategy**:

- **Frontend** → Vercel (Static hosting)
- **Backend** → Railway/Render (Supports Rust + Docker)

---

## 📋 Prerequisites

1. **Accounts Required**:
   - [Vercel](https://vercel.com) - For frontend
   - [Railway](https://railway.app) OR [Render](https://render.com) - For backend
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - For database (free tier)

2. **Tools**:
   - Git (already set up)
   - Vercel CLI (optional): `npm i -g vercel`
   - Railway CLI (optional): `npm i -g @railway/cli`

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Free Cluster**:
   - Choose "Shared" (Free tier)
   - Select region closest to your users
   - Create cluster

3. **Database Access**:
   - Go to "Database Access"
   - Add new database user
   - Set username and password (save these!)

4. **Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String**:
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/walx`

---

## 🖥️ Step 2: Deploy Backend to Railway

### Option A: Via Railway Dashboard (Easiest)

1. **Visit**: [railway.app](https://railway.app)

2. **Sign In**: Use GitHub account

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Walx` repository

4. **Configure Service**:
   - Select the backend service
   - Railway will auto-detect Dockerfile

5. **Add Environment Variables**:
   - Go to "Variables" tab
   - Add:
     ```
     PORT=8080
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/walx
     RUST_LOG=info
     ```

6. **Deploy**:
   - Railway will automatically build and deploy
   - Wait for deployment to complete
   - **Copy the public URL** (e.g., `https://walx-backend.up.railway.app`)

### Option B: Via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd "/home/mubashir123/FYP FOLDER/Blockchain Project"
railway init

# Link to project
railway link

# Add environment variables
railway variables set PORT=8080
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/walx"

# Deploy
railway up
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### Update Backend URL

Before deploying, update the backend URL in the frontend:

```bash
# Edit frontend/.env.production
# Replace with your Railway backend URL
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Option A: Via Vercel Dashboard (Easiest)

1. **Visit**: [vercel.com](https://vercel.com)

2. **Sign In**: Use GitHub account

3. **Import Project**:
   - Click "Add New" → "Project"
   - Import your `Walx` repository

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Environment Variables**:
   - Add variable:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

6. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - **Your app is live!** 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project
cd "/home/mubashir123/FYP FOLDER/Blockchain Project"

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set up project
# - Deploy

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.railway.app/api
```

---

## 🔧 Alternative Backend Hosting (Render)

If you prefer Render over Railway:

1. **Visit**: [render.com](https://render.com)

2. **Sign In**: Use GitHub account

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your `Walx` repository

4. **Configure**:
   - **Name**: walx-backend
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: Free

5. **Environment Variables**:
   ```
   PORT=8080
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/walx
   RUST_LOG=info
   ```

6. **Deploy**: Click "Create Web Service"

---

## ✅ Step 4: Verify Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.railway.app/api/blockchain/blocks
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try registering a new user
   - Check if API calls work

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

- **Push to GitHub** → Automatically deploys
- **Pull requests** → Preview deployments

To enable:
1. Just push your code to GitHub
2. Services will auto-detect and deploy

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- **Check**: MongoDB connection string is correct
- **Check**: All environment variables are set
- **View Logs**: Railway/Render dashboard → View logs

**Problem**: MongoDB connection failed
- **Check**: IP whitelist includes 0.0.0.0/0
- **Check**: Username/password are correct
- **Check**: Database user has read/write permissions

### Frontend Issues

**Problem**: API calls fail
- **Check**: `VITE_API_URL` is set correctly
- **Check**: Backend is running and accessible
- **Check**: CORS is enabled (already configured in backend)

**Problem**: Build fails
- **Check**: `package.json` dependencies are correct
- **Try**: Clear cache and rebuild

---

## 📊 Monitoring

### Railway
- Dashboard → Select service → "Metrics"
- View CPU, Memory, Network usage

### Vercel
- Dashboard → Select project → "Analytics"
- View page views, performance

### MongoDB Atlas
- Dashboard → Clusters → "Metrics"
- Monitor database operations

---

## 💰 Cost Estimates

**Free Tier Limits**:

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | ✅ Yes | 100 GB bandwidth/month |
| Railway | ✅ Yes | $5 credit/month (~500 hours) |
| Render | ✅ Yes | 750 hours/month (sleeps after 15min inactive) |
| MongoDB Atlas | ✅ Yes | 512 MB storage |

**Recommendation**: Start with free tiers, upgrade if needed.

---

## 🔐 Security Checklist

- [ ] MongoDB password is strong and unique
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] API endpoints are tested for security
- [ ] Rate limiting considered (for production)

---

## 📝 Post-Deployment

1. **Update README**: Add live demo links
2. **Monitor Logs**: Check for errors
3. **Test All Features**: Registration, transactions, blockchain explorer
4. **Share**: Send links to users/testers

---

## 🆘 Need Help?

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB**: [docs.mongodb.com](https://docs.mongodb.com)

---

## 🎉 Quick Deploy Commands

```bash
# 1. Commit latest changes
cd "/home/mubashir123/FYP FOLDER/Blockchain Project"
git add .
git commit -m "Add deployment configurations"
git push origin main

# 2. Deploy backend (Railway CLI)
railway login
railway init
railway up

# 3. Deploy frontend (Vercel CLI)
vercel --prod

# Done! 🚀
```

---

**Next Steps**: Follow the step-by-step guide above to deploy your application!
