import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Users,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

const AdminLayout = ({ title = 'Admin Portal', children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Left Sidebar */}
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-30 shrink-0 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0">
              C
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-tight">
                  Civix Admin
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Municipal Desk
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.route;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.route)}
                title={!isSidebarOpen ? item.label : undefined}
                className={`w-full min-h-11 flex items-center ${
                  isSidebarOpen ? 'justify-start' : 'justify-center'
                } gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Municipal Badge */}
        {isSidebarOpen && (
          <div className="p-3 m-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Verified Console</span>
              Role: Municipal Admin
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/notifications')}
              className={`p-2 rounded-xl transition-colors ${
                location.pathname === '/admin/notifications'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200/60 dark:border-rose-900/50 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
