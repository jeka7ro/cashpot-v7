import { useState, useEffect } from 'react';
import { companiesAPI } from '../services/api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companiesAPI.list({ search, limit: 50 });
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchCompanies();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(companies.map(c => c.id));
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
      <h1 className="title">Companies</h1>
      <p className="subtitle">Manage gaming companies and their licenses</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search companies..."
          className="search-input"
          value={search}
          onChange={handleSearch}
        />
        <button className="btn btn-primary">+ Add Company</button>
        <button className="btn btn-secondary">Bulk Edit ({selectedIds.length})</button>
        <button className="btn btn-danger">Bulk Delete ({selectedIds.length})</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectedIds.length === companies.length && companies.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Company</th>
            <th>License</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(company.id)}
                  onChange={() => handleSelectOne(company.id)}
                />
              </td>
              <td>🏢 {company.name}</td>
              <td>{company.license}</td>
              <td>{company.address}</td>
              <td>
                <div>{company.phone}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{company.email}</div>
              </td>
              <td>
                <span className={`status ${company.status}`}>
                  {company.status}
                </span>
              </td>
              <td>{new Date(company.createdAt).toLocaleDateString()}</td>
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
