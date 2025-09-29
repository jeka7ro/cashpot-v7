import { useState, useEffect } from 'react';
import { cabinetsAPI } from '../services/api';

export default function Dashboard() {
  const [cabinets, setCabinets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCabinets();
  }, []);

  const fetchCabinets = async () => {
    try {
      const response = await cabinetsAPI.list();
      if (response.data.success) {
        setCabinets(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cabinets:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Cabinets', value: cabinets.length, change: '+2 this week' },
    { title: 'Active Cabinets', value: cabinets.filter(c => c.status === 'active').length, change: '+1 this week' },
    { title: 'Maintenance', value: cabinets.filter(c => c.status === 'maintenance').length, change: '0 this week' },
    { title: 'Inactive', value: cabinets.filter(c => c.status === 'inactive').length, change: '0 this week' },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <p className="subtitle">Welcome to Cashpot V7 Gaming Management System</p>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="value">{stat.value}</div>
            <div className="change">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Recent Cabinets */}
      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1f2937' }}>Recent Cabinets</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search cabinets..."
            className="search-input"
          />
          <button className="btn btn-primary">+ Add Cabinet</button>
          <button className="btn btn-secondary">Bulk Edit (0)</button>
          <button className="btn btn-secondary">Bulk Delete (0)</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Cabinet</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Location</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cabinets.slice(0, 10).map((cabinet) => (
              <tr key={cabinet.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>🖥️ {cabinet.name}</td>
                <td>🏭 {cabinet.provider}</td>
                <td>
                  <span className={`status ${cabinet.status}`}>
                    {cabinet.status}
                  </span>
                </td>
                <td>{cabinet.location}</td>
                <td>{new Date(cabinet.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', margin: '0 2px' }}>
                    ✏️
                  </button>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', margin: '0 2px' }}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
