import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://cashpot-v7-backend.onrender.com'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  // State for all entities
  const [companies, setCompanies] = useState([])
  const [locations, setLocations] = useState([])
  const [providers, setProviders] = useState([])
  const [cabinets, setCabinets] = useState([])
  const [gameMixes, setGameMixes] = useState([])
  const [slots, setSlots] = useState([])
  const [warehouse, setWarehouse] = useState([])
  const [metrology, setMetrology] = useState([])
  const [jackpots, setJackpots] = useState([])
  const [invoices, setInvoices] = useState([])
  const [onjnReports, setOnjnReports] = useState([])
  const [legalDocuments, setLegalDocuments] = useState([])
  const [users, setUsers] = useState([])

  // Loading states
  const [loading, setLoading] = useState({
    companies: false,
    locations: false,
    providers: false,
    cabinets: false,
    gameMixes: false,
    slots: false,
    warehouse: false,
    metrology: false,
    jackpots: false,
    invoices: false,
    onjnReports: false,
    legalDocuments: false,
    users: false
  })

  // Statistics
  const [statistics, setStatistics] = useState({
    totalCompanies: 0,
    totalLocations: 0,
    totalProviders: 0,
    totalCabinets: 0,
    totalGameMixes: 0,
    totalSlots: 0,
    totalWarehouse: 0,
    totalMetrology: 0,
    totalJackpots: 0,
    totalInvoices: 0,
    totalOnjnReports: 0,
    totalLegalDocuments: 0,
    totalUsers: 0
  })

  // Generic CRUD operations
  const createItem = async (entity, data) => {
    try {
      setLoading(prev => ({ ...prev, [entity]: true }))
      const response = await axios.post(`/api/${entity}`, data)
      
      // Update local state
      const setter = getSetter(entity)
      setter(prev => [...prev, response.data])
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        [`total${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: prev[`total${entity.charAt(0).toUpperCase() + entity.slice(1)}`] + 1
      }))
      
      toast.success(`${entity.charAt(0).toUpperCase() + entity.slice(1)} creat cu succes!`)
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || `Eroare la crearea ${entity}`
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(prev => ({ ...prev, [entity]: false }))
    }
  }

  const updateItem = async (entity, id, data) => {
    try {
      setLoading(prev => ({ ...prev, [entity]: true }))
      const response = await axios.put(`/api/${entity}/${id}`, data)
      
      // Update local state
      const setter = getSetter(entity)
      setter(prev => prev.map(item => item.id === id ? response.data : item))
      
      toast.success(`${entity.charAt(0).toUpperCase() + entity.slice(1)} actualizat cu succes!`)
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || `Eroare la actualizarea ${entity}`
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(prev => ({ ...prev, [entity]: false }))
    }
  }

  const deleteItem = async (entity, id) => {
    try {
      setLoading(prev => ({ ...prev, [entity]: true }))
      await axios.delete(`/api/${entity}/${id}`)
      
      // Update local state
      const setter = getSetter(entity)
      setter(prev => prev.filter(item => item.id !== id))
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        [`total${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: prev[`total${entity.charAt(0).toUpperCase() + entity.slice(1)}`] - 1
      }))
      
      toast.success(`${entity.charAt(0).toUpperCase() + entity.slice(1)} șters cu succes!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || `Eroare la ștergerea ${entity}`
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(prev => ({ ...prev, [entity]: false }))
    }
  }

  const fetchItems = async (entity) => {
    try {
      setLoading(prev => ({ ...prev, [entity]: true }))
      const response = await axios.get(`/api/${entity}`)
      
      // Update local state
      const setter = getSetter(entity)
      setter(response.data)
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        [`total${entity.charAt(0).toUpperCase() + entity.slice(1)}`]: response.data.length
      }))
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error(`Error fetching ${entity}:`, error)
      return { success: false, error: error.message }
    } finally {
      setLoading(prev => ({ ...prev, [entity]: false }))
    }
  }

  const getSetter = (entity) => {
    const setters = {
      companies: setCompanies,
      locations: setLocations,
      providers: setProviders,
      cabinets: setCabinets,
      gameMixes: setGameMixes,
      slots: setSlots,
      warehouse: setWarehouse,
      metrology: setMetrology,
      jackpots: setJackpots,
      invoices: setInvoices,
      onjnReports: setOnjnReports,
      legalDocuments: setLegalDocuments,
      users: setUsers
    }
    return setters[entity]
  }

  const getData = (entity) => {
    const data = {
      companies,
      locations,
      providers,
      cabinets,
      gameMixes,
      slots,
      warehouse,
      metrology,
      jackpots,
      invoices,
      onjnReports,
      legalDocuments,
      users
    }
    return data[entity] || []
  }

  const getLoading = (entity) => {
    return loading[entity] || false
  }

  // File upload
  const uploadFile = async (file, entity, itemId) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('entity', entity)
      formData.append('itemId', itemId)

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Fișier încărcat cu succes!')
      return { success: true, data: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Eroare la încărcarea fișierului'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Export data
  const exportData = async (entity, format = 'excel') => {
    try {
      const response = await axios.get(`/api/${entity}/export?format=${format}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${entity}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Date exportate cu succes!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Eroare la exportarea datelor'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      const entities = [
        'companies', 'locations', 'providers', 'cabinets', 
        'gameMixes', 'slots', 'warehouse', 'metrology', 
        'jackpots', 'invoices', 'onjnReports', 'legalDocuments', 'users'
      ]

      await Promise.all(entities.map(entity => fetchItems(entity)))
    }

    loadAllData()
  }, [])

  const value = {
    // Data
    companies,
    locations,
    providers,
    cabinets,
    gameMixes,
    slots,
    warehouse,
    metrology,
    jackpots,
    invoices,
    onjnReports,
    legalDocuments,
    users,
    
    // Statistics
    statistics,
    
    // Loading states
    loading,
    
    // CRUD operations
    createItem,
    updateItem,
    deleteItem,
    fetchItems,
    
    // Utilities
    getData,
    getLoading,
    uploadFile,
    exportData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
