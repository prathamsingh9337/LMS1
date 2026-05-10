import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'

import userRouter from './routes/userRoutes.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'

// Initialize Express
const app = express()

// ---------------- DEBUG LOGS ----------------

console.log("Starting server...")

// ---------------- DATABASE CONNECTIONS ----------------

await connectDB()
console.log("MongoDB Connected")

await connectCloudinary()
console.log("Cloudinary Connected")

// ---------------- MIDDLEWARES ----------------

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// JSON parser
app.use(express.json())

// Clerk
app.use(clerkMiddleware())

// ---------------- TEST ROUTE ----------------

app.get('/', (req, res) => {
  res.send("API Working")
})

// API Test Route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: "Backend Connected Successfully"
  })
})

// ---------------- WEBHOOK ROUTES ----------------

app.post('/clerk', express.json(), clerkWebhooks)

app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
)

// ---------------- API ROUTES ----------------

app.use('/api/educator', educatorRouter)

app.use('/api/course', courseRouter)

app.use('/api/user', userRouter)

// ---------------- PORT ----------------

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})