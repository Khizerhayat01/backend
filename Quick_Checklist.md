# MERN Stack Quick Checklist

## ✅ Pre-Development Setup
- [ ] Run `npm run setup-project` (installs all dependencies)
- [ ] Check `.env` file has all required variables
- [ ] MongoDB connection string is correct
- [ ] Cloudinary credentials (if using images)

## ✅ Starting Development
- [ ] `npm run dev` - starts both frontend + backend
- [ ] Frontend: http://localhost:5173
- [ ] Backend: http://localhost:3000 (or your PORT)
- [ ] Check console for "MongoDB connected" message

## ✅ Common Issues to Check
- [ ] PORT in `.env` matches Vite proxy config
- [ ] No test routes blocking frontend (removed `app.get("/")`)
- [ ] Static files served from correct folders (`dist/` + `public/`)
- [ ] Catch-all route points to `dist/index.html`
- [ ] Frontend API calls use `/api/v1` base URL

## ✅ Before Production Build
- [ ] `cd "job poster" && npm run build` - creates dist folder
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Test with `node server.js` (serves from dist/)
- [ ] All API endpoints working
- [ ] Authentication flow complete

## ✅ Deployment Checklist
- [ ] Environment variables set on hosting platform
- [ ] MongoDB accessible from production
- [ ] Build command runs successfully
- [ ] Static files served correctly
- [ ] HTTPS enabled
- [ ] Domain configured

## 🚨 If Something Breaks
1. Check terminal/console for error messages
2. Verify `.env` variables are loaded
3. Confirm MongoDB connection
4. Check network/firewall issues
5. Clear node_modules and reinstall if needed
6. Check file paths (especially on Windows)

## 📞 Quick Commands
```bash
# Full setup
npm run setup-project

# Development
npm run dev

# Production build
cd "job poster" && npm run build

# Production server
node server.js

# Install missing packages
npm install
```