import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate({ to: '/dashboard' });
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Invalid email or password');
      setIsLoading(false);
    } else {
      // Navigation will be handled by useEffect when user changes
      setIsLoading(false);
    }
  }

  // Quick login helpers for demo accounts
  const quickLogin = (role: 'boss' | 'admin' | 'counselor') => {
    const credentials = {
      boss: { email: 'boss@syoknya.com', password: 'Boss123!@#' },
      admin: { email: 'admin@syoknya.com', password: 'Admin123!@#' },
      counselor: { email: 'sarah@syoknya.com', password: 'Sarah123!@#' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Syoknya Kaunseling
          </h1>
          <p className="text-gray-600">Clinic Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Sign in failed</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick Login (Demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('boss')}
                className="px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
              >
                👑 Boss
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                🛠️ Admin
              </button>
              <button
                onClick={() => quickLogin('counselor')}
                className="px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition"
              >
                💼 Counselor
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700 font-medium">
                View all test credentials
              </summary>
              <div className="mt-3 space-y-2">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">Boss Account:</div>
                  <div className="font-mono">boss@syoknya.com / Boss123!@#</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">Admin Account:</div>
                  <div className="font-mono">admin@syoknya.com / Admin123!@#</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">Counselor (Sarah):</div>
                  <div className="font-mono">sarah@syoknya.com / Sarah123!@#</div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-700">Counselor (Ahmad):</div>
                  <div className="font-mono">ahmad@syoknya.com / Ahmad123!@#</div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Lembaga Kaunselor Malaysia Compliant
        </p>
      </div>
    </div>
  );
}
