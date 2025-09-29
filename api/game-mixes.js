export default function handler(req, res) {
  const gameMixes = [
    { id: 1, name: 'Classic Slots', description: 'Traditional slot games', status: 'active', createdAt: new Date() },
    { id: 2, name: 'Premium Games', description: 'High-end gaming experience', status: 'active', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, data: gameMixes });
}
