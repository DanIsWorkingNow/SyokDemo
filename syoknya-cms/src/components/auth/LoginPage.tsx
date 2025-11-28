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
      setIsLoading(false);
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="healing-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 10 L25 20 L20 30 L15 20 Z" fill="currentColor" className="text-emerald-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#healing-pattern)" />
        </svg>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-6 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-800 mb-2">
            Syoknya Kaunseling
          </h1>
          <p className="text-slate-600 font-medium">Professional Counseling Services</p>
          <p className="text-sm text-slate-500 mt-2">Clinic Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-serif font-bold text-slate-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600">Sign in to access your workspace</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Authentication Failed</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@syoknya.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium py-3 px-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
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

          {/* Quick Login */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-4 font-medium text-center">Quick Access (Demo)</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => quickLogin('boss')}
                className="px-3 py-3 text-center text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200"
              >
                <div className="text-xl mb-1">👔</div>
                <div>Boss</div>
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-3 text-center text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
              >
                <div className="text-xl mb-1">🏥</div>
                <div>Admin</div>
              </button>
              <button
                onClick={() => quickLogin('counselor')}
                className="px-3 py-3 text-center text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
              >
                <div className="text-xl mb-1">💚</div>
                <div>Counselor</div>
              </button>
            </div>
          </div>

          {/* Demo Credentials Expandable */}
          <div className="mt-4">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer hover:text-slate-700 font-medium text-center">
                View all demo credentials →
              </summary>
              <div className="mt-4 space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Boss:</span>
                  <span className="font-mono text-slate-600">boss@syoknya.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Admin:</span>
                  <span className="font-mono text-slate-600">admin@syoknya.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Counselor:</span>
                  <span className="font-mono text-slate-600">sarah@syoknya.com</span>
                </div>
                <div className="pt-2 border-t border-slate-300 text-center">
                  <span className="text-slate-600">Password for all: </span>
                  <span className="font-mono font-medium text-slate-700">Boss123!@#</span>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-emerald-200">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-slate-700">
              Compliant with Lembaga Kaunselor Malaysia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}