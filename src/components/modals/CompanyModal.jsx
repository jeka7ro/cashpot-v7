import React, { useState, useEffect } from 'react'
import { X, Building2 } from 'lucide-react'

const CompanyModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    status: 'Activ',
    notes: ''
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        license: item.license || '',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || '',
        contactPerson: item.contactPerson || '',
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
        <div className="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 px-8 py-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                {item ? 'Editează Companie' : 'Adaugă Companie'}
              </h2>
              <p className="text-blue-100 text-sm font-medium">
                Completează informațiile despre companie
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
              {/* Company Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Nume Companie *
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: BRML Industries SRL"
                  required
                />
              </div>

              {/* License */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Număr Licență *
                </label>
                <input 
                  type="text" 
                  name="license" 
                  value={formData.license} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: L-2024-001"
                  required
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Persoană de Contact *
                </label>
                <input 
                  type="text" 
                  name="contactPerson" 
                  value={formData.contactPerson} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: Ion Popescu"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Email *
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: contact@brml.ro"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  Telefon *
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="ex: +40 21 123 4567"
                  required
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
                  <option value="Suspendat">Suspendat</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Adresă Completă *
              </label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                className="input-field min-h-[100px] resize-none" 
                placeholder="ex: Str. Centrală nr. 1, București, România"
                required
              />
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
                    placeholder="Informații suplimentare despre companie..."
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
                  {item ? 'Actualizează' : 'Adaugă'} Companie
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanyModal
