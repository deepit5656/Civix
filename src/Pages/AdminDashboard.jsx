import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { issuesAPI } from "../utils/api";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const fetchIssues = React.useCallback(async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const res = await issuesAPI.getAll({ limit: 100 });
      const issueList = Array.isArray(res) ? res : (res?.issues || []);
      setIssues(issueList);
      if (showToast) toast.success("Live issues loaded from database");
    } catch (err) {
      console.error("Error fetching live issues:", err);
      toast.error("Failed to fetch live issues from server");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const filteredIssues = issues.filter(issue => {
    const titleMatch = (issue.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (issue.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = (issue.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || descMatch || locationMatch;
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => (i.status || "Pending") === "Pending").length,
    inProgress: issues.filter(i => i.status === "In Progress").length,
    resolved: issues.filter(i => i.status === "Resolved").length,
    rejected: issues.filter(i => i.status === "Rejected").length
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issuesAPI.updateStatus(issueId, { newStatus, status: newStatus });
      setIssues(prev => 
        prev.map(issue => 
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      toast.success(`Issue status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.message || "Failed to update status on server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-30 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            {isSidebarOpen && <span className="font-extrabold text-slate-900 dark:text-white text-base">Civix Admin</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {sidebarMenu.map((item) => {
            const Icon = item.icon;
            const isActive = item.route === '/admin/dashboard';
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/notifications")} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-300 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Bell className="w-4 h-4" />
            </button>
            <button onClick={() => navigate("/login")} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Issues</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-600 font-semibold">Pending Review</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-500 text-white rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-600 font-semibold">In Progress</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-indigo-600 text-white rounded-xl">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 font-semibold">Resolved Issues</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-emerald-600 text-white rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <button
              onClick={fetchIssues}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </button>
          </div>

          {/* Issue Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reported Issues ({filteredIssues.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] uppercase font-bold text-slate-400">
                    <th className="p-4">Issue Details</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredIssues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{issue.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 line-clamp-1">{issue.description}</p>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">
                        <p className="font-medium">{issue.email}</p>
                        <p className="text-[11px] text-slate-400">{issue.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                          {issue.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          issue.status === "Resolved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" :
                          issue.status === "In Progress" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          className="py-1 px-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
