import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Factory, 
  Monitor, 
  Gamepad2, 
  Coins, 
  Package, 
  Microscope, 
  Trophy, 
  FileText, 
  BarChart3, 
  FileCheck, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, count: null },
  { name: 'Companies', href: '/companies', icon: Building2, count: 0 },
  { name: 'Locations', href: '/locations', icon: MapPin, count: 0 },
  { name: 'Providers', href: '/providers', icon: Factory, count: 0 },
  { name: 'Cabinets', href: '/cabinets', icon: Monitor, count: 18 },
  { name: 'Game Mixes', href: '/game-mixes', icon: Gamepad2, count: 24 },
  { name: 'Slots', href: '/slots', icon: Coins, count: 310 },
  { name: 'Warehouse', href: '/warehouse', icon: Package, count: 0 },
  { name: 'Metrology', href: '/metrology', icon: Microscope, count: 0 },
  { name: 'Jackpots', href: '/jackpots', icon: Trophy, count: 9 },
  { name: 'Invoices', href: '/invoices', icon: FileText, count: 3 },
  { name: 'ONJN Reports', href: '/onjn-reports', icon: BarChart3, count: 0 },
  { name: 'Legal Documents', href: '/legal-documents', icon: FileCheck, count: 3 },
  { name: 'Users', href: '/users', icon: Users, count: 3 },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">C</div>
            <div className="logo-text">
              <h2>CASHPOT</h2>
              <p>Gaming Management System</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {item.count !== null && (
                  <span className="count">{item.count}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px', marginTop: 'auto', borderTop: '1px solid #374151' }}>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            <div>CASHPOT V7</div>
            <div>Gaming Management System</div>
            <div>v7.0.1 - Build: 29.09.2025, 11:15</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="header-logo">🏦</div>
            <div className="header-info">
              <h1>CASHPOT V7</h1>
              <p>Gaming Management System</p>
              <p style={{ fontSize: '10px', color: '#9ca3af' }}>v7.0.1 - Build: 29.09.2025, 11:15</p>
            </div>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-details">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}
