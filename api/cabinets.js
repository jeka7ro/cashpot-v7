export default function handler(req, res) {
  const cabinets = [
    { id: 1, name: 'Alfastreet Live CAB001', provider: 'Unknown Provider', status: 'active', location: 'Main Floor', gameMix: 'Classic Slots', createdAt: new Date() },
    { id: 2, name: 'VIP 27/2x42 CAB002', provider: 'Unknown Provider', status: 'active', location: 'VIP Area', gameMix: 'Premium Games', createdAt: new Date() },
    { id: 3, name: 'P42V Curved ST CAB003', provider: 'Unknown Provider', status: 'active', location: 'Gaming Zone A', gameMix: 'Modern Slots', createdAt: new Date() },
    { id: 4, name: 'P42V Curved UP CAB004', provider: 'Unknown Provider', status: 'active', location: 'Gaming Zone B', gameMix: 'Modern Slots', createdAt: new Date() },
    { id: 5, name: 'G 55" C VIP CAB005', provider: 'Unknown Provider', status: 'active', location: 'VIP Lounge', gameMix: 'Exclusive Games', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, data: cabinets });
}
