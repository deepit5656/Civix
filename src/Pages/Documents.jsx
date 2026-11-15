import React, { useEffect, useState } from 'react';
import { Search, Filter, Upload, Download, Eye, Edit, Trash2, FileText, Calendar, User, Tag, Plus, MoreHorizontal, Home, BarChart3, Bell, Settings, ChevronRight, ChevronLeft, Users } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";

const DocumentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/documents');

  const defaultDocuments = [
    { id: 1, name: 'Budget Proposal 2024', category: 'Finance', status: 'approved', date: '2024-01-15', author: 'John Smith', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'Policy Update Draft', category: 'Policy', status: 'pending', date: '2024-01-12', author: 'Sarah Johnson', size: '1.8 MB', type: 'DOCX' },
    { id: 3, name: 'Meeting Minutes - Q1', category: 'Meeting', status: 'published', date: '2024-01-10', author: 'Mike Wilson', size: '654 KB', type: 'PDF' },
    { id: 4, name: 'Strategic Plan 2024-2026', category: 'Planning', status: 'draft', date: '2024-01-08', author: 'Emily Davis', size: '3.2 MB', type: 'PDF' },
    { id: 5, name: 'Compliance Report', category: 'Legal', status: 'approved', date: '2024-01-05', author: 'Robert Brown', size: '1.1 MB', type: 'DOCX' },
    { id: 6, name: 'Community Feedback Summary', category: 'Community', status: 'published', date: '2024-01-03', author: 'Lisa Chen', size: '890 KB', type: 'PDF' }
  ];
  const [documents, setDocuments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('civix-admin-documents') || 'null') || defaultDocuments;
    } catch {
      return defaultDocuments;
    }
  });

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const categories = ['all', 'Finance', 'Policy', 'Meeting', 'Planning', 'Legal', 'Community'];
  const statuses = ['all', 'draft', 'pending', 'approved', 'published'];

  useEffect(() => {
    localStorage.setItem('civix-admin-documents', JSON.stringify(documents));
  }, [documents]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const newDocument = {
      id: `local-${Date.now()}`,
      name: file.name,
      category: 'Community',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      author: 'Municipal Admin',
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      url: URL.createObjectURL(file),
    };
    setDocuments((current) => [newDocument, ...current]);
    event.target.value = '';
  };

  const handleDownload = (document) => {
    const link = window.document.createElement('a');
    link.href = document.url || `data:text/plain;charset=utf-8,${encodeURIComponent(document.name)}`;
    link.download = document.name;
    link.click();
  };

  const handleDelete = (documentId) => {
    setDocuments((current) => current.filter((document) => document.id !== documentId));
    setSelectedDocuments((current) => current.filter((id) => id !== documentId));
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      published: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    };
    return colors[status] || colors.draft;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  return (
    <AdminLayout title="Documents & Municipal Archives">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Documents Repository</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage public governance circulars, legal drafts, and meeting minutes</p>
          </div>
          <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-sm flex items-center font-semibold text-sm transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2" /> Upload Document
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Documents', value: '156', color: 'emerald' },
            { label: 'Pending Review', value: '8', color: 'yellow' },
            { label: 'Approved', value: '142', color: 'green' },
            { label: 'Storage Used', value: '2.8 GB', color: 'cyan' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gradient-to-tr from-green-100 to-green-50 rounded-xl p-6 shadow border border-green-100"
            >
              <p className="text-green-700 text-xs font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow border border-green-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-green-100 rounded-lg bg-green-50 text-emerald-900 focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-green-100 rounded-lg bg-green-50 text-emerald-900 focus:ring-2 focus:ring-emerald-300"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-green-100 rounded-lg bg-green-50 text-emerald-900 focus:ring-2 focus:ring-emerald-300"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 border border-green-100 rounded-lg hover:bg-green-100 flex items-center gap-2 text-green-800">
              <Filter size={20} /> More Filters
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-xl shadow border border-green-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                  onChange={selectAllDocuments}
                  className="w-4 h-4 accent-green-600 border-green-200 rounded"
                />
                <span className="text-sm font-medium text-green-800">
                  {selectedDocuments.length > 0
                    ? `${selectedDocuments.length} selected`
                    : 'Select all'}
                </span>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectedDocuments.forEach((id) => handleDownload(documents.find((document) => document.id === id)))}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-900 text-white rounded text-sm"
                  >Download</button>
                  <button
                    onClick={() => selectedDocuments.forEach(handleDelete)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >Delete</button>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-green-700">Size</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-green-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-50">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-green-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => toggleDocumentSelection(doc.id)}
                          className="w-4 h-4 accent-green-600 border-green-200 rounded mr-4"
                        />
                        <FileText className="text-green-400 mr-3" size={20} />
                        <div>
                          <div className="text-sm font-medium text-green-900">{doc.name}</div>
                          <div className="text-xs text-green-700">{doc.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Tag size={12} className="mr-1" />{doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={16} className="text-green-400 mr-2" />
                        <span className="text-sm text-green-900">{doc.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-green-400 mr-2" />
                        <span className="text-sm text-green-900">{doc.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-emerald-700 hover:text-emerald-900">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDownload(doc)} className="text-green-600 hover:text-green-700" title="Download document">
                          <Download size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800" title="Delete document">
                          <Trash2 size={16} />
                        </button>
                        <button className="text-green-400 hover:text-green-700">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paging controls */}
          <div className="px-6 py-4 border-t border-green-100 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-700">
                Showing {filteredDocuments.length} of {documents.length} documents
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-green-200 rounded bg-green-50 hover:bg-green-100 text-green-800 text-sm">Previous</button>
                <button className="px-3 py-1 bg-emerald-700 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-green-200 rounded bg-green-50 hover:bg-green-100 text-green-800 text-sm">2</button>
                <button className="px-3 py-1 border border-green-200 rounded bg-green-50 hover:bg-green-100 text-green-800 text-sm">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DocumentsPage;
