import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onLogin(formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CASHPOT V7</h1>
                <p className="text-sm text-gray-500">by Base44</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    'Log In'
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center">
                <a href="#" className="text-sm text-orange-600 hover:text-orange-500 font-medium">
                  Forgot Password?
                </a>
              </div>
            </form>

            {/* Terms and Conditions */}
            <div className="mt-8">
              <p className="text-xs text-gray-500 text-center">
                By clicking login you agree to the terms of the{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500 underline">
                  User Agreement
                </a>{' '}
                and the{' '}
                <a href="#" className="text-orange-600 hover:text-orange-500 underline">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Support */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact us at{' '}
                <a href="mailto:support@base44.com" className="text-orange-600 hover:text-orange-500">
                  support@base44.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Background Image */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white" />
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
};

export default LoginPage;
