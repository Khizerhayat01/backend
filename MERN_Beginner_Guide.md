# MERN Stack Beginner Guide - Key Scenarios & Focus Areas

## 🚀 Development Scenarios

### 1. **Local Development Setup**
```bash
# Initial setup (run once)
npm run setup-project

# Development mode (both frontend + backend)
npm run dev

# Backend only
npm run serve

# Frontend only
npm run client
```

**Focus Points:**
- Always run `npm run setup-project` first to install all dependencies
- Use `npm run dev` for full-stack development
- Check console for both servers starting (port 5173 + your PORT)

### 2. **Port Configuration**
```env
# .env file
NODE_ENV=development
PORT=3000  # or 5000, 8000, etc.
```

**Common Issues:**
- ✅ Frontend proxy must match backend PORT
- ✅ Change PORT in `.env`, restart both servers
- ✅ Default fallback is 3000 if PORT not set

### 3. **Build & Production**
```bash
# Build React app for production
cd "job poster"
npm run build

# Production server (serves built files)
cd ..
node server.js
```

**Focus Points:**
- Build creates `dist/` folder with optimized files
- Express serves from `dist/` in production
- Set `NODE_ENV=production` for production

## 🔧 Key Technical Areas to Focus

### 1. **Environment Variables (.env)**
```env
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUD_NAME=your-cloudinary
CLOUD_API_KEY=your-key
CLOUD_API_SECRET=your-secret
```

**Beginner Tips:**
- Never commit `.env` to Git
- Use different values for dev/prod
- Restart server after `.env` changes

### 2. **Static File Serving**
```javascript
// server.js - Order matters!
app.use(express.static(join(__dirname, 'job poster', 'dist')))  // React app
app.use(express.static(join(__dirname, 'job poster', 'public'))) // Assets
```

**Focus Points:**
- `dist/` for built React files
- `public/` for images, avatars, etc.
- Order: React first, then assets

### 3. **API Routing Structure**
```
/api/v1/auth/*     - Authentication (login/register)
/api/v1/jobs/*     - Job CRUD operations  
/api/v1/user/*     - User profile management
/api/v1/jobs/state - Statistics/charts
```

**Beginner Tips:**
- All API routes start with `/api/v1/`
- Frontend uses `/api/v1` as base URL
- Vite proxy forwards `/api` to backend

### 4. **Database Connection**
```javascript
// MongoDB connection with error handling
try {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅ MongoDB connected");
} catch (error) {
  console.error("❌ MongoDB failed:", error);
  process.exit(1);
}
```

**Focus Points:**
- Use MongoDB Atlas for cloud database
- Connection string in `.env`
- Handle connection errors gracefully

### 5. **Authentication Flow**
```javascript
// Protected routes
app.use('/api/v1/jobs', authenticatedUser, jobRouter)
app.use('/api/v1/user', authenticatedUser, userRouter)

// Frontend sends cookies automatically
const customFetch = axios.create({
    baseURL: '/api/v1',
    withCredentials: true  // Important for cookies!
})
```

**Beginner Tips:**
- JWT tokens stored in httpOnly cookies
- `authenticatedUser` middleware checks tokens
- Frontend includes credentials in requests

## 🚨 Common Issues & Solutions

### Issue 1: "Server is running" but no frontend
**Problem:** Test routes blocking React app
**Solution:** Remove `app.get("/")` routes that return plain text

### Issue 2: API calls failing after port change
**Problem:** Vite proxy hardcoded to port 3000
**Solution:** Make proxy read PORT from `.env` dynamically

### Issue 3: 404 on refresh (SPA routing)
**Problem:** Express doesn't know React routes
**Solution:** Catch-all route serves `index.html` for all unmatched paths

### Issue 4: Images not loading
**Problem:** Wrong static file path
**Solution:** Serve both `dist/` and `public/` folders

### Issue 5: CORS errors
**Problem:** Frontend/backend on different ports
**Solution:** Vite proxy handles CORS automatically

## 📋 Development Workflow

### Daily Development:
1. **Start both servers:** `npm run dev`
2. **Frontend:** `http://localhost:5173` (Vite dev server)
3. **Backend:** `http://localhost:3000` (Express server)
4. **API calls:** Proxied through Vite to backend

### Making Changes:
1. **Backend:** Edit `server.js`, routes, models
2. **Frontend:** Edit React components in `src/`
3. **Environment:** Update `.env` for config changes
4. **Restart:** Backend for server changes, frontend hot-reloads

### Testing Production:
1. **Build frontend:** `cd "job poster" && npm run build`
2. **Start production server:** `node server.js`
3. **Test:** `http://localhost:3000` (serves built React)

## 🔒 Security Focus Areas

### 1. **Environment Variables**
- Never expose secrets in code
- Use strong JWT secrets
- Different configs for dev/prod

### 2. **Authentication**
- Hash passwords with bcrypt
- Use httpOnly cookies for JWT
- Validate user input on all routes

### 3. **API Security**
- Use HTTPS in production
- Implement rate limiting
- Validate and sanitize inputs

## 🛠️ Tools & Dependencies

### Essential Packages:
- **express:** Web server framework
- **mongoose:** MongoDB ODM
- **jsonwebtoken:** JWT authentication
- **bcrypt:** Password hashing
- **cookie-parser:** Handle cookies
- **cors:** Cross-origin requests
- **dotenv:** Environment variables

### Development Tools:
- **nodemon:** Auto-restart server
- **concurrently:** Run multiple commands
- **vite:** Fast frontend build tool

## 📚 Learning Path for Beginners

### Phase 1: Setup & Basics
- [ ] Install Node.js, MongoDB
- [ ] Create basic Express server
- [ ] Connect to MongoDB
- [ ] Build simple API endpoints

### Phase 2: Authentication
- [ ] User registration/login
- [ ] JWT token implementation
- [ ] Protected routes
- [ ] Password hashing

### Phase 3: Frontend Integration
- [ ] React app setup
- [ ] API integration with Axios
- [ ] State management
- [ ] Routing with React Router

### Phase 4: Production Ready
- [ ] Environment configuration
- [ ] Build process
- [ ] Error handling
- [ ] Security best practices

## 🎯 Current Project Status

✅ **Working:** Full-stack MERN app with authentication
✅ **Frontend:** React with routing, forms, charts
✅ **Backend:** Express API with MongoDB
✅ **Auth:** JWT + cookies
✅ **Deployment:** Ready for production build

## 🚀 Next Steps

1. **Test all features** in development mode
2. **Build for production** and test
3. **Deploy to hosting** (Vercel/Netlify + Railway/Render)
4. **Add features** like email verification, file uploads
5. **Learn advanced topics** like testing, CI/CD

Remember: Start small, test often, and don't be afraid to break things while learning! 🎉