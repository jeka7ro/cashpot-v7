import React from 'react'
import Layout from '../components/Layout'
import { Activity } from 'lucide-react'

const Metrology = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/25">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Metrologie CVT</h2>
              <p className="text-slate-600">Gestionează dispozitivele de metrologie și calibrare</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl inline-block mb-6">
            <Activity className="w-16 h-16 text-cyan-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Metrologie CVT</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul metrologiei va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Metrology
