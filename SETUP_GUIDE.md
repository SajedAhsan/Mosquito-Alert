# 🚀 QUICK START GUIDE - Mosquito Alert+

## ⚠️ PREREQUISITES

You need to install the following before running the application:

### 1. Install Node.js (includes npm)
- Download from: https://nodejs.org/
- Recommended: LTS version (v18 or v20)
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

### 2. Install MongoDB
**Option A: Local Installation**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create free account at: https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `server/.env` with your connection string

## 📦 INSTALLATION STEPS

### Step 1: Open PowerShell in Project Directory
```powershell
cd "d:\Mosha Alert"
```

### Step 2: Install Backend Dependencies
```powershell
cd server
npm install
```

This installs:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- multer
- cors
- dotenv
- express-validator

### Step 3: Install Frontend Dependencies
```powershell
cd ../client
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- recharts
- react-icons
- tailwindcss

### Step 4: Seed Admin Accounts
```powershell
cd ../server
npm run seed
```

**Default Admin Login:**
- Email: `admin@mosquitoalert.com`
- Password: `admin123456`

## 🏃 RUNNING THE APPLICATION

### Terminal 1: Start Backend Server
```powershell
cd "d:\Mosha Alert\server"
npm run dev
```
✅ Server running at: http://localhost:5000

### Terminal 2: Start Frontend (Open NEW PowerShell)
```powershell
cd "d:\Mosha Alert\client"
npm start
```
✅ App running at: http://localhost:3000

## 🎯 FIRST TIME SETUP CHECKLIST

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed/Atlas configured
- [ ] Backend dependencies installed (`server/npm install`)
- [ ] Frontend dependencies installed (`client/npm install`)
- [ ] `.env` files configured
- [ ] Admin accounts seeded
- [ ] Backend server running (port 5000)
- [ ] Frontend app running (port 3000)

## 🔐 TEST THE APPLICATION

### 1. Test User Flow
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create a new user account
4. Login with new credentials
5. Create a mosquito report (with image)
6. View reports in dashboard

### 2. Test Admin Flow
1. Open http://localhost:3000
2. Click "Log In"
3. Use admin credentials:
   - Email: `admin@mosquitoalert.com`
   - Password: `admin123456`
4. View admin dashboard with analytics
5. See all reports feed
6. Check leaderboard

## 📝 ENVIRONMENT CONFIGURATION

### server/.env
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mosquito-alert
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mosquito-alert
```

### client/.env
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 TROUBLESHOOTING

### "npm is not recognized"
- Node.js not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart PowerShell after installation

### "MongoDB connection failed"
- Ensure MongoDB service is running
- Check MONGO_URI in server/.env
- For Atlas: whitelist your IP address

### Port 5000 already in use
```powershell
npx kill-port 5000
```

### Port 3000 already in use
```powershell
npx kill-port 3000
```

## 📂 PROJECT STRUCTURE OVERVIEW

```
Mosha Alert/
├── server/              ← Backend (Express + MongoDB)
│   ├── controllers/     ← Business logic
│   ├── models/          ← Database schemas
│   ├── routes/          ← API endpoints
│   ├── middleware/      ← Auth & upload
│   ├── seeders/         ← Admin seeder
│   └── server.js        ← Main entry
│
├── client/              ← Frontend (React)
│   ├── src/
│   │   ├── components/  ← Reusable components
│   │   ├── pages/       ← Page components
│   │   ├── context/     ← Auth context
│   │   └── api/         ← Axios config
│   └── public/
│
└── README.md            ← Full documentation
```

## 🎉 YOU'RE READY!

Once both servers are running, you have a fully functional:
- ✅ User authentication system
- ✅ Facebook-style report feed
- ✅ AI validation system
- ✅ Admin dashboard with charts
- ✅ Points & gamification
- ✅ Risk alerts

## 📚 NEXT STEPS

1. Read [README.md](README.md) for full documentation
2. Explore API endpoints
3. Customize features
4. Deploy to production

---

**Need Help?** Check README.md for detailed API documentation and features.

**Happy Coding! 🦟🚀**
