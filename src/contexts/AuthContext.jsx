import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://cashpot-v7-backend.onrender.com'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // For demo purposes, if token exists, set user directly
          const mockUser = {
            id: '1',
            username: 'admin',
            email: 'admin@cashpot-v7.com',
            fullName: 'Administrator Sistem',
            role: 'admin',
            status: 'active',
            lastLogin: new Date().toISOString()
          }
          setUser(mockUser)
        } catch (error) {
          console.error('Auth verification failed:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

  const login = async (username, password, rememberMe = false) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/login', {
        username,
        password
      })

      const { token: newToken, user: userData } = response.data
      
      // Store token based on rememberMe preference
      if (rememberMe) {
        localStorage.setItem('token', newToken)
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('token', newToken)
        localStorage.removeItem('rememberMe')
      }
      
      setToken(newToken)
      setUser(userData)
      
      toast.success(`Bun venit, ${userData.fullName}!`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Eroare la autentificare'
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('rememberMe')
    sessionStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
    toast.success('V-ați deconectat cu succes!')
  }

  const updateUser = (userData) => {
    setUser(userData)
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
