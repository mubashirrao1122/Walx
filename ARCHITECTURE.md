# Walx System Architecture




ISLAMIC FINANCE INTEGRATION
===========================

Zakat Calculation System:
├─ Runs: Every 30 days (configurable)
├─ Rate: 2.5% of wallet balance
├─ Nisab: Minimum threshold check (optional)
├─ Process:
│   1. Fetch all user wallets
│   2. Calculate balance from blockchain
│   3. Deduct 2.5% if balance > threshold
│   4. Transfer to charity wallet
│   5. Log transaction
│   6. Email notification to users
└─ Transparency: All deductions logged on blockchain
```

## Technology Stack Summary

### Backend
- **Language**: Rust 
- **Web Framework**: Actix-web
- **Database**: MongoDB
- **Cryptography**: SHA-256, RSA key pairs
- **Concurrency**: Tokio async runtime

### Frontend
- **Library**: React 19 
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database Hosting**: MongoDB Atlas
- **Version Control**: Git + GitHub
- **CI/CD**: Automatic deployment on push

### Development Tools
- **Backend**: Cargo (Rust package manager)
- **Frontend**: npm (Node package manager)
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler
- **Environment**: dotenv

## Performance Characteristics

- **Block Mining Time**: ~5-10 seconds (adjustable difficulty)
- **Transaction Throughput**: ~10-50 tx/block
- **API Response Time**: < 100ms (typical)
- **Database Queries**: Indexed for fast lookups
- **Frontend Load Time**: < 2 seconds (optimized build)

## Scalability Considerations

**Current (MVP)**:
- Single backend instance
- In-memory blockchain (resets on restart)
- Suitable for: Demo, testing, small user base

**Future (Production)**:
- Persistent blockchain storage
- Multiple node support
- Load balancing
- Redis caching
- Database replication
- WebSocket for real-time updates
