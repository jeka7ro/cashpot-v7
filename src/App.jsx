import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import Locations from './pages/Locations'
import Providers from './pages/Providers'
import Cabinets from './pages/Cabinets'
import GameMixes from './pages/GameMixes'
import Slots from './pages/Slots'
import Warehouse from './pages/Warehouse'
import Metrology from './pages/Metrology'
import Jackpots from './pages/Jackpots'
import Invoices from './pages/Invoices'
import ONJNReports from './pages/ONJNReports'
import LegalDocuments from './pages/LegalDocuments'
import Users from './pages/Users'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/companies" element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            } />
            
            <Route path="/locations" element={
              <ProtectedRoute>
                <Locations />
              </ProtectedRoute>
            } />
            
            <Route path="/providers" element={
              <ProtectedRoute>
                <Providers />
              </ProtectedRoute>
            } />
            
            <Route path="/cabinets" element={
              <ProtectedRoute>
                <Cabinets />
              </ProtectedRoute>
            } />
            
            <Route path="/game-mixes" element={
              <ProtectedRoute>
                <GameMixes />
              </ProtectedRoute>
            } />
            
            <Route path="/slots" element={
              <ProtectedRoute>
                <Slots />
              </ProtectedRoute>
            } />
            
            <Route path="/warehouse" element={
              <ProtectedRoute>
                <Warehouse />
              </ProtectedRoute>
            } />
            
            <Route path="/metrology" element={
              <ProtectedRoute>
                <Metrology />
              </ProtectedRoute>
            } />
            
            <Route path="/jackpots" element={
              <ProtectedRoute>
                <Jackpots />
              </ProtectedRoute>
            } />
            
            <Route path="/invoices" element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            } />
            
            <Route path="/onjn-reports" element={
              <ProtectedRoute>
                <ONJNReports />
              </ProtectedRoute>
            } />
            
            <Route path="/legal-documents" element={
              <ProtectedRoute>
                <LegalDocuments />
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
