import React from 'react'
import Layout from '../components/Layout'
import { BarChart3, Plus, Search, Upload, Download } from 'lucide-react'

const Slots = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg shadow-emerald-500/25">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Sloturi</h2>
              <p className="text-slate-600">Gestionează sloturile de gaming din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl inline-block mb-6">
            <BarChart3 className="w-16 h-16 text-emerald-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Sloturi</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul sloturilor va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Slots
