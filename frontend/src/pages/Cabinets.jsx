import { useState, useEffect } from 'react';
import { cabinetsAPI } from '../services/api';

export default function Cabinets() {
  const [cabinets, setCabinets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCabinets();
  }, []);

  const fetchCabinets = async () => {
    try {
      const response = await cabinetsAPI.list({ search, limit: 50 });
      if (response.data.success) {
        setCabinets(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cabinets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchCabinets();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(cabinets.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
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
      <h1 className="title">Cabinets</h1>
      <p className="subtitle">Manage gaming cabinets and their configurations</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search cabinets..."
          className="search-input"
          value={search}
          onChange={handleSearch}
        />
        <button className="btn btn-primary">+ Add Cabinet</button>
        <button className="btn btn-secondary">Bulk Edit ({selectedIds.length})</button>
        <button className="btn btn-danger">Bulk Delete ({selectedIds.length})</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectedIds.length === cabinets.length && cabinets.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Cabinet</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Location</th>
            <th>Game Mix</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cabinets.map((cabinet) => (
            <tr key={cabinet.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(cabinet.id)}
                  onChange={() => handleSelectOne(cabinet.id)}
                />
              </td>
              <td>🖥️ {cabinet.name}</td>
              <td>🏭 {cabinet.provider}</td>
              <td>
                <span className={`status ${cabinet.status}`}>
                  {cabinet.status}
                </span>
              </td>
              <td>{cabinet.location}</td>
              <td>{cabinet.gameMix}</td>
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
  );
}
