# 🎨 Vercel Frontend Deployment Guide

## ⚠️ IMPORTANT: Configure Root Directory FIRST

The error you're seeing happens because Vercel can't find the `frontend` directory. Here's how to fix it:

---

## 🔧 **Solution: Set Root Directory in Vercel**

### **Method 1: Via Vercel Dashboard (Easiest)**

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. Click on your **Walx** project
3. Go to **Settings** (top menu)
4. Click **General** (left sidebar)
5. Scroll to **Root Directory** section
6. Click **Edit**
7. Enter: `frontend`
8. Click **Save**
9. Go back to **Deployments** tab
10. Click **Redeploy** on the latest deployment

---

## 📋 **Complete Vercel Setup Steps**

### **Step 1: Import from GitHub**

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Find your **Walx** repository
4. Click **"Import"**

### **Step 2: Configure Build Settings**

**IMPORTANT: Set these exactly as shown:**

```
Framework Preset: Vite
Root Directory: frontend    ← CRITICAL!
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **Step 3: Add Environment Variables**

Click on **"Environment Variables"** and add:

```
Name: VITE_API_URL
Value: https://your-railway-backend-url.railway.app/api
```

**⚠️ IMPORTANT:** 
- Replace `your-railway-backend-url` with your actual Railway backend URL
- Make sure to include `/api` at the end
- Example: `https://walx-production.up.railway.app/api`

### **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once done, you'll get your Vercel URL

---

## 🔍 **Troubleshooting Common Errors**

### **Error: `cd: frontend: No such file or directory`**

**Cause:** Root Directory not set correctly

**Solution:**
1. Go to Settings → General → Root Directory
2. Set to: `frontend`
3. Save and redeploy

---

### **Error: `ENOENT: no such file or directory, open 'package.json'`**

**Cause:** Root Directory still not set

**Solution:**
1. Delete the project from Vercel
2. Re-import from GitHub
3. Make sure to set Root Directory to `frontend` BEFORE first deploy

---

### **Error: `Failed to compile`**

**Cause:** Missing environment variable or wrong API URL

**Solution:**
1. Check Settings → Environment Variables
2. Make sure `VITE_API_URL` is set
3. Verify the backend URL is correct and includes `/api`

---

### **Build succeeds but app doesn't work**

**Cause:** Backend URL not configured or backend not running

**Solution:**
1. Verify backend is deployed on Railway
2. Test backend URL: `https://your-backend.railway.app/api/blockchain/blocks`
3. Update `VITE_API_URL` in Vercel if backend URL changed
4. Redeploy frontend

---

## 📁 **Project Structure for Vercel**

Your repository structure:
```
Walx/
├── backend/          ← Railway deploys this
│   ├── Cargo.toml
│   └── ...
├── frontend/         ← Vercel deploys this (set as Root Directory!)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
└── vercel.json       ← Configuration file
```

---

## ✅ **Verification Checklist**

Before deploying, verify:

- [ ] Root Directory is set to `frontend`
- [ ] Backend is deployed and working on Railway
- [ ] You have the backend URL
- [ ] `VITE_API_URL` environment variable is set in Vercel
- [ ] `VITE_API_URL` includes `/api` at the end

---

## 🎯 **Expected Build Output**

When configured correctly, you should see:

```
✓ Building for production...
✓ 1234 modules transformed.
✓ built in 12.34s
dist/index.html                  0.45 kB
dist/assets/index-abc123.css    12.34 kB
dist/assets/index-xyz789.js     123.45 kB
Build Completed in 15s
```

---

## 🌐 **After Successful Deployment**

### **Get Your URLs:**

1. **Frontend URL**: Copy from Vercel dashboard
   - Example: `https://walx-xyz.vercel.app`

2. **Backend URL**: Copy from Railway dashboard
   - Example: `https://walx-production.up.railway.app`

### **Test Your App:**

1. Open your Vercel URL
2. Try to register a new user
3. Login with credentials
4. Test sending a transaction

---

## 🔄 **Updating Frontend After Changes**

Whenever you make changes to the frontend:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. Vercel auto-deploys on push (if enabled)
3. Or manually click **"Redeploy"** in Vercel dashboard

---

## 📊 **Environment Variables Explained**

### **VITE_API_URL**

This tells your frontend where the backend API is located.

**Format:**
```
VITE_API_URL=https://your-backend.railway.app/api
```

**Why `/api` at the end?**
- Your backend routes are: `/api/auth/login`, `/api/wallet/balance`, etc.
- The frontend code does: `axios.get('/auth/login')`
- Vite combines them: `VITE_API_URL + '/auth/login'`
- Result: `https://backend.railway.app/api/auth/login` ✅

---

## 🚨 **Common Mistakes to Avoid**

1. ❌ **Not setting Root Directory**
   - Result: `cd: frontend: No such file or directory`
   - Fix: Set Root Directory to `frontend`

2. ❌ **Wrong backend URL**
   - Result: API calls fail with 404
   - Fix: Use the URL from Railway, include `/api`

3. ❌ **Deploying before backend is ready**
   - Result: Frontend works but can't connect
   - Fix: Deploy backend first, then frontend

4. ❌ **Missing environment variable**
   - Result: Frontend makes requests to wrong URL
   - Fix: Add `VITE_API_URL` in Vercel settings

---

## 📞 **Need Help?**

### **Check Vercel Logs:**
1. Vercel Dashboard → Your Project
2. Click on the deployment
3. Click **"Building"** to see build logs
4. Click **"Functions"** to see runtime logs

### **Check Browser Console:**
1. Open your Vercel app
2. Press F12 (Developer Tools)
3. Go to **Console** tab
4. Look for API error messages

---

## 🎉 **Success Indicators**

You'll know it's working when:

1. ✅ Build completes without errors
2. ✅ App loads in browser
3. ✅ Can see login/register page
4. ✅ Can register new user
5. ✅ Can login successfully
6. ✅ Can see dashboard with balance

---

## 📝 **Quick Reference**

```bash
# Vercel Settings:
Root Directory: frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist

# Environment Variables:
VITE_API_URL=https://your-backend.railway.app/api

# Frontend URL (after deploy):
https://walx-xyz.vercel.app

# Backend URL (from Railway):
https://walx-production.up.railway.app
```

---

**Next Step:** Go to Vercel → Settings → General → Root Directory → Set to `frontend` → Redeploy! 🚀
