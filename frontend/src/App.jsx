import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Locations from './pages/Locations';
import Providers from './pages/Providers';
import Cabinets from './pages/Cabinets';
import GameMixes from './pages/GameMixes';
import Slots from './pages/Slots';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/cabinets" element={<Cabinets />} />
          <Route path="/game-mixes" element={<GameMixes />} />
          <Route path="/slots" element={<Slots />} />
          <Route path="/warehouse" element={<div className="card"><h1 className="title">Warehouse</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/metrology" element={<div className="card"><h1 className="title">Metrology</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/jackpots" element={<div className="card"><h1 className="title">Jackpots</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/invoices" element={<div className="card"><h1 className="title">Invoices</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/onjn-reports" element={<div className="card"><h1 className="title">ONJN Reports</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/legal-documents" element={<div className="card"><h1 className="title">Legal Documents</h1><p className="subtitle">Coming soon...</p></div>} />
          <Route path="/users" element={<div className="card"><h1 className="title">Users</h1><p className="subtitle">Coming soon...</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;