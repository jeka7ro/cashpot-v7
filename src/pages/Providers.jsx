import React from 'react'
import Layout from '../components/Layout'
import { Users, Plus, Search, Upload, Download } from 'lucide-react'

const Providers = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg shadow-purple-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Management Furnizori</h2>
                <p className="text-slate-600">Gestionează furnizorii de jocuri din sistem</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
                <input type="text" placeholder="Caută furnizori..." className="input-field pl-12" />
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <Upload size={16} />
                <span>Importă</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Download size={16} />
                <span>Exportă</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={18} />
                <span>Adaugă Furnizor</span>
              </button>
            </div>
          </div>
        </div>

        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-3xl inline-block mb-6">
            <Users className="w-16 h-16 text-purple-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Furnizori</h3>
          <p className="text-slate-600 text-lg mb-6">
            Modulul pentru managementul furnizorilor va fi disponibil în curând.
          </p>
          <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-2xl p-4 inline-block">
            <p className="text-purple-800 font-semibold">Funcționalități planificate:</p>
            <ul className="text-purple-700 text-sm mt-2 space-y-1">
              <li>• Management furnizori jocuri</li>
              <li>• Asociere cu jocuri</li>
              <li>• Management contracte</li>
              <li>• Tracking plăți</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Providers
