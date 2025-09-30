import express from 'express'
import Company from '../models/Company.js'

const router = express.Router()

// GET all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find()
    res.json(companies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST new company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body)
    await company.save()
    res.status(201).json(company)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router
