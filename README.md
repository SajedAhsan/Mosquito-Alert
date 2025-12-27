# 🦟 Mosquito Alert+

**Empowering communities to combat dengue by reporting mosquito breeding sites with AI-powered validation and real-time risk mapping.**

🔗 **Live Demo:** https://mosquito-alert.vercel.app/login

---

## 🚨 Problem

Dengue fever kills thousands annually, and 70% of mosquito breeding happens in urban areas that go unreported. Traditional tracking systems are slow, unreliable, and lack community engagement. We need a faster, smarter way to identify and eliminate breeding sites before outbreaks occur.

## ✅ Solution

Mosquito Alert+ turns citizens into frontline defenders with AI-validated photo reporting, duplicate detection, and intelligent risk prediction. Users earn points for verified reports, creating a gamified system that drives mass participation while authorities get real-time, accurate data to act on.

## 🏆 Why It Wins

- **Real Impact:** Prevents disease outbreaks by accelerating breeding site elimination
- **Community-Driven:** Gamification turns reporting into a rewarding social movement
- **Scalable & Actionable:** AI validation ensures authorities receive quality data, not noise

## ✨ Key Features

- Instant photo-based reporting with drag-and-drop simplicity
- AI validation filters fake/duplicate submissions automatically
- Leaderboard rewards system driving user engagement
- Admin dashboard with risk heatmaps and predictive analytics
- Area-wise outbreak alerts for targeted intervention

## 🤖 AI / Smart Logic

- **Image Validation:** Detects mosquito breeding environments using AI pattern recognition
- **Duplicate Prevention:** Intelligent geolocation + image matching prevents spam and ensures data integrity

## 🛠️ Tech Stack

React + Tailwind | Node.js + Express | MongoDB + JWT | AI Validation Engine

## 👥 Team

- **Sajed Ahsan** — Backend, Frontend & AI
- **Abid Hossain** — Backend & Frontend
- **Abdullah Al Siyam** — Researcher

---

**Built to save lives. Ready to scale.**
| **MongoDB** | NoSQL database | 5.x |
| **Mongoose** | MongoDB ODM | 7.x |
| **JWT** | Token-based authentication | 9.x |
| **bcrypt** | Password encryption | 5.x |
| **Multer** | File upload middleware | 1.x |
| **express-validator** | Input validation | 7.x |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control system

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
cd "d:\Mosha Alert"
```

### Step 2: Backend Configuration

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/mosquito-alert

# Security
JWT_SECRET=your_super_secret_jwt_key_change_in_production_123456

# File Upload
MAX_FILE_SIZE=5242880
```

### Step 3: Frontend Configuration

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Database Setup

**Option A: Local MongoDB**
```bash
# Ensure MongoDB service is running
# Windows: mongod --dbpath="C:\data\db"
# Linux/Mac: sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGO_URI` in `server/.env`

### Step 5: Seed Admin Accounts

```bash
cd server
npm run seed
```

**Default Admin Credentials:**
```
Email: admin@mosquitoalert.com
Password: admin123456
```

⚠️ **CRITICAL**: Change these credentials immediately in production environments!

---

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
✅ Server running at: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
✅ Application running at: `http://localhost:3000`

### Production Build

```bash
# Build frontend
cd client
npm run build

# Serve with backend
cd ../server
npm start
```

---

## 📁 Project Architecture

```
Mosha Alert/
│
├── 📂 client/                           # React Frontend Application
│   ├── 📂 public/
│   │   └── index.html                   # HTML template
│   │
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   │   └── axios.js                 # Axios configuration with interceptors
│   │   │
│   │   ├── 📂 components/
│   │   │   ├── Navbar.js                # Navigation component
│   │   │   ├── ReportCard.js            # Report display card (Facebook-style)
│   │   │   ├── ReportFeedCard.js        # Feed layout card
│   │   │   ├── SkeletonCard.js          # Loading placeholder
│   │   │   ├── LocationPicker.js        # Interactive location selector
│   │   │   └── PrivateRoute.js          # Authentication guard
│   │   │
│   │   ├── 📂 context/
│   │   │   └── AuthContext.js           # Global authentication state
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Signup.js                # User registration page
│   │   │   ├── Login.js                 # Authentication page
│   │   │   ├── UserDashboard.js         # User home with feed
│   │   │   ├── CreateReport.js          # Report submission form
│   │   │   ├── MyReports.js             # Personal reports management
│   │   │   ├── Leaderboard.js           # Community rankings
│   │   │   └── AdminDashboard.js        # Admin analytics panel
│   │   │
│   │   ├── App.js                       # Main application component
│   │   ├── index.js                     # React entry point
│   │   └── index.css                    # Global styles
│   │
│   ├── .env                             # Environment variables
│   ├── package.json                     # Dependencies
│   ├── tailwind.config.js               # Tailwind configuration
│   └── postcss.config.js                # PostCSS configuration
│
├── 📂 server/                           # Express Backend Application
│   ├── 📂 config/
│   │   └── db.js                        # MongoDB connection
│   │
│   ├── 📂 controllers/
│   │   ├── authController.js            # Authentication logic
│   │   ├── reportController.js          # Report CRUD operations
│   │   ├── aiController.js              # AI validation engine
│   │   └── adminController.js           # Admin analytics
│   │
│   ├── 📂 middleware/
│   │   ├── auth.js                      # JWT verification
│   │   └── upload.js                    # Multer file upload
│   │
│   ├── 📂 models/
│   │   ├── User.js                      # User schema
│   │   ├── Admin.js                     # Admin schema
│   │   └── Report.js                    # Report schema
│   │
│   ├── 📂 routes/
│   │   ├── authRoutes.js                # Authentication endpoints
│   │   ├── reportRoutes.js              # Report endpoints
│   │   ├── aiRoutes.js                  # AI validation endpoints
│   │   └── adminRoutes.js               # Admin endpoints
│   │
│   ├── 📂 seeders/
│   │   └── adminSeeder.js               # Admin account seeder
│   │
│   ├── 📂 uploads/                      # Image storage directory
│   │
│   ├── server.js                        # Express server entry
│   ├── .env                             # Environment variables
│   └── package.json                     # Dependencies
│
└── 📄 Documentation Files
    ├── README.md                        # Main documentation
    ├── SETUP_GUIDE.md                   # Detailed setup instructions
    ├── QUICKSTART.md                    # Quick start guide
    └── PROJECT_SUMMARY.md               # Project overview
```

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | User/Admin login | Public |
| GET | `/api/auth/me` | Get current user info | Required |
| PUT | `/api/auth/change-password` | Update password | Required |

**Example Request - Signup:**
```json
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890"
}
```

### Report Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/reports` | Create new report | Required |
| GET | `/api/reports` | Get all reports (feed) | Required |
| GET | `/api/reports/my-reports` | Get user's reports | Required |
| GET | `/api/reports/:id` | Get specific report | Required |
| PUT | `/api/reports/:id/status` | Update report status | Admin Only |

**Example Request - Create Report:**
```javascript
POST /api/reports
Content-Type: multipart/form-data

{
  image: File,
  location: "123 Main St, City",
  latitude: 40.7128,
  longitude: -74.0060,
  breedingType: "Standing Water",
  severity: "High",
  description: "Large puddle in parking lot"
}
```

### Admin Analytics Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/admin/analytics/overview` | Dashboard statistics | Admin Only |
| GET | `/api/admin/analytics/weekly-reports` | Weekly trend data | Admin Only |
| GET | `/api/admin/analytics/breeding-distribution` | Breeding type chart data | Admin Only |
| GET | `/api/admin/analytics/area-risk` | Risk assessment by area | Admin Only |
| GET | `/api/admin/leaderboard` | Top contributors | Admin Only |
| GET | `/api/admin/users` | All registered users | Admin Only |

---

## 🎯 User Workflows

### New User Journey

1. **Registration**: User signs up with email, username, and password
2. **Email Verification**: JWT token issued upon successful registration
3. **Dashboard Access**: Redirected to user dashboard with report feed
4. **Create Report**: Navigate to "Create Report" to submit mosquito sightings
5. **Upload Evidence**: Drag-drop image and fill required fields
6. **AI Validation**: System automatically validates submission
7. **Earn Points**: Receive points based on report validity
8. **Track Progress**: View personal statistics and climb leaderboard

### Admin Workflow

1. **Secure Login**: Login with pre-seeded admin credentials
2. **Dashboard Overview**: View real-time statistics and charts
3. **Report Review**: Monitor all community submissions in feed
4. **Status Management**: Approve or reject flagged reports
5. **Analytics Review**: Analyze trends, hotspots, and user activity
6. **Risk Assessment**: Identify high-risk areas for intervention

---

## 🎨 UI/UX Design Principles

### Design Philosophy
- **Clean & Modern**: Minimalist interface with Tailwind CSS
- **Responsive**: Mobile-first design approach
- **Intuitive**: Self-explanatory navigation and interactions
- **Engaging**: Visual feedback and smooth animations

### Key UI Components

**Report Cards**
- Facebook-style layout with user info header
- Full-size image preview
- Color-coded severity badges (Red: High, Orange: Medium, Green: Low)
- AI verdict indicators with icons
- Status badges (Pending, Approved, Rejected)

**Dashboard Features**
- Skeleton loading states for better UX
- Interactive charts (Recharts)
- Real-time statistics counters
- Sortable data tables
- Responsive grid layouts

**Form Design**
- Drag-and-drop file upload with visual feedback
- Instant image preview
- Interactive location picker
- Real-time validation messages
- Clear error states

---

## 🔐 Security & Best Practices

### Authentication
- JWT tokens with 30-day expiration
- Passwords hashed using bcrypt (10 salt rounds)
- HTTP-only cookie option available
- Protected routes with middleware

### Data Validation
- Input sanitization using express-validator
- File type validation (JPG, JPEG, PNG only)
- File size limits (5MB maximum)
- XSS protection
- SQL injection prevention (NoSQL)

### Admin Security
- No public admin registration endpoint
- Pre-seeded accounts only
- Role-based access control (RBAC)
- Admin-only middleware protection

---

## �️ Development Guide

### NPM Scripts

**Backend (server/)**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed admin accounts
```

**Frontend (client/)**
```bash
npm start            # Start development server (port 3000)
npm run build        # Create production build
npm test             # Run test suite
```

### Database Management

**Reset Database:**
```bash
cd server
npm run seed  # This will clear and reseed admin accounts
```

**MongoDB Commands:**
```bash
# Start MongoDB (Windows)
mongod --dbpath="C:\data\db"

# Connect to MongoDB shell
mongosh

# View all databases
show dbs

# Use project database
use mosquito-alert

# View collections
show collections

# Query reports
db.reports.find().pretty()
```

### File Upload Configuration

**Image Storage:**
- Location: `server/uploads/`
- Access URL: `http://localhost:5000/uploads/[filename]`
- Supported formats: JPG, JPEG, PNG
- Maximum size: 5MB

**Multer Configuration:**
```javascript
// server/middleware/upload.js
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})
```

---

## ⚙️ Configuration

### Environment Variables

**Server Configuration (server/.env)**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mosquito-alert
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mosquito-alert

# Security
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

**Client Configuration (client/.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### CORS Configuration

Update `server/server.js` for production:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**Problem: Port Already in Use**
```bash
# Windows PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Or use npx
npx kill-port 5000
npx kill-port 3000
```

**Problem: MongoDB Connection Failed**
```
Error: MongoServerError: Authentication failed
```
Solution:
- Verify MongoDB is running: `mongosh`
- Check `MONGO_URI` in `.env`
- For Atlas: Whitelist your IP address
- Ensure correct username/password

**Problem: JWT Token Invalid**
```
Error: JsonWebTokenError: invalid signature
```
Solution:
- Clear browser localStorage
- Ensure `JWT_SECRET` matches on server
- Check token expiration settings

**Problem: Image Upload Not Working**
```
Error: ENOENT: no such file or directory
```
Solution:
- Create `uploads/` folder in server directory:
  ```bash
  cd server
  mkdir uploads
  ```
- Check file permissions
- Verify file size < 5MB
- Ensure correct MIME type (image/jpeg, image/png)

**Problem: CORS Error**
```
Access to fetch blocked by CORS policy
```
Solution:
- Verify `REACT_APP_API_URL` in client/.env
- Check CORS configuration in server.js
- Ensure credentials: true if using cookies

### Debug Mode

Enable detailed logging:
```javascript
// server/server.js
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

---

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

**Pre-deployment Checklist:**
- [ ] Update `MONGO_URI` to production database
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure allowed CORS origins
- [ ] Set up environment variables on hosting platform
- [ ] Change default admin credentials

**Example Railway Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up
```

### Frontend Deployment (Vercel/Netlify)

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from client directory
cd client
vercel
```

**Environment Variables:**
- `REACT_APP_API_URL`: Your production API URL

**Netlify:**
```bash
# Build first
npm run build

# Deploy build folder
netlify deploy --prod --dir=build
```

### Database Deployment (MongoDB Atlas)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGO_URI` in production environment

---

## 📊 Performance Optimization

### Frontend Optimization
- Lazy loading for routes
- Image compression before upload
- React.memo for expensive components
- Debouncing search inputs
- Virtual scrolling for large lists

### Backend Optimization
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching with Redis (optional)
- Compress responses with gzip
- Rate limiting for API endpoints

---

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User signup with validation
- [ ] User login with JWT
- [ ] Admin login
- [ ] Protected route access
- [ ] Token expiration handling

**Report Creation:**
- [ ] Image upload (drag-drop)
- [ ] Location picker
- [ ] Form validation
- [ ] AI validation response
- [ ] Points calculation

**Admin Dashboard:**
- [ ] Analytics charts render
- [ ] Report status updates
- [ ] User management
- [ ] Leaderboard accuracy

---

## 📚 Additional Resources

### Documentation Files
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Comprehensive setup instructions
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete feature list
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture details
- [AI_VALIDATION_SETUP.md](AI_VALIDATION_SETUP.md) - AI system documentation

### Useful Links
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/)

---

## 🏆 Use Cases

This application is ideal for:
- **Hackathons**: Fully functional MVP ready for presentation
- **Public Health Agencies**: Community-driven mosquito monitoring
- **Educational Projects**: Full-stack MERN learning resource
- **Smart City Initiatives**: Citizen engagement platform
- **Research Projects**: Data collection for disease prevention studies

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Support

**Developed with ❤️ for community health initiatives**

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your Email/Website]

---

## 🙏 Acknowledgments

### Technologies
- MERN Stack (MongoDB, Express.js, React, Node.js)
- Tailwind CSS for beautiful UI
- Recharts for data visualization
- React Icons for UI elements
- JWT for secure authentication

### Inspiration
Built to combat mosquito-borne diseases through community engagement and technology.

---

<div align="center">

**⭐ Star this repository if you find it useful!**

**🦟 Together, we can fight mosquito-borne diseases 🦟**

Made with 💙 by the Mosquito Alert+ Team

</div>
