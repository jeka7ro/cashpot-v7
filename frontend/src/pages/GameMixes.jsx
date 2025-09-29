import { useState, useEffect } from 'react';
import { gameMixesAPI } from '../services/api';

export default function GameMixes() {
  const [gameMixes, setGameMixes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameMixes();
  }, []);

  const fetchGameMixes = async () => {
    try {
      const response = await gameMixesAPI.list();
      if (response.data.success) {
        setGameMixes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching game mixes:', error);
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
      <h1 className="title">Game Mixes</h1>
      <p className="subtitle">Manage gaming mixes and configurations</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search game mixes..."
          className="search-input"
        />
        <button className="btn btn-primary">+ Add Game Mix</button>
        <button className="btn btn-secondary">Bulk Edit (0)</button>
        <button className="btn btn-danger">Bulk Delete (0)</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Game Mix</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gameMixes.map((gameMix) => (
            <tr key={gameMix.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>🎮 {gameMix.name}</td>
              <td>{gameMix.description}</td>
              <td>
                <span className={`status ${gameMix.status}`}>
                  {gameMix.status}
                </span>
              </td>
              <td>{new Date(gameMix.createdAt).toLocaleDateString()}</td>
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
