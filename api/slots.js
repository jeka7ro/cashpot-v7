export default function handler(req, res) {
  const slots = Array.from({ length: 310 }, (_, i) => ({
    id: i + 1,
    name: `Slot ${i + 1}`,
    type: 'Video Slot',
    status: 'active',
    createdAt: new Date()
  }));
  
  res.status(200).json({ success: true, data: slots });
}
