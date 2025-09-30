import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Settings as SettingsIcon, Save, RefreshCw, Palette, Globe, Shield, User, Bell } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [settings, setSettings] = useState({
    appName: 'CASHPOT V7',
    appSubtitle: 'Gaming Management System',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    accentColor: '#F59E0B',
    logoUrl: '',
    companyName: 'CASHPOT V7',
    companyAddress: 'București, România',
    companyPhone: '+40 123 456 789',
    companyEmail: 'contact@cashpot-v7.com',
    enableNotifications: true,
    enableDarkMode: false,
    language: 'ro',
    timezone: 'Europe/Bucharest',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings))
      
      // Apply theme changes
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor)
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor)
      document.documentElement.style.setProperty('--accent-color', settings.accentColor)
      
      toast.success('Setările au fost salvate cu succes!')
    } catch (error) {
      toast.error('Eroare la salvarea setărilor!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    const defaultSettings = {
      appName: 'CASHPOT V7',
      appSubtitle: 'Gaming Management System',
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      accentColor: '#F59E0B',
      logoUrl: '',
      companyName: 'CASHPOT V7',
      companyAddress: 'București, România',
      companyPhone: '+40 123 456 789',
      companyEmail: 'contact@cashpot-v7.com',
      enableNotifications: true,
      enableDarkMode: false,
      language: 'ro',
      timezone: 'Europe/Bucharest',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
    setSettings(defaultSettings)
    toast.success('Setările au fost resetate la valorile implicite!')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Aspect', icon: Palette },
    { id: 'company', label: 'Companie', icon: Globe },
    { id: 'notifications', label: 'Notificări', icon: Bell },
    { id: 'security', label: 'Securitate', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Setări</h1>
              <p className="text-slate-600">Configurează aplicația conform nevoilor tale</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Setări Generale</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nume Aplicație
                      </label>
                      <input
                        type="text"
                        name="appName"
                        value={settings.appName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subtitlu
                      </label>
                      <input
                        type="text"
                        name="appSubtitle"
                        value={settings.appSubtitle}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Limbă
                      </label>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="ro">Română</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Fus Orar
                      </label>
                      <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Europe/Bucharest">Europa/București</option>
                        <option value="Europe/London">Europa/Londra</option>
                        <option value="America/New_York">America/New York</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Aspect și Culori</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Culoare Principală
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          name="primaryColor"
                          value={settings.primaryColor}
                          onChange={handleChange}
                          className="w-12 h-12 border border-slate-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Culoare Secundară
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          name="secondaryColor"
                          value={settings.secondaryColor}
                          onChange={handleChange}
                          className="w-12 h-12 border border-slate-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Culoare Accent
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          name="accentColor"
                          value={settings.accentColor}
                          onChange={handleChange}
                          className="w-12 h-12 border border-slate-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="enableDarkMode"
                        checked={settings.enableDarkMode}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Activează modul întunecat</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Informații Companie</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nume Companie
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={settings.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="companyEmail"
                        value={settings.companyEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        name="companyPhone"
                        value={settings.companyPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Adresă
                      </label>
                      <input
                        type="text"
                        name="companyAddress"
                        value={settings.companyAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Notificări</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-slate-900">Notificări Browser</h3>
                        <p className="text-sm text-slate-600">Primește notificări în browser pentru evenimente importante</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableNotifications"
                          checked={settings.enableNotifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Securitate</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-medium text-slate-900 mb-2">Schimbă Parola</h3>
                      <p className="text-sm text-slate-600 mb-4">Pentru a schimba parola, contactează administratorul sistemului.</p>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Contactează Administrator
                      </button>
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h3 className="font-medium text-slate-900 mb-2">Sesiuni Active</h3>
                      <p className="text-sm text-slate-600 mb-4">Gestionează sesiunile active ale contului tău.</p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Deconectează Toate Sesiunile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Resetează
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Se salvează...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Salvează Setările
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
