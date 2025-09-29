import { useState, useEffect } from 'react';
import { slotsAPI } from '../services/api';

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await slotsAPI.list();
      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="title">Slots</h1>
      <p className="subtitle">Manage slot machines and games ({slots.length} total)</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search slots..."
          className="search-input"
        />
        <button className="btn btn-primary">+ Add Slot</button>
        <button className="btn btn-secondary">Bulk Edit (0)</button>
        <button className="btn btn-danger">Bulk Delete (0)</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Slot</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.slice(0, 50).map((slot) => (
            <tr key={slot.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>🪙 {slot.name}</td>
              <td>{slot.type}</td>
              <td>
                <span className={`status ${slot.status}`}>
                  {slot.status}
                </span>
              </td>
              <td>{new Date(slot.createdAt).toLocaleDateString()}</td>
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
      
      {slots.length > 50 && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
          Showing 50 of {slots.length} slots. Use search to filter results.
        </div>
      )}
    </div>
  );
}
