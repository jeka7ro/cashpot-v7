import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import Layout from '../components/Layout'
import DataTable from '../components/DataTable'
import CompanyModal from '../components/modals/CompanyModal'
import { Building2, Plus, Search, Upload, Download } from 'lucide-react'

const Companies = () => {
  const { companies, createItem, updateItem, deleteItem, exportData, loading } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.license?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      label: 'Nume Companie',
      sortable: true,
      render: (item) => (
        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
          {item.name}
        </div>
      )
    },
    {
      key: 'license',
      label: 'Licență',
      sortable: true,
      render: (item) => (
        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
          {item.license}
        </span>
      )
    },
    {
      key: 'contactPerson',
      label: 'Contact',
      sortable: true,
      render: (item) => (
        <div className="text-slate-700 font-medium text-sm">
          {item.contactPerson}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (item) => (
        <div className="text-slate-600 text-sm font-mono">
          {item.email}
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Telefon',
      sortable: true,
      render: (item) => (
        <div className="text-slate-600 text-sm font-mono">
          {item.phone}
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
            : item.status === 'Suspendat'
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
    if (window.confirm(`Sigur doriți să ștergeți compania "${item.name}"?`)) {
      await deleteItem('companies', item.id)
    }
  }

  const handleSave = async (data) => {
    if (editingItem) {
      await updateItem('companies', editingItem.id, data)
    } else {
      await createItem('companies', data)
    }
    setShowModal(false)
    setEditingItem(null)
  }

  const handleExport = async () => {
    await exportData('companies', 'excel')
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
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg shadow-blue-500/25">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Management Companii</h2>
                <p className="text-slate-600">Gestionează companiile de gaming din sistem</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Caută companii..." 
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
                <span>Adaugă Companie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredCompanies}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading.companies}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Modal */}
        {showModal && (
          <CompanyModal
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

export default Companies
