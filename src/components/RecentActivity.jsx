import React from 'react'
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  Building2,
  Users,
  Gamepad2,
  Trophy,
  Clock
} from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'create',
      entity: 'Companie',
      name: 'BRML Industries SRL',
      user: 'Admin',
      time: 'Acum 5 minute',
      icon: Building2,
      color: 'blue'
    },
    {
      id: 2,
      type: 'update',
      entity: 'Furnizor',
      name: 'EGT Digital',
      user: 'Admin',
      time: 'Acum 15 minute',
      icon: Users,
      color: 'green'
    },
    {
      id: 3,
      type: 'create',
      entity: 'Cabinet',
      name: 'CAB-003',
      user: 'Admin',
      time: 'Acum 1 oră',
      icon: Gamepad2,
      color: 'purple'
    },
    {
      id: 4,
      type: 'report',
      entity: 'Raport ONJN',
      name: 'Raport Lunar Ianuarie 2025',
      user: 'Admin',
      time: 'Acum 2 ore',
      icon: FileText,
      color: 'orange'
    },
    {
      id: 5,
      type: 'jackpot',
      entity: 'Jackpot',
      name: 'JP-002 - 25,000 RON',
      user: 'Sistem',
      time: 'Acum 3 ore',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 6,
      type: 'delete',
      entity: 'Slot',
      name: 'SLOT-015',
      user: 'Admin',
      time: 'Acum 4 ore',
      icon: Trash2,
      color: 'red'
    }
  ]

  const getActionIcon = (type) => {
    switch (type) {
      case 'create':
        return Plus
      case 'update':
        return Edit
      case 'delete':
        return Trash2
      case 'report':
        return FileText
      case 'jackpot':
        return Trophy
      default:
        return Activity
    }
  }

  const getActionText = (type) => {
    switch (type) {
      case 'create':
        return 'Creat'
      case 'update':
        return 'Actualizat'
      case 'delete':
        return 'Șters'
      case 'report':
        return 'Generat'
      case 'jackpot':
        return 'Câștigat'
      default:
        return 'Modificat'
    }
  }

  const getActionColor = (type) => {
    switch (type) {
      case 'create':
        return 'text-green-600 bg-green-100'
      case 'update':
        return 'text-blue-600 bg-blue-100'
      case 'delete':
        return 'text-red-600 bg-red-100'
      case 'report':
        return 'text-orange-600 bg-orange-100'
      case 'jackpot':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Activitate Recentă</h3>
        <Activity className="w-6 h-6 text-blue-500" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const ActionIcon = getActionIcon(activity.type)
          const EntityIcon = activity.icon
          
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
              <div className="relative">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClasses[activity.color]} shadow-lg`}>
                  <EntityIcon className="w-5 h-5 text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 p-1 rounded-full ${getActionColor(activity.type)}`}>
                  <ActionIcon className="w-3 h-3" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {activity.name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getActionColor(activity.type)}`}>
                    {getActionText(activity.type)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>{activity.entity}</span>
                  <span>•</span>
                  <span>de {activity.user}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="w-full py-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          Vezi toată activitatea →
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
