# 🦟 Mosquito Alert+ - Full-Stack MERN Application

A complete, production-ready mosquito breeding site reporting system with AI validation, built with the MERN stack.

## 🚀 Features

### User Features
- ✅ User signup & login with JWT authentication
- ✅ Facebook-style image feed for mosquito reports
- ✅ Drag-and-drop image upload with instant preview
- ✅ Mandatory image, location, breeding type, and severity fields
- ✅ Real-time AI validation with rule-based scoring
- ✅ Personal dashboard with reports and points tracking
- ✅ Risk alerts for high-risk areas
- ✅ Points system for gamification

### Admin Features
- ✅ Separate admin dashboard (no public signup)
- ✅ Pre-seeded admin accounts
- ✅ View all reports in feed layout
- ✅ Analytics charts (Recharts):
  - Weekly reports bar chart
  - Breeding type distribution pie chart
  - Area-wise risk assessment table
- ✅ Leaderboard showing top contributors
- ✅ Update report status

### AI Validation System
- ✅ **Duplicate Detection**: Same location + type + last 7 days
- ✅ **Rule-Based Scoring**:
  - High severity → +3 points
  - Standing water → +3 points
  - Image uploaded → +2 points
  - Rainy season (June-Sept) → +2 points
  - Multiple reports in area → +2 points
- ✅ **AI Verdict**:
  - Score ≥6 → VALID
  - Score 3-5 → NEEDS REVIEW
  - Score <3 → INVALID

## 🛠️ Tech Stack

### Frontend
- React 18 with Hooks
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Recharts for data visualization
- React Icons

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Multer for image upload
- express-validator

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
cd "d:\Mosha Alert"
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mosquito-alert
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄️ Database Setup

### Seed Admin Accounts
```bash
cd server
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@mosquitoalert.com`
- Password: `admin123456`

⚠️ **IMPORTANT**: Change these credentials in production!

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

### Start Frontend
```bash
cd client
npm start
```
Frontend runs on: http://localhost:3000

## 📁 Project Structure

```
Mosha Alert/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # API configuration
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ReportCard.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Signup.js
│   │   │   ├── Login.js
│   │   │   ├── UserDashboard.js
│   │   │   ├── CreateReport.js
│   │   │   └── AdminDashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT middleware
│   │   └── upload.js         # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   └── adminRoutes.js
│   ├── seeders/
│   │   └── adminSeeder.js
│   ├── uploads/              # Uploaded images
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User/Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Reports
- `POST /api/reports` - Create report (with image)
- `GET /api/reports` - Get all reports
- `GET /api/reports/my-reports` - Get user's reports
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id/status` - Update status (Admin)

### Admin Analytics
- `GET /api/admin/analytics/overview` - Overview stats
- `GET /api/admin/analytics/weekly-reports` - Weekly chart
- `GET /api/admin/analytics/breeding-distribution` - Pie chart
- `GET /api/admin/analytics/area-risk` - Risk assessment
- `GET /api/admin/leaderboard` - Top users
- `GET /api/admin/users` - All users

## 🔐 Authentication Flow

### Users
1. Users can **signup** via UI
2. Login with email & password
3. JWT token stored in localStorage
4. Access user dashboard and create reports

### Admins
1. Admins **cannot signup** via UI
2. Admins are **pre-seeded** in database
3. Login with admin credentials
4. Access admin dashboard with full analytics

## 📊 User Points System

- **VALID** report → 10 points
- **NEEDS REVIEW** report → 5 points
- **INVALID** report → 0 points

## 🖼️ Image Upload Requirements

- **Formats**: JPG, JPEG, PNG only
- **Max Size**: 5MB
- **Mandatory**: Report rejected without image
- **Storage**: Local filesystem (`server/uploads/`)

## 🎨 UI/UX Highlights

- ✅ Facebook-style image feed
- ✅ Drag-and-drop image upload
- ✅ Instant image preview
- ✅ Color-coded severity badges
- ✅ AI verdict badges with icons
- ✅ Responsive Tailwind CSS design
- ✅ Smooth animations and transitions

## 🚦 Development Tips

### Reset Database
```bash
# Drop collections and reseed
cd server
npm run seed
```

### Check API Health
```bash
curl http://localhost:5000
```

### View Uploaded Images
Images are accessible at:
```
http://localhost:5000/uploads/[filename]
```

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For Atlas, whitelist your IP

### Image Upload Not Working
- Check `uploads/` folder exists
- Verify file size < 5MB
- Check file format (JPG/PNG only)

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mosquito-alert
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏆 Hackathon Ready

This project is fully functional and ready for:
- ✅ Live demos
- ✅ Presentation
- ✅ Deployment
- ✅ Code reviews
- ✅ Feature extensions

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Update MONGO_URI to production database
3. Change JWT_SECRET
4. Update CORS origins

### Frontend (Vercel/Netlify)
1. Update `REACT_APP_API_URL` to production API
2. Build: `npm run build`
3. Deploy `build/` folder

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for hackathons and learning purposes.

## 🙏 Acknowledgments

- MERN Stack
- Tailwind CSS
- Recharts
- React Icons

---

**Happy Coding! 🦟🚀**
