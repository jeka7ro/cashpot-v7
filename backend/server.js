import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import companyRoutes from './routes/companies.js'
import locationRoutes from './routes/locations.js'
import providerRoutes from './routes/providers.js'
import cabinetRoutes from './routes/cabinets.js'
import gameMixRoutes from './routes/gameMixes.js'
import slotRoutes from './routes/slots.js'
import warehouseRoutes from './routes/warehouse.js'
import metrologyRoutes from './routes/metrology.js'
import jackpotRoutes from './routes/jackpots.js'
import invoiceRoutes from './routes/invoices.js'
import onjnReportRoutes from './routes/onjnReports.js'
import legalDocumentRoutes from './routes/legalDocuments.js'
import userRoutes from './routes/users.js'
import uploadRoutes from './routes/upload.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Health check endpoint - MUST BE FIRST!
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '7.0.6',
    uptime: process.uptime()
  })
})

// API Health check endpoint (for Render)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '7.0.6',
    uptime: process.uptime()
  })
})

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
app.use(morgan('combined'))

// Static files
app.use('/uploads', express.static('uploads'))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/locations', locationRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/cabinets', cabinetRoutes)
app.use('/api/gameMixes', gameMixRoutes)
app.use('/api/slots', slotRoutes)
app.use('/api/warehouse', warehouseRoutes)
app.use('/api/metrology', metrologyRoutes)
app.use('/api/jackpots', jackpotRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/onjnReports', onjnReportRoutes)
app.use('/api/legalDocuments', legalDocumentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@jeka7ro.gkyalir.mongodb.net/cashpot-v7?retryWrites=true&w=majority'
console.log('🔗 Attempting to connect to MongoDB...')
console.log('🔗 MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')) // Hide credentials in logs

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB')
  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Cashpot V7 Backend running on port ${PORT}`)
    console.log(`📊 Connected to MongoDB`)
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🔐 Login: admin / admin123`)
  })
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error)
  // Start server anyway for demo
  app.listen(PORT, () => {
    console.log(`🚀 Cashpot V7 Backend running on port ${PORT}`)
    console.log(`📊 Using in-memory data (MongoDB connection failed)`)
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🔐 Login: admin / admin123`)
  })
})

export default app

