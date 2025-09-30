import React, { useState, useEffect } from 'react'
import { X, Gamepad2 } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

const CabinetModal = ({ item, onClose, onSave }) => {
  const { locations, gameMixes } = useData()
  const [formData, setFormData] = useState({
    cabinetId: '',
    location: '',
    game: '',
    serialNumber: '',
    lastMaintenance: '',
    status: 'Activ',
    notes: ''
  })

  useEffect(() => {
    if (item) {
      setFormData({
        cabinetId: item.cabinetId || '',
        location: item.location || '',
        game: item.game || '',
        serialNumber: item.serialNumber || '',
        lastMaintenance: item.lastMaintenance || '',
        status: item.status || 'Activ',
        notes: item.notes || ''
      })
    }
  }, [item])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl shadow-slate-500/20 border border-white/30">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 px-8 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {item ? 'Editează Cabinet' : 'Adaugă Cabinet'}
              </h2>
              <p className="text-purple-100 text-sm font-medium">
                Completează informațiile despre cabinet
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 text-white hover:bg-white/20 rounded-2xl p-3 transition-all duration-200 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cabinet ID */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  ID Cabinet *
                </label>
                <input 
                  type="text" 
                  name="cabinetId" 
                  value={formData.cabinetId} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: CAB-001"
                  required
                />
              </div>

              {/* Serial Number */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Număr Serial *
                </label>
                <input 
                  type="text" 
                  name="serialNumber" 
                  value={formData.serialNumber} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: SN123456789"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Locație *
                </label>
                <select 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  className="input-field" 
                  required
                >
                  <option value="">Selectează o locație</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Joc *
                </label>
                <select 
                  name="game" 
                  value={formData.game} 
                  onChange={handleChange} 
                  className="input-field" 
                  required
                >
                  <option value="">Selectează un joc</option>
                  {gameMixes.map(game => (
                    <option key={game.id} value={game.mixName}>
                      {game.mixName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Last Maintenance */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Ultima Întreținere
                </label>
                <input 
                  type="date" 
                  name="lastMaintenance" 
                  value={formData.lastMaintenance} 
                  onChange={handleChange} 
                  className="input-field" 
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Status
                </label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange} 
                  className="input-field"
                >
                  <option value="Activ">Activ</option>
                  <option value="Inactiv">Inactiv</option>
                  <option value="Mentenanță">Mentenanță</option>
                  <option value="Defect">Defect</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Note Adiționale
              </label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                className="input-field min-h-[80px] resize-none" 
                placeholder="Informații suplimentare despre cabinet..."
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t-2 border-slate-200/50 mt-8">
              <button 
                type="button"
                onClick={onClose} 
                className="btn-secondary group"
              >
                <span className="group-hover:-translate-x-1 transition-transform inline-block">Anulează</span>
              </button>
              <button 
                type="submit" 
                className="btn-primary group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {item ? 'Actualizează' : 'Adaugă'} Cabinet
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CabinetModal
