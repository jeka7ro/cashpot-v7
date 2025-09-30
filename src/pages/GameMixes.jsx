import React from 'react'
import Layout from '../components/Layout'
import { Settings, Plus, Search, Upload, Download } from 'lucide-react'

const GameMixes = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/25">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Game Mixes</h2>
              <p className="text-slate-600">Gestionează mixurile de jocuri din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl inline-block mb-6">
            <Settings className="w-16 h-16 text-indigo-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Game Mixes</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul game mixurilor va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default GameMixes
