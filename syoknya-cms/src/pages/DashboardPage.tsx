import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalClients: number;
  todayAppointments: number;
  activeSessions: number;
  pendingActions: number;
}

export function DashboardPage() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    todayAppointments: 0,
    activeSessions: 0,
    pendingActions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  async function loadDashboardData() {
    try {
      // Get total active clients
      const { count: clientCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: appointmentCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('datetime', `${today}T00:00:00`)
        .lte('datetime', `${today}T23:59:59`);

      setStats({
        totalClients: clientCount || 0,
        todayAppointments: appointmentCount || 0,
        activeSessions: 42, // This would come from a sessions table
        pendingActions: 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  const roleConfig = {
    boss: {
      title: 'Executive Overview',
      subtitle: 'Complete system insights and performance metrics',
      gradient: 'from-purple-50 to-pink-50',
      accent: 'purple',
      icon: '👔',
    },
    admin: {
      title: 'Operations Hub',
      subtitle: 'Manage appointments, clients, and daily operations',
      gradient: 'from-blue-50 to-teal-50',
      accent: 'blue',
      icon: '🏥',
    },
    counselor: {
      title: 'Client Care Center',
      subtitle: 'Your sessions, notes, and client wellness',
      gradient: 'from-emerald-50 to-teal-50',
      accent: 'emerald',
      icon: '💚',
    },
  };

  const config = roleConfig[user.profile.role];
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const menuItems = [
    { icon: '👥', label: 'Clients', path: '/clients', roles: ['boss', 'admin', 'counselor'], description: 'Manage client profiles' },
    { icon: '📅', label: 'Appointments', path: '/appointments', roles: ['boss', 'admin', 'counselor'], description: 'Schedule & view sessions' },
    { icon: '📝', label: 'Case Notes', path: '/case-notes', roles: ['counselor'], description: 'Secure session documentation' },
    { icon: '👨‍⚕️', label: 'Counselors', path: '/counselors', roles: ['boss', 'admin'], description: 'Team management' },
    { icon: '💰', label: 'Payments', path: '/payments', roles: ['boss', 'admin'], description: 'Financial tracking' },
    { icon: '📊', label: 'Reports', path: '/reports', roles: ['boss', 'admin'], description: 'Analytics & insights' },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(user.profile.role)
  );

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50/20">
      {/* Professional Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Clinic Branding */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-slate-800">
                  Syoknya Kaunseling
                </h1>
                <p className="text-xs text-slate-500">Professional Counseling Services</p>
              </div>
            </div>
            
            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-800">
                  {user.profile.full_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user.profile.role === 'counselor' ? 'Counselor' : user.profile.role}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        {/* Welcome Section */}
        <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-8 mb-8 border border-white/50 shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                {greeting}, {user.profile.full_name.split(' ')[0]} {config.icon}
              </p>
              <h2 className="text-3xl font-serif font-bold text-slate-800 mb-2">
                {config.title}
              </h2>
              <p className="text-slate-600">
                {config.subtitle}
              </p>
            </div>
            <div className="hidden md:block text-6xl opacity-20">
              {config.icon}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Clients */}
          <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Active Clients</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {loading ? '...' : stats.totalClients}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Steady growth</span>
            </div>
          </div>

          {/* Today's Sessions */}
          <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Today's Sessions</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {loading ? '...' : stats.todayAppointments}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Next at 10:00 AM</span>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Ongoing Care</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {stats.activeSessions}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>Treatment progress</span>
            </div>
          </div>

          {/* Wellness Score */}
          <div className="bg-white rounded-xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">Wellness Score</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  94%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-teal-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Client satisfaction</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-slate-800">
                Today's Schedule
              </h3>
              <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                View All →
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats.todayAppointments === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌿</div>
                <p className="text-slate-600 mb-2">No sessions scheduled today</p>
                <p className="text-sm text-slate-500">Enjoy your day or catch up on documentation</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-emerald-100 rounded-lg hover:bg-emerald-50/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-emerald-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-emerald-700">10:00</span>
                      <span className="text-xs text-emerald-600">AM</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Individual Therapy Session</p>
                    <p className="text-sm text-slate-600">Client: Ahmad bin Abdullah • Room 2</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Online</span>
                      <span className="text-xs text-slate-500">60 min</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors">
                    Start Session
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-slate-800 mb-6">
              Quick Access
            </h3>
            <div className="space-y-3">
              {visibleMenuItems.slice(0, 5).map((item) => (
                <button
                  key={item.path}
                  className="w-full flex items-center gap-3 p-3 text-left border border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 group-hover:text-emerald-700">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800">
                System Status: All Services Operational
              </p>
              <p className="text-sm text-slate-600">
                Secure connection • Data encrypted • Compliant with Lembaga Kaunselor Malaysia
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}