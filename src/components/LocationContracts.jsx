import React, { useState } from 'react'
import { FileText, Plus, Download, Eye, Edit, Trash2 } from 'lucide-react'

const LocationContracts = ({ locationId, locationName }) => {
  const [contracts] = useState([
    {
      id: 1,
      contractNumber: 'C-2024-001',
      type: 'Contract de Închiriere',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      value: 5000,
      currency: 'RON',
      status: 'Activ',
      filePath: '/contracts/contract-001.pdf'
    },
    {
      id: 2,
      contractNumber: 'C-2024-002',
      type: 'Contract de Mentenanță',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      value: 1200,
      currency: 'RON',
      status: 'Activ',
      filePath: '/contracts/contract-002.pdf'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddContract = () => {
    setShowAddModal(true)
  }

  const handleViewContract = (contract) => {
    // TODO: Implement contract viewing
    console.log('View contract:', contract)
  }

  const handleDownloadContract = (contract) => {
    // TODO: Implement contract download
    console.log('Download contract:', contract)
  }

  const handleEditContract = (contract) => {
    // TODO: Implement contract editing
    console.log('Edit contract:', contract)
  }

  const handleDeleteContract = (contract) => {
    if (window.confirm(`Sigur doriți să ștergeți contractul "${contract.contractNumber}"?`)) {
      // TODO: Implement contract deletion
      console.log('Delete contract:', contract)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Contracte - {locationName}</h3>
          <p className="text-slate-600">Gestionează contractele asociate acestei locații</p>
        </div>
        <button 
          onClick={handleAddContract}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Adaugă Contract</span>
        </button>
      </div>

      {/* Contracts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nr. Contract
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tip Contract
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Perioadă
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Valoare
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="table-row hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">
                      {contract.contractNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-700 font-medium">
                      {contract.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-600 text-sm">
                      {new Date(contract.startDate).toLocaleDateString('ro-RO')} - {new Date(contract.endDate).toLocaleDateString('ro-RO')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-700 font-mono">
                      {contract.value.toLocaleString('ro-RO')} {contract.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      contract.status === 'Activ' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewContract(contract)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Vezi contract"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownloadContract(contract)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                        title="Descarcă contract"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleEditContract(contract)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded-lg hover:bg-yellow-50 transition-colors"
                        title="Editează contract"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteContract(contract)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Șterge contract"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {contracts.length === 0 && (
        <div className="card p-12 text-center">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl inline-block mb-6">
            <FileText className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Nu există contracte</h3>
          <p className="text-slate-600 mb-6">
            Adaugă primul contract pentru această locație
          </p>
          <button 
            onClick={handleAddContract}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={18} />
            <span>Adaugă Contract</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default LocationContracts
