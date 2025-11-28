import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const roleConfig = {
    boss: {
      title: 'Boss Dashboard',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      greeting: 'Complete System Overview',
    },
    admin: {
      title: 'Admin Dashboard',
      color: 'from-blue-500 to-teal-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      greeting: 'Manage Operations',
    },
    counselor: {
      title: 'Counselor Dashboard',
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      greeting: 'Your Clients & Sessions',
    },
  };

  const config = roleConfig[user.profile.role];

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard', roles: ['boss', 'admin', 'counselor'] },
    { icon: '👥', label: 'Clients', path: '/clients', roles: ['boss', 'admin', 'counselor'] },
    { icon: '📅', label: 'Appointments', path: '/appointments', roles: ['boss', 'admin', 'counselor'] },
    { icon: '📝', label: 'Case Notes', path: '/case-notes', roles: ['counselor'] },
    { icon: '👨‍⚕️', label: 'Counselors', path: '/counselors', roles: ['boss', 'admin'] },
    { icon: '💰', label: 'Payments', path: '/payments', roles: ['boss', 'admin'] },
    { icon: '⚙️', label: 'Settings', path: '/settings', roles: ['boss', 'admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(user.profile.role)
  );

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-gray-900">
                  Syoknya Kaunseling
                </h1>
                <p className="text-xs text-gray-500">{config.greeting}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.profile.full_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.profile.role}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className={`bg-gradient-to-br ${config.color} rounded-2xl p-8 text-white mb-8 shadow-xl`}>
          <h2 className="text-3xl font-serif font-bold mb-2">
            Welcome back, {user.profile.full_name}! 👋
          </h2>
          <p className="text-white/90 text-lg">
            {config.title} - {config.greeting}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">1,247</p>
                <p className="text-xs text-gray-500 mt-1">↑ 12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                <p className="text-xs text-gray-500 mt-1">3 completed, 5 pending</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">42</p>
                <p className="text-xs text-gray-500 mt-1">Across all counselors</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {visibleMenuItems.map((item) => (
              <button
                key={item.path}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition text-xl">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-serif font-bold text-green-900 mb-1">
                System Status: All Systems Operational ✅
              </h4>
              <p className="text-sm text-green-700">
                ✓ Database Connected • ✓ Authentication Active • ✓ Backup Running • ✓ Last Updated: Just now
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
