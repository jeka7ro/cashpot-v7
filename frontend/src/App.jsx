import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

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
          <Route path="/companies" element={<div>Companies Page</div>} />
          <Route path="/locations" element={<div>Locations Page</div>} />
          <Route path="/providers" element={<div>Providers Page</div>} />
          <Route path="/cabinets" element={<div>Cabinets Page</div>} />
          <Route path="/game-mixes" element={<div>Game Mixes Page</div>} />
          <Route path="/slots" element={<div>Slots Page</div>} />
          <Route path="/warehouse" element={<div>Warehouse Page</div>} />
          <Route path="/metrology" element={<div>Metrology Page</div>} />
          <Route path="/jackpots" element={<div>Jackpots Page</div>} />
          <Route path="/invoices" element={<div>Invoices Page</div>} />
          <Route path="/onjn-reports" element={<div>ONJN Reports Page</div>} />
          <Route path="/legal-documents" element={<div>Legal Documents Page</div>} />
          <Route path="/users" element={<div>Users Page</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;