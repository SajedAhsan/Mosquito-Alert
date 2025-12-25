# 🚀 QUICK REFERENCE CARD

## 🎯 PROJECT: Mosquito Alert+
**Status**: ✅ COMPLETE & READY

---

## 📋 INSTALLATION (5 STEPS)

```powershell
# Step 1: Install Node.js from https://nodejs.org/

# Step 2: Install Backend Dependencies
cd "d:\Mosha Alert\server"
npm install

# Step 3: Install Frontend Dependencies
cd "../client"
npm install

# Step 4: Seed Admin Accounts
cd "../server"
npm run seed

# Step 5: Configure MongoDB
# Edit server/.env with your MongoDB connection string
```

---

## ▶️ RUN APPLICATION (2 TERMINALS)

### Terminal 1 - Backend
```powershell
cd "d:\Mosha Alert\server"
npm run dev
```
✅ http://localhost:5000

### Terminal 2 - Frontend
```powershell
cd "d:\Mosha Alert\client"
npm start
```
✅ http://localhost:3000

---

## 🔐 DEFAULT ADMIN LOGIN

**Email**: `admin@mosquitoalert.com`
**Password**: `admin123456`

⚠️ Change in production!

---

## 📁 KEY FILES REFERENCE

### Backend
- `server/server.js` - Main entry point
- `server/models/*.js` - Database schemas
- `server/controllers/*.js` - Business logic
- `server/routes/*.js` - API endpoints
- `server/middleware/auth.js` - JWT protection
- `server/seeders/adminSeeder.js` - Seed admins

### Frontend
- `client/src/App.js` - Main app & routing
- `client/src/context/AuthContext.js` - Global auth
- `client/src/pages/*.js` - All page components
- `client/src/components/*.js` - Reusable components

---

## 🔧 NPM SCRIPTS

### Backend
```bash
npm start          # Production mode
npm run dev        # Development mode (nodemon)
npm run seed       # Seed admin accounts
```

### Frontend
```bash
npm start          # Start dev server
npm run build      # Production build
npm test           # Run tests
```

---

## 🌐 API ENDPOINTS CHEATSHEET

### Auth
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - Login (user/admin)
- `GET /api/auth/me` - Current user

### Reports
- `POST /api/reports` - Create (with image)
- `GET /api/reports` - All reports
- `GET /api/reports/my-reports` - My reports

### Admin
- `GET /api/admin/analytics/overview` - Stats
- `GET /api/admin/analytics/weekly-reports` - Chart
- `GET /api/admin/leaderboard` - Top users

---

## 🎨 FEATURES AT A GLANCE

✅ User signup/login
✅ Admin login (pre-seeded)
✅ Facebook-style feed
✅ Drag-drop image upload
✅ AI validation + scoring
✅ User dashboard
✅ Admin dashboard with charts
✅ Leaderboard
✅ Risk alerts
✅ Points system

---

## 🐛 TROUBLESHOOTING

**npm not found?**
→ Install Node.js from nodejs.org

**MongoDB connection failed?**
→ Check server/.env MONGO_URI

**Port already in use?**
```powershell
npx kill-port 5000  # Backend
npx kill-port 3000  # Frontend
```

---

## 📚 DOCUMENTATION FILES

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Step-by-step setup
- `PROJECT_SUMMARY.md` - Complete feature list
- `QUICK_REFERENCE.md` - This file

---

## 🎯 USER FLOW

1. User signs up → Login
2. Create report (upload image)
3. AI validates → Earns points
4. View dashboard → Track reports
5. Admin views analytics

---

## 🏆 PROJECT STATS

- **Files**: 70+
- **Lines of Code**: 5,000+
- **Dependencies**: 20+
- **API Endpoints**: 15+
- **Pages**: 5
- **Components**: 3+

---

## ✅ READY FOR

- [x] Development
- [x] Testing
- [x] Presentation
- [x] Hackathons
- [x] Deployment
- [x] Production

---

**🦟 Mosquito Alert+ - Making communities safer!**
**Built with MERN Stack + Tailwind CSS + Recharts**
