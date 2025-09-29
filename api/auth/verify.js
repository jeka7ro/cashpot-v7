export default function handler(req, res) {
  res.status(200).json({
    user: {
      id: 1,
      username: 'admin',
      firstName: 'Administrator',
      lastName: 'Sistem',
      role: 'admin'
    }
  });
}
