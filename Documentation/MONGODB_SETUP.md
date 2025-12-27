# 🗄️ MongoDB Setup Guide

You have **2 options** to set up MongoDB for this project:

---

## ✅ Option 1: MongoDB Atlas (Cloud) - RECOMMENDED

**Easiest and fastest setup - No local installation needed!**

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Click **"Build a Database"**
2. Select **FREE** shared cluster
3. Choose a cloud provider and region (any)
4. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Username: `mosquito_admin`
5. Password: `mosquito123` (or your own)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Confirm

### Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://mosquito_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update .env File
Open `d:\Mosha Alert\server\.env` and update:

```env
PORT=5000
MONGO_URI=mongodb+srv://mosquito_admin:mosquito123@cluster0.xxxxx.mongodb.net/mosquito-alert?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**Replace the entire `MONGO_URI` with your connection string!**

### ✅ You're Done! Now run:
```powershell
cd "d:\Mosha Alert\server"
npm run seed
```

---

## Option 2: Local MongoDB Installation

### Step 1: Verify MongoDB Installation
```powershell
# Check if MongoDB is installed
where.exe mongod
```

### Step 2: Create Data Directory
```powershell
mkdir C:\data\db
```

### Step 3: Start MongoDB Server
**Option A - Using MongoDB Compass (GUI):**
1. Open **MongoDB Compass** (if installed)
2. It will automatically start the MongoDB server
3. Connect to `mongodb://localhost:27017`

**Option B - Command Line:**
```powershell
# Find your MongoDB installation path
Get-ChildItem "C:\Program Files\MongoDB" -Recurse -Filter "mongod.exe"

# Start MongoDB (replace with your actual path)
& "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### Step 4: Keep .env as Default
The default `.env` already has:
```env
MONGO_URI=mongodb://localhost:27017/mosquito-alert
```

### Step 5: Run Seeder
```powershell
cd "d:\Mosha Alert\server"
npm run seed
```

---

## 🔍 Troubleshooting

### "MongoDB connection failed"
- **Atlas**: Check internet connection and IP whitelist
- **Local**: Make sure MongoDB is running

### "Authentication failed"
- **Atlas**: Verify username/password in connection string
- **Local**: No authentication needed for local setup

### "Cannot connect to MongoDB"
- Check if MongoDB service is running
- Verify MONGO_URI in .env file

### Test Connection
```powershell
cd "d:\Mosha Alert\server"
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test').then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Failed:', err.message));"
```

---

## 📝 Which Option Should I Choose?

| Feature | Atlas (Cloud) | Local |
|---------|--------------|-------|
| Setup Time | 5 minutes | 15+ minutes |
| Internet Required | Yes | No |
| Free | Yes (512MB) | Yes (Unlimited) |
| Good for Demo | ✅ Best | ✅ Good |
| Production Ready | ✅ Yes | ⚠️ Needs config |

**Recommendation**: Use **MongoDB Atlas** for fastest setup!

---

## ✅ Next Steps After MongoDB Setup

Once MongoDB is running and seeder succeeds:

1. **Start Backend**:
   ```powershell
   cd "d:\Mosha Alert\server"
   npm run dev
   ```

2. **Start Frontend** (new terminal):
   ```powershell
   cd "d:\Mosha Alert\client"
   npm start
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

4. **Login as Admin**:
   - Email: `admin@mosquitoalert.com`
   - Password: `admin123456`

---

**Need help? Check the main README.md for more details!**
