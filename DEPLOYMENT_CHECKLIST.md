# 🚀 Interactive Deployment Checklist

Copy this checklist and follow along. Check off each item as you complete it!

---

## 📋 Pre-Deployment Checklist

- [ ] I have a GitHub account (✅ Already done - your repo is at github.com/mubashirrao1122/Walx)
- [ ] I have an email address for creating accounts
- [ ] I have 30 minutes of free time

---

## STEP 1: MongoDB Atlas (Database) - 10 minutes ⏱️

### Create Account
- [ ] Go to: https://www.mongodb.com/cloud/atlas/register
- [ ] Click "Sign up" and use Google/GitHub (easiest)
- [ ] Verify your email if needed

### Create Free Cluster
- [ ] Click "Build a Database"
- [ ] Select "FREE" tier (M0 Sandbox)
- [ ] Choose provider: AWS
- [ ] Choose region: Closest to you (e.g., US East, Europe, Asia)
- [ ] Cluster name: Can leave default or use "Walx"
- [ ] Click "Create"
- [ ] Wait 3-5 minutes for cluster to provision ⏳

### Create Database User
- [ ] Go to "Database Access" (left sidebar)
- [ ] Click "Add New Database User"
- [ ] Authentication Method: Password
- [ ] Username: `walxuser` (or your choice)
- [ ] Password: Click "Autogenerate Secure Password" 
- [ ] **IMPORTANT**: Copy and save this password! Write it here: ________________
- [ ] Database User Privileges: "Read and write to any database"
- [ ] Click "Add User"

### Set Network Access
- [ ] Go to "Network Access" (left sidebar)
- [ ] Click "Add IP Address"
- [ ] Click "Allow Access from Anywhere"
- [ ] Confirm: 0.0.0.0/0
- [ ] Click "Confirm"

### Get Connection String
- [ ] Go back to "Database" (left sidebar)
- [ ] Click "Connect" button on your cluster
- [ ] Choose "Connect your application"
- [ ] Driver: Node.js (doesn't matter which one)
- [ ] Copy the connection string
- [ ] It looks like: `mongodb+srv://walxuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
- [ ] **Replace `<password>` with the password you saved earlier**
- [ ] Write your final connection string here:
  ```
  mongodb+srv://walxuser:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/walx
  ```

✅ MongoDB is ready!

---

## STEP 2: Railway (Backend) - 7 minutes ⏱️

### Create Account
- [ ] Go to: https://railway.app
- [ ] Click "Start a New Project"
- [ ] Click "Login with GitHub"
- [ ] Authorize Railway to access your GitHub

### Create New Project
- [ ] Click "New Project"
- [ ] Click "Deploy from GitHub repo"
- [ ] Select "mubashirrao1122/Walx"
- [ ] If you don't see it, click "Configure GitHub App" and give Railway access

### Configure Deployment
- [ ] Railway auto-detects the Dockerfile ✅
- [ ] Click on the service card (it should say "Dockerfile")

### Add Environment Variables
- [ ] Click "Variables" tab
- [ ] Click "New Variable"
- [ ] Add these THREE variables:

**Variable 1:**
- [ ] Key: `PORT`
- [ ] Value: `8080`

**Variable 2:**
- [ ] Key: `MONGODB_URI`
- [ ] Value: (Paste your MongoDB connection string from Step 1)

**Variable 3:**
- [ ] Key: `RUST_LOG`
- [ ] Value: `info`

### Deploy
- [ ] Click "Deploy" (or it auto-deploys)
- [ ] Wait for build to complete (5-10 minutes) ⏳
- [ ] Watch the logs - you'll see "Building Dockerfile..."

### Get Backend URL
- [ ] Once deployed, click "Settings" tab
- [ ] Scroll to "Domains"
- [ ] Click "Generate Domain"
- [ ] Copy the generated URL (e.g., `walx-production.up.railway.app`)
- [ ] Write your backend URL here: ________________

### Test Backend
- [ ] Open a new browser tab
- [ ] Go to: `https://YOUR-BACKEND-URL.railway.app/api/blockchain/blocks`
- [ ] You should see JSON response with blockchain data
- [ ] If you see JSON = SUCCESS! ✅

✅ Backend is deployed!

---

## STEP 3: Vercel (Frontend) - 5 minutes ⏱️

### Update Environment File
Before deploying, we need to update the backend URL in the frontend.

**IMPORTANT: DO THIS FIRST!**

- [ ] Open file: `frontend/.env.production`
- [ ] Replace `https://your-backend-url.railway.app/api` with your actual Railway URL
- [ ] Should look like: `VITE_API_URL=https://walx-production.up.railway.app/api`
- [ ] Save the file
- [ ] Commit changes:
  ```bash
  cd "/home/mubashir123/FYP FOLDER/Blockchain Project"
  git add frontend/.env.production
  git commit -m "Update production API URL"
  git push origin main
  ```

### Create Account
- [ ] Go to: https://vercel.com/signup
- [ ] Click "Continue with GitHub"
- [ ] Authorize Vercel to access your GitHub

### Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Find "mubashirrao1122/Walx" in the list
- [ ] Click "Import"

### Configure Build Settings
- [ ] Framework Preset: "Vite" (should auto-detect)
- [ ] Root Directory: Click "Edit" → Type `frontend` → Save
- [ ] Build Command: `npm run build` (should be auto-filled)
- [ ] Output Directory: `dist` (should be auto-filled)
- [ ] Install Command: `npm install` (should be auto-filled)

### Add Environment Variable
- [ ] Scroll down to "Environment Variables"
- [ ] Click "Add"
- [ ] Key: `VITE_API_URL`
- [ ] Value: `https://YOUR-RAILWAY-URL.railway.app/api`
- [ ] Click checkmark to add

### Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes ⏳
- [ ] Watch the build logs

### Get Frontend URL
- [ ] Once deployed, you'll see "Congratulations!" 🎉
- [ ] Copy your Vercel URL (e.g., `walx-xyz.vercel.app`)
- [ ] Write your frontend URL here: ________________

✅ Frontend is deployed!

---

## STEP 4: Test Your Application 🧪

### Test User Registration
- [ ] Open your Vercel URL in browser
- [ ] Should redirect to Login page
- [ ] Click "Register" link
- [ ] Fill in:
  - Full Name: Your name
  - Email: Your email
  - Password: Your password
- [ ] Click "Register"
- [ ] **IMPORTANT**: Save the Wallet ID and Private Key shown! ✏️
- [ ] Click "Continue"

### Test Login
- [ ] Enter your Wallet ID
- [ ] Enter your Private Key
- [ ] Click "Login"
- [ ] Check your email for OTP code
- [ ] Enter OTP code
- [ ] Click "Verify"
- [ ] You should see the Dashboard! 🎉

### Test Dashboard
- [ ] Check if balance shows (should be 0 initially)
- [ ] Look at the sidebar menu

### Test Send Money (Optional)
- [ ] Create a second user account (repeat registration)
- [ ] Login with first account
- [ ] Go to "Send Money"
- [ ] Send some coins to second account's wallet ID
- [ ] Check transaction history

### Test Blockchain Explorer
- [ ] Click "Explorer" in sidebar
- [ ] You should see blocks with your transactions
- [ ] Success! Your blockchain is working! ✅

---

## 🎉 DEPLOYMENT COMPLETE!

### Your Live URLs:

**Frontend (Vercel)**: ___________________________

**Backend (Railway)**: ___________________________

**Database (MongoDB)**: Connected ✅

---

## 📱 Share Your Project

Update your GitHub README with live demo links:

```markdown
## 🌐 Live Demo

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.railway.app/api
```

---

## 🐛 Troubleshooting

### Issue: Backend not responding
**Solution**: 
- Check Railway logs for errors
- Verify MongoDB connection string is correct
- Make sure all environment variables are set

### Issue: Frontend can't connect to backend
**Solution**:
- Verify `VITE_API_URL` in Vercel is correct
- Check if backend URL is accessible in browser
- Look at browser console for errors (F12)

### Issue: MongoDB connection failed
**Solution**:
- Verify password in connection string
- Check Network Access allows 0.0.0.0/0
- Make sure database user exists

---

## 📊 Monitoring Your App

### Check Backend Logs (Railway):
- Railway Dashboard → Your Project → Click on Service → "Logs" tab

### Check Frontend Analytics (Vercel):
- Vercel Dashboard → Your Project → "Analytics" tab

### Check Database (MongoDB):
- MongoDB Atlas → Clusters → Collections
- You should see: users, transactions, logs, beneficiaries

---

## 💰 Cost Tracking

All services are FREE:
- ✅ MongoDB Atlas: 512 MB free
- ✅ Railway: $5 credit/month
- ✅ Vercel: Unlimited hobby projects

---

## 🎓 Next Steps After Deployment

- [ ] Add your live URLs to GitHub README
- [ ] Test all features thoroughly
- [ ] Share with friends/classmates
- [ ] Prepare project presentation
- [ ] Document any issues found
- [ ] Consider adding more features

---

**Total Time**: ~20-25 minutes

**Difficulty**: ⭐⭐☆☆☆ (Easy if you follow steps)

**Status**: Ready to deploy! Start with Step 1!

---

## 📞 Need Help?

If you get stuck:
1. Check the error messages carefully
2. Look at the DEPLOYMENT.md for detailed explanations
3. Google the specific error message
4. Check Railway/Vercel documentation

**You've got this! 🚀**
