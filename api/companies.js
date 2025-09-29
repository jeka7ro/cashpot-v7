export default function handler(req, res) {
  const companies = [
    { id: 1, name: 'Casino Palace', license: 'LIC-001', address: 'Strada Principală 123, București', phone: '+40 21 123 4567', email: 'info@casinopalace.ro', status: 'active', createdAt: new Date() },
    { id: 2, name: 'Gaming Center Max', license: 'LIC-002', address: 'Bd. Unirii 45, Cluj-Napoca', phone: '+40 264 987 654', email: 'contact@gamingmax.ro', status: 'active', createdAt: new Date() }
  ];
  
  res.status(200).json({ success: true, data: companies });
}
