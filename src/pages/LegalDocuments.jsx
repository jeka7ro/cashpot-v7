import React from 'react'
import Layout from '../components/Layout'
import { FileText } from 'lucide-react'

const LegalDocuments = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl shadow-lg shadow-gray-500/25">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Documente Legale</h2>
              <p className="text-slate-600">Gestionează documentele legale din sistem</p>
            </div>
          </div>
        </div>
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl inline-block mb-6">
            <FileText className="w-16 h-16 text-gray-500 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">Documente Legale</h3>
          <p className="text-slate-600 text-lg">Modulul pentru documentele legale va fi disponibil în curând.</p>
        </div>
      </div>
    </Layout>
  )
}

export default LegalDocuments
