import { useState, useEffect } from 'react';
import { providersAPI } from '../services/api';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await providersAPI.list();
      if (response.data.success) {
        setProviders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
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
      <h1 className="title">Providers</h1>
      <p className="subtitle">Manage gaming equipment providers</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search providers..."
          className="search-input"
        />
        <button className="btn btn-primary">+ Add Provider</button>
        <button className="btn btn-secondary">Bulk Edit (0)</button>
        <button className="btn btn-danger">Bulk Delete (0)</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Provider</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>🏭 {provider.name}</td>
              <td>{provider.contact}</td>
              <td>
                <span className={`status ${provider.status}`}>
                  {provider.status}
                </span>
              </td>
              <td>{new Date(provider.createdAt).toLocaleDateString()}</td>
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
