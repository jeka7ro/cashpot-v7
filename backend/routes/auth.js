import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credențiale invalide' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credențiale invalide' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ success: false, message: 'Eroare la autentificare' })
  }
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, fullName, role = 'user' } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Utilizatorul există deja' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      username,
      password: hashedPassword,
      fullName,
      role
    })

    await user.save()

    res.json({ success: true, message: 'Utilizator creat cu succes' })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'Eroare la crearea utilizatorului' })
  }
})

export default router
