import React from 'react'
import Layout from '../components/Layout'
import { FileText } from 'lucide-react'

const Invoices = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg shadow-red-500/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Management Facturi</h2>
              <p className="text-slate-600">Gestionează facturile din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-3xl inline-block mb-6">
            <FileText className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Management Facturi</h3>
          <p className="text-slate-600 text-lg">Modulul pentru managementul facturilor va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Invoices
