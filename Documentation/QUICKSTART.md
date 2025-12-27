# 🚀 QUICKSTART - Get Running in 5 Minutes!

## Current Status
✅ Node.js installed
✅ Backend dependencies installed  
✅ Frontend dependencies installed
⏳ **MongoDB needs to be configured**

---

## 🎯 FASTEST SOLUTION: MongoDB Atlas (3 steps)

### Step 1: Create Free MongoDB Atlas Account (2 min)
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (FREE - no credit card needed)
3. Create a FREE cluster (M0)
4. Create database user:
   - Username: `mosquito_admin`
   - Password: `mosquito123`
5. Whitelist IP: Click "Allow Access from Anywhere"
6. Get connection string

### Step 2: Update Your Connection String (1 min)
**Your connection string will look like this:**
```
mongodb+srv://mosquito_admin:mosquito123@cluster0.xxxxx.mongodb.net/mosquito-alert?retryWrites=true&w=majority
```

**Open this file**: `d:\Mosha Alert\server\.env`

**Replace the MONGO_URI line with YOUR connection string**:
```env
PORT=5000
MONGO_URI=mongodb+srv://mosquito_admin:mosquito123@cluster0.xxxxx.mongodb.net/mosquito-alert?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### Step 3: Seed Admin & Start (2 min)
```powershell
# Seed admin accounts
cd "d:\Mosha Alert\server"
npm run seed

# Start backend (keep this terminal open)
npm run dev
```

**Open NEW terminal window:**
```powershell
# Start frontend
cd "d:\Mosha Alert\client"
npm start
```

**Browser will open to**: http://localhost:3000

---

## 🔐 Default Login Credentials

### Admin Login
- Email: `admin@mosquitoalert.com`
- Password: `admin123456`

### User Account
- You can create one via "Sign Up" button

---

## 📋 What If I Don't Want to Use Atlas?

### Alternative: Use MongoDB Compass (Local GUI)
1. Open **MongoDB Compass** application
2. Connect to: `mongodb://localhost:27017`
3. It will auto-start MongoDB server
4. Keep default `.env` file (already set for localhost)
5. Run the seed command above

### Alternative: Start MongoDB Service
```powershell
# Check if MongoDB service exists
Get-Service | Where-Object {$_.DisplayName -like "*MongoDB*"}

# If service exists, start it
Start-Service MongoDB

# Or manually start MongoDB
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

---

## ❓ Quick Troubleshooting

### "Connection failed" error?
➡️ MongoDB not running. Use Atlas (easiest) or start local MongoDB

### "Authentication failed"?
➡️ Check username/password in connection string

### Can't find mongod.exe?
➡️ MongoDB not installed properly. **Use Atlas instead** (faster!)

---

## 📖 Detailed Guides Available

- `MONGODB_SETUP.md` - Complete MongoDB setup guide
- `README.md` - Full project documentation
- `QUICK_REFERENCE.md` - Command reference

---

## ✅ Success Checklist

After everything is running:
- [ ] Backend running at http://localhost:5000
- [ ] Frontend running at http://localhost:3000
- [ ] You see "MongoDB Connected Successfully" in backend terminal
- [ ] Login page loads in browser
- [ ] Can login with admin credentials
- [ ] Can see admin dashboard

---

**🎉 You're almost there! Just need to configure MongoDB!**

**Recommended**: Use MongoDB Atlas - it's the fastest option and requires no local setup.
