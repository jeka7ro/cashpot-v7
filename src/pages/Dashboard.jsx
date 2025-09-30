import React from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import SystemHealth from '../components/SystemHealth'
import { 
  Building2, 
  MapPin, 
  Users, 
  Gamepad2, 
  Package, 
  Settings, 
  Trophy, 
  FileText, 
  Shield, 
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react'

const Dashboard = () => {
  const { statistics, loading } = useData()
  const { user } = useAuth()

  const statCards = [
    {
      title: 'Companii',
      value: statistics.totalCompanies,
      icon: Building2,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Locații',
      value: statistics.totalLocations,
      icon: MapPin,
      color: 'green',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Furnizori',
      value: statistics.totalProviders,
      icon: Users,
      color: 'purple',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Cabinete',
      value: statistics.totalCabinets,
      icon: Gamepad2,
      color: 'orange',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Game Mixes',
      value: statistics.totalGameMixes,
      icon: Settings,
      color: 'indigo',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Sloturi',
      value: statistics.totalSlots,
      icon: BarChart3,
      color: 'emerald',
      change: '+22%',
      changeType: 'positive'
    },
    {
      title: 'Depozit',
      value: statistics.totalWarehouse,
      icon: Package,
      color: 'slate',
      change: '+7%',
      changeType: 'positive'
    },
    {
      title: 'Metrologie',
      value: statistics.totalMetrology,
      icon: Activity,
      color: 'cyan',
      change: '+2%',
      changeType: 'positive'
    },
    {
      title: 'Jackpots',
      value: statistics.totalJackpots,
      icon: Trophy,
      color: 'yellow',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Facturi',
      value: statistics.totalInvoices,
      icon: FileText,
      color: 'red',
      change: '+9%',
      changeType: 'positive'
    },
    {
      title: 'Rapoarte ONJN',
      value: statistics.totalOnjnReports,
      icon: Shield,
      color: 'blue',
      change: '+4%',
      changeType: 'positive'
    },
    {
      title: 'Documente Legale',
      value: statistics.totalLegalDocuments,
      icon: FileText,
      color: 'gray',
      change: '+6%',
      changeType: 'positive'
    },
    {
      title: 'Utilizatori',
      value: statistics.totalUsers,
      icon: Users,
      color: 'purple',
      change: '+1%',
      changeType: 'positive'
    }
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="card p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                Bun venit, {user?.fullName || 'Administrator'}!
              </h1>
              <p className="text-slate-600 text-lg">
                Panoul principal al sistemului CASHPOT V7
              </p>
              <div className="mt-2 text-sm text-slate-500">
                Ultima actualizare: {new Date().toLocaleString('ro-RO')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                v7.0.1
              </div>
              <div className="text-sm text-slate-500">
                Build: 29.09.2025, 11:15
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              change={card.change}
              changeType={card.changeType}
              loading={loading.companies}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>

        {/* System Health */}
        <SystemHealth />

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Performanță Sistem</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <span className="font-semibold text-slate-700">CPU Usage</span>
                <span className="text-green-600 font-bold">23%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <span className="font-semibold text-slate-700">Memory Usage</span>
                <span className="text-blue-600 font-bold">67%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                <span className="font-semibold text-slate-700">Disk Usage</span>
                <span className="text-yellow-600 font-bold">45%</span>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Activitate Recentă</h3>
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">Sistem pornit</p>
                  <p className="text-sm text-slate-500">Acum 2 minute</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">Backup completat</p>
                  <p className="text-sm text-slate-500">Acum 1 oră</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">Actualizare disponibilă</p>
                  <p className="text-sm text-slate-500">Acum 3 ore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
