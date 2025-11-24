# ⚠️ REQUIRED: Set Environment Variables Before Deployment

## Railway Deployment

Before your deployment will work, you **MUST** set these environment variables in Railway:

### How to Set Environment Variables in Railway:

1. Go to your Railway dashboard: https://railway.app
2. Click on your `Walx` project
3. Click on the service (backend)
4. Click on the **"Variables"** tab
5. Click **"New Variable"**
6. Add the following variables:

### Required Variables:

```bash
# Database Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/walx

# Server Port (REQUIRED)
PORT=8080

# Logging Level (OPTIONAL)
RUST_LOG=info
```

---

## Where to Get MONGODB_URI?

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster (M0 Sandbox)

### Step 2: Create Database User
1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Username: `walxuser` (or your choice)
4. Password: Auto-generate and **SAVE IT**
5. User Privileges: "Read and write to any database"
6. Click "Add User"

### Step 3: Allow Network Access
1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Go back to "Database" (Clusters)
2. Click "Connect" button
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://walxuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. **Replace `<password>` with your actual password**
7. Add `/walx` at the end before the `?`
8. Final format: `mongodb+srv://walxuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/walx?retryWrites=true&w=majority`

---

## Example: Complete Railway Configuration

```
Variable Name: MONGODB_URI
Value: mongodb+srv://walxuser:MySecurePass123@cluster0.abc123.mongodb.net/walx?retryWrites=true&w=majority

Variable Name: PORT
Value: 8080

Variable Name: RUST_LOG
Value: info
```

---

## Render Deployment

If using Render instead of Railway:

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add the same variables as above

---

## Vercel (Frontend Only)

For the frontend deployment on Vercel:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

---

## Testing Locally

To test locally before deploying:

1. Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   nano .env  # or use your favorite editor
   ```

2. Add:
   ```
   PORT=8080
   MONGODB_URI=mongodb+srv://walxuser:password@cluster.mongodb.net/walx
   RUST_LOG=info
   ```

3. Run the server:
   ```bash
   cargo run --bin server
   ```

---

## ✅ Verification

After setting environment variables:

1. **Railway**: Wait for auto-redeploy (or manually trigger)
2. **Check Logs**: You should see:
   ```
   🔗 Connecting to MongoDB...
   ✅ Connected to MongoDB successfully!
   Starting server at http://0.0.0.0:8080
   ```

3. **Test API**: Visit `https://your-url.railway.app/api/blockchain/blocks`

---

## 🚨 Troubleshooting

### Error: "MONGODB_URI must be set"
- **Solution**: Environment variable not configured in Railway/Render
- **Fix**: Follow the steps above to add it

### Error: "Failed to connect to MongoDB"
- **Solution 1**: Check MongoDB password is correct (no special characters that need encoding)
- **Solution 2**: Verify IP whitelist includes 0.0.0.0/0
- **Solution 3**: Check MongoDB cluster is running

### Error: "Authentication failed"
- **Solution**: Wrong username/password in connection string
- **Fix**: Recreate database user or reset password

---

## 📞 Need Help?

1. Check Railway logs: Dashboard → Service → "Logs" tab
2. Check MongoDB Atlas: Dashboard → Metrics
3. Verify all environment variables are set correctly

---

**Status**: Environment variables are **REQUIRED** for deployment to work!
