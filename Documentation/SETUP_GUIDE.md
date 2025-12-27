# 🚀 QUICK START - Mosquito Alert+

## Prerequisites
- Node.js (v18+) - https://nodejs.org/
- MongoDB (Local or Atlas) - https://www.mongodb.com/

## Installation

```powershell
# Install dependencies
cd server && npm install
cd ../client && npm install

# Seed admin account
cd ../server && npm run seed
```

## Run Application

```powershell
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start
```

✅ **App:** http://localhost:3000  
✅ **API:** http://localhost:5000

## Admin Login
- **Email:** admin@mosquitoalert.com
- **Password:** admin123456

## Environment Setup

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mosquito-alert
JWT_SECRET=your_secret_key
```

**client/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting
- **npm not found:** Install Node.js
- **MongoDB error:** Check MONGO_URI or start MongoDB service
- **Port in use:** Run `npx kill-port 5000` or `npx kill-port 3000`
