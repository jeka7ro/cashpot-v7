import { useState, useEffect } from 'react';
import { locationsAPI } from '../services/api';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationsAPI.list();
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
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
      <h1 className="title">Locations</h1>
      <p className="subtitle">Manage gaming locations and areas</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search locations..."
          className="search-input"
        />
        <button className="btn btn-primary">+ Add Location</button>
        <button className="btn btn-secondary">Bulk Edit (0)</button>
        <button className="btn btn-danger">Bulk Delete (0)</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Location</th>
            <th>Address</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>📍 {location.name}</td>
              <td>{location.address}</td>
              <td>
                <span className={`status ${location.status}`}>
                  {location.status}
                </span>
              </td>
              <td>{new Date(location.createdAt).toLocaleDateString()}</td>
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
  );
}
