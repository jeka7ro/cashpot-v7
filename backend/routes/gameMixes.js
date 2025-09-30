import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.json([])
})

router.post('/', (req, res) => {
  res.json({ message: 'Created' })
})

export default router
