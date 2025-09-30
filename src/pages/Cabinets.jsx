import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import CabinetModal from '../components/modals/CabinetModal'
import { Gamepad2, Plus, Search, Upload, Download } from 'lucide-react'

const Cabinets = () => {
  const { cabinets, createItem, updateItem, deleteItem, exportData, loading } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCabinets = cabinets.filter(cabinet =>
    cabinet.cabinetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabinet.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabinet.game?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabinet.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      key: 'cabinetId',
      label: 'ID Cabinet',
      sortable: true,
      render: (item) => (
        <div className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
          {item.cabinetId}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Locație',
      sortable: true,
      render: (item) => (
        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
          {item.location}
        </span>
      )
    },
    {
      key: 'game',
      label: 'Joc',
      sortable: true,
      render: (item) => (
        <div className="text-slate-700 font-medium text-sm">
          {item.game}
        </div>
      )
    },
    {
      key: 'serialNumber',
      label: 'Serial',
      sortable: true,
      render: (item) => (
        <div className="text-slate-600 text-sm font-mono">
          {item.serialNumber}
        </div>
      )
    },
    {
      key: 'lastMaintenance',
      label: 'Ultima Întreținere',
      sortable: true,
      render: (item) => (
        <div className="text-slate-600 text-sm">
          {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString('ro-RO') : 'N/A'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <span className={`px-4 py-2 rounded-2xl text-xs font-bold shadow-lg ${
          item.status === 'Activ' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25' 
            : item.status === 'Mentenanță'
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/25'
            : item.status === 'Defect'
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25'
            : 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-gray-500/25'
        }`}>
          {item.status}
        </span>
      )
    }
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDelete = async (item) => {
    if (window.confirm(`Sigur doriți să ștergeți cabinetul "${item.cabinetId}"?`)) {
      await deleteItem('cabinets', item.id)
    }
  }

  const handleSave = async (data) => {
    if (editingItem) {
      await updateItem('cabinets', editingItem.id, data)
    } else {
      await createItem('cabinets', data)
    }
    setShowModal(false)
    setEditingItem(null)
  }

  const handleExport = async () => {
    await exportData('cabinets', 'excel')
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import functionality to be implemented')
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg shadow-purple-500/25">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Management Cabinete</h2>
                <p className="text-slate-600">Gestionează cabinetele de gaming din sistem</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Caută cabinete..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="input-field pl-12" 
                />
              </div>
              <button 
                onClick={handleImport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Importă</span>
              </button>
              <button 
                onClick={handleExport}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Exportă</span>
              </button>
              <button 
                onClick={handleAdd}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Adaugă Cabinet</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredCabinets}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading.cabinets}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Modal */}
        {showModal && (
          <CabinetModal
            item={editingItem}
            onClose={() => {
              setShowModal(false)
              setEditingItem(null)
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </Layout>
  )
}

export default Cabinets
