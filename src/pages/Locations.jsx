import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import LocationModal from '../components/modals/LocationModal'
import LocationContracts from '../components/LocationContracts'
import { MapPin, Plus, Search, Upload, Download, FileText, Edit, Trash2 } from 'lucide-react'

const Locations = () => {
  const { locations, createItem, updateItem, deleteItem, exportData, loading } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('locations')
  const [selectedLocation, setSelectedLocation] = useState(null)

  const filteredLocations = locations.filter(location =>
    location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      label: 'Nume Locație',
      sortable: true,
      render: (item) => (
        <div className="font-bold text-slate-900 group-hover:text-green-700 transition-colors">
          {item.name}
        </div>
      )
    },
    {
      key: 'address',
      label: 'Adresă',
      sortable: true,
      render: (item) => (
        <div className="text-slate-700 font-medium text-sm max-w-xs truncate">
          {item.address}
        </div>
      )
    },
    {
      key: 'company',
      label: 'Companie',
      sortable: true,
      render: (item) => (
        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
          {item.company}
        </span>
      )
    },
        {
          key: 'surface',
          label: 'Suprafață (m²)',
          sortable: true,
          render: (item) => (
            <div className="text-slate-600 text-sm font-mono">
              {item.surface ? `${item.surface} m²` : 'N/A'}
            </div>
          )
        },
        {
          key: 'capacity',
          label: 'Capacitate (Sloturi)',
          sortable: true,
          render: (item) => (
            <div className="text-slate-600 text-sm font-mono">
              {item.capacity || 0} sloturi
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
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25'
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
    if (window.confirm(`Sigur doriți să ștergeți locația "${item.name}"?`)) {
      await deleteItem('locations', item.id)
    }
  }

  const handleSave = async (data) => {
    if (editingItem) {
      await updateItem('locations', editingItem.id, data)
    } else {
      await createItem('locations', data)
    }
    setShowModal(false)
    setEditingItem(null)
  }

  const handleExport = async () => {
    await exportData('locations', 'excel')
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import functionality to be implemented')
  }

  const handleViewContracts = (location) => {
    setSelectedLocation(location)
    setActiveTab('contracts')
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Tabs */}
        <div className="card p-6">
          <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('locations')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                activeTab === 'locations'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MapPin size={20} />
                <span>Locații</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-200 ${
                activeTab === 'contracts'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText size={20} />
                <span>Contracte</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'locations' ? (
          <>
            {/* Header Actions */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Caută locații..." 
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
                  <span>Adaugă Locație</span>
                </button>
              </div>
            </div>

        {/* Data Table */}
        <DataTable
          data={filteredLocations}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewContracts={handleViewContracts}
          loading={loading.locations}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

            {/* Modal */}
            {showModal && (
              <LocationModal
                item={editingItem}
                onClose={() => {
                  setShowModal(false)
                  setEditingItem(null)
                }}
                onSave={handleSave}
              />
            )}
          </>
        ) : (
          /* Contracts Tab */
          <LocationContracts 
            locationId={selectedLocation?.id} 
            locationName={selectedLocation?.name || 'Selectați o locație'} 
          />
        )}
      </div>
    </Layout>
  )
}

export default Locations
