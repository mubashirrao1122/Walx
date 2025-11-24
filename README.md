# Walx - Islamic Blockchain Wallet

A full-stack blockchain-based cryptocurrency wallet with Islamic finance integration (Zakat calculation).

## 🏗️ Architecture

### Backend (Rust)
- **Framework**: Actix-web
- **Database**: MongoDB
- **Custom Blockchain Implementation**
  - Wallet management with public/private key cryptography
  - Transaction processing with UTXO model
  - Proof of Work mining
  - Chain validation

### Frontend (React + TypeScript)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Local Storage + React Hooks
- **Routing**: React Router v7

## ✨ Features

- ✅ User Registration & Authentication with OTP
- ✅ Wallet Creation & Management
- ✅ Send/Receive Cryptocurrency
- ✅ Transaction History
- ✅ Blockchain Explorer
- ✅ **Automatic Zakat Calculation** (2.5% monthly deduction)
- ✅ Admin Dashboard with System Statistics
- ✅ System Logs & Reports
- ✅ Beneficiary Management

## 🚀 Deployment

### Frontend (Vercel)

1. **Prerequisites**:
   - Vercel account
   - Backend deployed and accessible

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Environment Variables** (Set in Vercel Dashboard):
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render/Fly.io)

1. **Prerequisites**:
   - MongoDB Atlas account (free tier available)
   - Railway/Render/Fly.io account

2. **Environment Variables**:
   ```
   PORT=8080
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/walx
   ```

3. **Deploy**:
   
   **Railway**:
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login and deploy
   railway login
   cd backend
   railway up
   ```

   **Render**:
   - Connect GitHub repository
   - Select `backend` as root directory
   - Build command: `cargo build --release`
   - Start command: `./target/release/server`

## 🔧 Local Development

### Backend
```bash
cd backend

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run the server
cargo run --bin server
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

## 📁 Project Structure

```
.
├── backend/
│   ├── blockchain/          # Custom blockchain implementation
│   │   ├── src/
│   │   │   ├── block.rs
│   │   │   ├── chain.rs
│   │   │   ├── transaction.rs
│   │   │   └── wallet.rs
│   ├── server/              # API server
│   │   ├── src/
│   │   │   ├── api/         # API endpoints
│   │   │   ├── db.rs        # MongoDB connection
│   │   │   ├── models.rs    # Data models
│   │   │   ├── zakat.rs     # Zakat calculation scheduler
│   │   │   └── main.rs
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│
└── vercel.json              # Vercel configuration
```

## 🔐 Security Features

- SHA-256 hashing for private keys
- Secure wallet generation
- OTP-based authentication
- Transaction signing and verification
- Blockchain validation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with wallet credentials
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/generate` - Generate new wallet

### Wallet
- `GET /api/wallet/{id}/balance` - Get wallet balance
- `GET /api/wallet/{id}/history` - Get transaction history
- `POST /api/wallet/send` - Send transaction

### Blockchain
- `GET /api/blockchain/blocks` - Get all blocks
- `POST /api/blockchain/mine` - Mine new block

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - List all users

### User
- `GET /api/user/{id}/profile` - Get user profile
- `POST /api/user/beneficiary` - Add beneficiary
- `GET /api/user/{id}/beneficiaries` - Get beneficiaries

### Logs
- `GET /api/logs` - Get system logs

## 🕌 Islamic Finance Integration

The application includes automatic **Zakat calculation**:
- Runs monthly (configurable)
- Deducts 2.5% from wallet balances
- Transferred to system wallet for charity distribution
- Logged for transparency

## 🛠️ Tech Stack

**Backend**:
- Rust
- Actix-web
- MongoDB
- SHA-256 Cryptography

**Frontend**:
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- React Router v7

## 📝 License

MIT License

## 👨‍💻 Author

Mubashir Rao

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This is an educational project demonstrating blockchain concepts. Not intended for production use with real cryptocurrency.
