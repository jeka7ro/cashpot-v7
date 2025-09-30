import React from 'react'
import Layout from '../components/Layout'
import { Users as UsersIcon } from 'lucide-react'

const Users = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg shadow-purple-500/25">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Utilizatori</h2>
              <p className="text-slate-600">Gestionează utilizatorii din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-3xl inline-block mb-6">
            <UsersIcon className="w-16 h-16 text-purple-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Utilizatori</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul utilizatorilor va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Users
