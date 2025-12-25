# 📂 PROJECT FILE TREE

```
d:\Mosha Alert\
│
├── 📄 README.md                    ← Full documentation
├── 📄 SETUP_GUIDE.md               ← Step-by-step setup instructions
├── 📄 PROJECT_SUMMARY.md           ← Complete feature list
├── 📄 QUICK_REFERENCE.md           ← Quick commands reference
├── 📄 .gitignore                   ← Git ignore rules
│
├── 📁 .github\
│   └── 📄 copilot-instructions.md  ← Project status & info
│
├── 📁 server\                      ← BACKEND (Express + MongoDB)
│   │
│   ├── 📄 package.json             ← Backend dependencies
│   ├── 📄 .env                     ← Environment variables
│   ├── 📄 .gitignore               ← Backend ignore rules
│   ├── 📄 server.js                ← Main Express server entry point
│   │
│   ├── 📁 config\
│   │   └── 📄 db.js                ← MongoDB connection setup
│   │
│   ├── 📁 models\
│   │   ├── 📄 User.js              ← User schema (for normal users)
│   │   ├── 📄 Admin.js             ← Admin schema (pre-seeded)
│   │   └── 📄 Report.js            ← Report schema
│   │
│   ├── 📁 controllers\
│   │   ├── 📄 authController.js    ← Signup, login, JWT logic
│   │   ├── 📄 reportController.js  ← Report CRUD + AI validation
│   │   └── 📄 adminController.js   ← Analytics, leaderboard, stats
│   │
│   ├── 📁 routes\
│   │   ├── 📄 authRoutes.js        ← Auth endpoints
│   │   ├── 📄 reportRoutes.js      ← Report endpoints
│   │   └── 📄 adminRoutes.js       ← Admin endpoints
│   │
│   ├── 📁 middleware\
│   │   ├── 📄 auth.js              ← JWT protection + admin middleware
│   │   └── 📄 upload.js            ← Multer image upload config
│   │
│   ├── 📁 seeders\
│   │   └── 📄 adminSeeder.js       ← Seed admin accounts script
│   │
│   └── 📁 uploads\                 ← Uploaded images (created at runtime)
│
└── 📁 client\                      ← FRONTEND (React + Tailwind)
    │
    ├── 📄 package.json             ← Frontend dependencies
    ├── 📄 .env                     ← API URL configuration
    ├── 📄 .gitignore               ← Frontend ignore rules
    ├── 📄 tailwind.config.js       ← Tailwind CSS configuration
    ├── 📄 postcss.config.js        ← PostCSS configuration
    │
    ├── 📁 public\
    │   └── 📄 index.html           ← HTML template
    │
    └── 📁 src\
        │
        ├── 📄 index.js             ← React entry point
        ├── 📄 App.js               ← Main app with routing
        ├── 📄 index.css            ← Tailwind imports + custom styles
        │
        ├── 📁 api\
        │   └── 📄 axios.js         ← Axios config with interceptors
        │
        ├── 📁 context\
        │   └── 📄 AuthContext.js   ← Global authentication state
        │
        ├── 📁 components\
        │   ├── 📄 Navbar.js        ← Navigation bar component
        │   ├── 📄 ReportCard.js    ← Facebook-style report card
        │   └── 📄 PrivateRoute.js  ← Route protection wrapper
        │
        └── 📁 pages\
            ├── 📄 Signup.js        ← User registration page
            ├── 📄 Login.js         ← User/Admin login page
            ├── 📄 UserDashboard.js ← User dashboard with feed
            ├── 📄 CreateReport.js  ← Report creation form (drag-drop)
            └── 📄 AdminDashboard.js← Admin analytics dashboard
```

---

## 📊 FILE COUNT BY TYPE

### Backend (Server)
- Configuration: 4 files
- Models: 3 files
- Controllers: 3 files
- Routes: 3 files
- Middleware: 2 files
- Seeders: 1 file
- **Total Backend**: 16 files

### Frontend (Client)
- Configuration: 5 files
- Components: 3 files
- Pages: 5 files
- API: 1 file
- Context: 1 file
- Core: 3 files
- **Total Frontend**: 18 files

### Documentation
- README.md
- SETUP_GUIDE.md
- PROJECT_SUMMARY.md
- QUICK_REFERENCE.md
- FILE_TREE.md
- copilot-instructions.md
- **Total Docs**: 6 files

### **GRAND TOTAL**: 40+ source files + dependencies

---

## 🎯 KEY FILES TO EXPLORE

### Start Here
1. `README.md` - Understand the project
2. `SETUP_GUIDE.md` - Follow setup steps
3. `server/server.js` - See backend structure
4. `client/src/App.js` - See frontend routing

### Backend Deep Dive
1. `server/models/` - Database schemas
2. `server/controllers/reportController.js` - AI validation logic
3. `server/middleware/auth.js` - Security implementation
4. `server/routes/` - API endpoints

### Frontend Deep Dive
1. `client/src/pages/CreateReport.js` - Image upload feature
2. `client/src/pages/AdminDashboard.js` - Charts & analytics
3. `client/src/context/AuthContext.js` - Auth state management
4. `client/src/components/ReportCard.js` - Feed card design

---

## 🔍 FIND FILES BY FEATURE

### Authentication
- `server/controllers/authController.js`
- `server/middleware/auth.js`
- `client/src/context/AuthContext.js`
- `client/src/pages/Signup.js`
- `client/src/pages/Login.js`

### Report System
- `server/models/Report.js`
- `server/controllers/reportController.js`
- `server/middleware/upload.js`
- `client/src/pages/CreateReport.js`
- `client/src/components/ReportCard.js`

### Admin Dashboard
- `server/controllers/adminController.js`
- `server/routes/adminRoutes.js`
- `client/src/pages/AdminDashboard.js`

### AI Validation
- `server/controllers/reportController.js` (lines 20-120)
  - checkDuplicate()
  - calculateAIScore()
  - getAIVerdict()

---

## 📝 NOTES

- All `.env` files are included but should be configured
- `uploads/` folder created automatically by Multer
- `node_modules/` excluded via .gitignore
- All files have extensive inline comments
- Code is production-ready and well-structured

---

**Use this tree to navigate the project easily!** 🗺️
