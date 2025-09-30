import React from 'react'
import Layout from '../components/Layout'
import { Package } from 'lucide-react'

const Warehouse = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-slate-500 to-gray-500 rounded-2xl shadow-lg shadow-slate-500/25">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Depozit</h2>
              <p className="text-slate-600">Gestionează inventarul din depozit</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl inline-block mb-6">
            <Package className="w-16 h-16 text-slate-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Depozit</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul depozitului va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Warehouse
