export default function handler(req, res) {
  const locations = [
    { id: 1, name: 'Main Floor', address: 'Ground Level', status: 'active', createdAt: new Date() },
    { id: 2, name: 'VIP Area', address: 'First Floor', status: 'active', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, data: locations });
}
