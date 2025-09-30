import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell, 
  Settings,
  Building2,
  MapPin,
  Users,
  Gamepad2,
  Settings as MixIcon,
  BarChart3,
  Package,
  Activity,
  Trophy,
  FileText,
  Shield,
  FileText as DocIcon,
  Users as UserIcon
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const { statistics } = useData()
  const location = useLocation()

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/dashboard',
      count: null
    },
    { 
      id: 'companies', 
      label: 'Companii', 
      icon: Building2, 
      path: '/companies',
      count: statistics.totalCompanies
    },
    { 
      id: 'locations', 
      label: 'Locații', 
      icon: MapPin, 
      path: '/locations',
      count: statistics.totalLocations
    },
    { 
      id: 'providers', 
      label: 'Furnizori', 
      icon: Users, 
      path: '/providers',
      count: statistics.totalProviders
    },
    { 
      id: 'cabinets', 
      label: 'Cabinete', 
      icon: Gamepad2, 
      path: '/cabinets',
      count: statistics.totalCabinets
    },
    { 
      id: 'game-mixes', 
      label: 'Game Mixes', 
      icon: MixIcon, 
      path: '/game-mixes',
      count: statistics.totalGameMixes
    },
    { 
      id: 'slots', 
      label: 'Sloturi', 
      icon: BarChart3, 
      path: '/slots',
      count: statistics.totalSlots
    },
    { 
      id: 'warehouse', 
      label: 'Depozit', 
      icon: Package, 
      path: '/warehouse',
      count: statistics.totalWarehouse
    },
    { 
      id: 'metrology', 
      label: 'Metrologie CVT', 
      icon: Activity, 
      path: '/metrology',
      count: statistics.totalMetrology
    },
    { 
      id: 'jackpots', 
      label: 'Jackpots', 
      icon: Trophy, 
      path: '/jackpots',
      count: statistics.totalJackpots
    },
    { 
      id: 'invoices', 
      label: 'Facturi', 
      icon: FileText, 
      path: '/invoices',
      count: statistics.totalInvoices
    },
    { 
      id: 'onjn-reports', 
      label: 'Rapoarte ONJN', 
      icon: Shield, 
      path: '/onjn-reports',
      count: statistics.totalOnjnReports
    },
    { 
      id: 'legal-documents', 
      label: 'Documente Legale', 
      icon: DocIcon, 
      path: '/legal-documents',
      count: statistics.totalLegalDocuments
    },
    { 
      id: 'users', 
      label: 'Utilizatori', 
      icon: UserIcon, 
      path: '/users',
      count: statistics.totalUsers
    }
  ]

  const currentPage = menuItems.find(item => item.path === location.pathname)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Glassmorphism Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-white/20 text-slate-800 px-4 md:px-6 py-3 md:py-4 z-30 shadow-2xl shadow-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:shadow-lg"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30 ring-2 ring-orange-200/50">
                <span className="text-white font-bold text-base md:text-lg">C</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold text-gradient-primary">CASHPOT V7</h1>
                <p className="text-xs text-slate-500 hidden md:block font-medium">Gaming Management System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:shadow-lg relative hidden sm:block group">
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse"></span>
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:shadow-lg hidden md:block group">
              <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div className="flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-slate-100/80 to-slate-200/80 backdrop-blur-sm rounded-2xl px-3 md:px-4 py-2 md:py-2.5 shadow-lg border border-white/50">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Admin'}&size=36&background=8B5CF6&color=fff`} 
                alt={user?.fullName || 'Admin'} 
                className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white shadow-md" 
              />
              <div className="text-xs md:text-sm hidden sm:block">
                <div className="font-semibold text-slate-700">{user?.fullName || 'Admin'}</div>
                <div className="text-slate-500 text-xs">Administrator</div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25 group"
            >
              <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Glassmorphism Sidebar */}
      <div className={`${sidebarOpen ? 'w-64 md:w-72' : 'w-0 md:w-20'} bg-white/70 backdrop-blur-xl border-r border-white/30 transition-all duration-300 flex flex-col mt-14 md:mt-20 shadow-2xl shadow-slate-500/10 fixed md:relative z-20 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          <nav className="space-y-2">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl text-left transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-500/25 ring-2 ring-blue-200/50' 
                      : 'text-slate-700 hover:bg-white/60 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={`text-lg md:text-xl transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-lg' : ''}`} />
                    {sidebarOpen && (
                      <span className={`font-semibold text-sm md:text-base transition-colors ${
                        isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  {sidebarOpen && item.count !== null && (
                    <span className={`text-xs px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30' 
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 group-hover:from-blue-200 group-hover:to-indigo-200'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden mt-14 md:mt-20">

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
