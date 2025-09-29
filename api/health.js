export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    version: '7.0.1',
    timestamp: new Date().toISOString()
  });
}
