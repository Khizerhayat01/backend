import express from 'express'
import morgan from 'morgan'
import * as dotenv from 'dotenv'
import jobRouter from './Routes/Route.js'
import authRoute from './Routes/authRoute.js'
import mongoose from 'mongoose'
import errorHandlerMidleware from './ErrorHandlerMidleware/ErrorHandlerMilderware.js'
import { authenticatedUser } from './ErrorHandlerMidleware/authMiddleware.js'
import { showState } from './control component/Control_component.js'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

// __dirname shim for ES module mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ✅ Load environment variables FIRST before using them
dotenv.config()

const app = express()

// ✅ Configure Cloudinary AFTER loading env variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

console.log('Cloudinary configured with cloud_name:', process.env.CLOUD_NAME)
console.log('Cloudinary API Key available:', !!process.env.CLOUD_API_KEY)
console.log('Cloudinary API Secret available:', !!process.env.CLOUD_API_SECRET)

if (process.env.NODE_ENV === 'Development') {
    app.use(morgan('combined'))
}

// ❌ REMOVED: Static file serving (not supported in Vercel serverless)
// app.use(express.static(join(__dirname, 'client', 'dist')))
// app.use(express.static(join(__dirname, 'client', 'public')))

app.use(cookieParser())
app.use(express.json())

app.use('/api/v1/jobs', jobRouter)
app.use('/api/v1/user', user)

// Stats endpoint requires the logged-in user so the chart can load their data
app.get('/api/v1/jobs/state', authenticatedUser, showState)

app.use('/api/v1/auth', authRoute)

app.use((req, res) => {
    res.status(404).json({ message: 'API route not found' })
})

app.use(errorHandlerMidleware)

try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('MongoDB connected')
    console.log(process.env.MONGODB_URL)
} catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
}

export default app

// let isConnected = false

// async function connectDB() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URL)
//     console.log("MongoDB connected")
//     isConnected = true
//     const port = process.env.PORT || 3000
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`)
//     })
//   }
// }

//add middleware

// app.use((req,res,next) => {
//   if(!isConnected) {
//     connectDB()
//   }
//   next()
// })

// module.exports = app


