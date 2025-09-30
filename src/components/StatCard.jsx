import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color, change, changeType, loading }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-violet-500',
    orange: 'from-orange-500 to-amber-500',
    indigo: 'from-indigo-500 to-blue-500',
    emerald: 'from-emerald-500 to-green-500',
    slate: 'from-slate-500 to-gray-500',
    cyan: 'from-cyan-500 to-blue-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500',
    gray: 'from-gray-500 to-slate-500'
  }

  const shadowClasses = {
    blue: 'shadow-blue-500/25',
    green: 'shadow-green-500/25',
    purple: 'shadow-purple-500/25',
    orange: 'shadow-orange-500/25',
    indigo: 'shadow-indigo-500/25',
    emerald: 'shadow-emerald-500/25',
    slate: 'shadow-slate-500/25',
    cyan: 'shadow-cyan-500/25',
    yellow: 'shadow-yellow-500/25',
    red: 'shadow-red-500/25',
    gray: 'shadow-gray-500/25'
  }

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-8 w-8 bg-slate-200 rounded-2xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 rounded w-16"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
          {title}
        </h3>
        <div className={`p-3 rounded-2xl bg-gradient-to-r ${colorClasses[color]} shadow-lg ${shadowClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
          {value?.toLocaleString() || 0}
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change}</span>
            <span className="text-slate-500">vs. luna trecută</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
