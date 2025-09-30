import React from 'react'
import Layout from '../components/Layout'
import { Shield } from 'lucide-react'

const ONJNReports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Rapoarte ONJN</h2>
              <p className="text-slate-600">Generează și gestionează rapoartele ONJN</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl inline-block mb-6">
            <Shield className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Rapoarte ONJN</h3>
          <p className="text-slate-600 text-lg">Modulul pentru rapoartele ONJN va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default ONJNReports
