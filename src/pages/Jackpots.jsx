import React from 'react'
import Layout from '../components/Layout'
import { Trophy } from 'lucide-react'

const Jackpots = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/25">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Jackpots</h2>
              <p className="text-slate-600">Gestionează jackpot-urile din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl inline-block mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Jackpots</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul jackpot-urilor va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Jackpots
