import React, { useState } from 'react'
import { Edit, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react'

const DataTable = ({ 
  data, 
  columns, 
  onEdit, 
  onDelete, 
  onViewContracts,
  loading = false, 
  searchTerm = '', 
  onSearchChange,
  itemsPerPage = 15 
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...paginatedData].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString())
    } else {
      return bValue.toString().localeCompare(aValue.toString())
    }
  })

  if (loading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="table-header">
            <tr>
              <th className="p-6 w-12">
                <div className="flex items-center justify-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2" />
                </div>
              </th>
              <th className="text-left p-6 font-bold text-slate-700 text-sm uppercase tracking-wider w-16">#</th>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`text-left p-6 font-bold text-slate-700 text-sm uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {column.sortable && sortField === column.key && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-left p-6 font-bold text-slate-700 text-sm uppercase tracking-wider">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {sortedData.map((item, idx) => (
              <tr key={item._id || item.id} className="table-row">
                <td className="p-6">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 group-hover:bg-blue-50" />
                  </div>
                </td>
                <td className="p-6 text-slate-600 font-semibold text-sm">
                  {startIndex + idx + 1}
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="p-6">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onViewContracts) && (
                  <td className="p-6">
                    <div className="flex space-x-2">
                      {onViewContracts && (
                        <button 
                          onClick={() => onViewContracts(item)} 
                          className="p-3 text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-2xl shadow-lg hover:shadow-green-500/25 transition-all duration-200 group/btn"
                          title="Vezi contracte"
                        >
                          <FileText size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      )}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)} 
                          className="p-3 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 group/btn"
                          title="Editează"
                        >
                          <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(item)} 
                          className="p-3 text-red-600 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 rounded-2xl shadow-lg hover:shadow-red-500/25 transition-all duration-200 group/btn"
                          title="Șterge"
                        >
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 px-6 md:px-8 py-4 md:py-6 border-t border-slate-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <span className="text-sm md:text-base font-semibold text-slate-700">Înregistrări:</span>
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }} 
            className="border-2 border-slate-200 rounded-2xl px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg"
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm md:text-base text-slate-600 font-medium">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} din {data.length}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1} 
            className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-200 rounded-2xl text-sm md:text-base font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">Înapoi</span>
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-sm md:text-base text-slate-600 font-bold bg-white/80 px-4 py-2 rounded-2xl shadow-lg">
              Pag {currentPage}/{totalPages || 1}
            </span>
          </div>
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage === totalPages} 
            className="px-4 md:px-6 py-2 md:py-3 border-2 border-slate-200 rounded-2xl text-sm md:text-base font-bold hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-block">Înainte</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
