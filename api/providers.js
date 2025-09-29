export default function handler(req, res) {
  const providers = [
    { id: 1, name: 'Unknown Provider', contact: 'N/A', status: 'active', createdAt: new Date() },
    { id: 2, name: 'Gaming Solutions Ltd', contact: 'contact@gaming.ro', status: 'active', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, data: providers });
}
