import React from 'react'
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Activity,
  Database,
  Server,
  Shield,
  Clock
} from 'lucide-react'

const SystemHealth = () => {
  const healthItems = [
    {
      name: 'Sistem Principal',
      status: 'healthy',
      description: 'Toate serviciile funcționează normal',
      icon: Server,
      color: 'green'
    },
    {
      name: 'Baza de Date',
      status: 'healthy',
      description: 'Conectivitate optimă la MongoDB Atlas',
      icon: Database,
      color: 'green'
    },
    {
      name: 'API Backend',
      status: 'healthy',
      description: 'Toate endpoint-urile sunt disponibile',
      icon: Activity,
      color: 'green'
    },
    {
      name: 'Securitate',
      status: 'warning',
      description: 'Actualizare de securitate recomandată',
      icon: Shield,
      color: 'yellow'
    },
    {
      name: 'Backup',
      status: 'healthy',
      description: 'Ultimul backup: Acum 2 ore',
      icon: Clock,
      color: 'green'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return CheckCircle
      case 'warning':
        return AlertCircle
      case 'error':
        return XCircle
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-slate-600 bg-slate-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Funcțional'
      case 'warning':
        return 'Atenție'
      case 'error':
        return 'Eroare'
      default:
        return 'Necunoscut'
    }
  }

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'from-green-500 to-emerald-500 shadow-green-500/25'
      case 'yellow':
        return 'from-yellow-500 to-orange-500 shadow-yellow-500/25'
      case 'red':
        return 'from-red-500 to-pink-500 shadow-red-500/25'
      default:
        return 'from-slate-500 to-gray-500 shadow-slate-500/25'
    }
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Starea Sistemului</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-600">Operațional</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthItems.map((item, index) => {
          const StatusIcon = getStatusIcon(item.status)
          const ItemIcon = item.icon
          
          return (
            <div key={index} className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${getColorClasses(item.color)} shadow-lg`}>
                  <ItemIcon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
                
                <StatusIcon className={`w-5 h-5 ${getStatusColor(item.status).split(' ')[0]}`} />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">Uptime:</span> 99.9% (Ultimele 30 zile)
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-semibold">Ultima verificare:</span> {new Date().toLocaleTimeString('ro-RO')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemHealth
