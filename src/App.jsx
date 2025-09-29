import './App.css'
import React, { useState, useEffect } from 'react';
import Pages from "@/pages/index.jsx"
import LoginPage from "./components/LoginPage.jsx"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Auth } from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      Auth.getCurrentUser()
        .then(userData => {
          setUser(userData.user);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">🏦 CASHPOT V7</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Left side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏦</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CASHPOT V7</h1>
                  <p className="text-sm text-gray-500">Gaming Management System</p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await Auth.login('admin', 'admin123');
                  setUser(response.user);
                } catch (error) {
                  console.error('Login failed:', error);
                  alert('Login failed. Please check your credentials.');
                }
              }} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    defaultValue="admin"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    defaultValue="admin123"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter password"
                  />
                </div>

                {/* Login Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                  >
                    Log In
                  </button>
                </div>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
                <p className="text-xs text-gray-500">Admin: admin / admin123</p>
                <p className="text-xs text-gray-500">User: test / test123</p>
              </div>

                  {/* Backend Info */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500">Backend: Render API</p>
                    <p className="text-xs text-gray-500">Database: MongoDB Cloud</p>
                    <p className="text-xs text-green-600">Status: Online ✔</p>
                  </div>

                  {/* Version Info */}
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold">Version Info:</p>
                    <p className="text-xs text-gray-500">Build: {new Date().toLocaleString('ro-RO', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}</p>
                    <p className="text-xs text-gray-500">Version: 7.0.0</p>
                  </div>
            </div>
          </div>
        </div>

        {/* Right side - Background */}
        <div className="hidden lg:block lg:flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-32 h-32 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🎰</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">Welcome to CASHPOT V7</h3>
                <p className="text-xl opacity-90">
                  Your complete gaming management solution
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="font-semibold">🎰 Slot Machines</div>
                    <div className="opacity-80">Manage gaming devices</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="font-semibold">📊 Metrology</div>
                    <div className="opacity-80">Documentation & compliance</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="font-semibold">🏢 Companies</div>
                    <div className="opacity-80">Business management</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="font-semibold">📍 Locations</div>
                    <div className="opacity-80">Site management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="cashpot-ui-theme">
      <Pages />
      <Toaster />
    </ThemeProvider>
  )
}

export default App 