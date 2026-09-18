import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlusCircle,
  Search,
  RefreshCw,
  FileText,
  Tag,
  ExternalLink,
  MessageSquare,
  ImageIcon,
} from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { issuesAPI } from "../utils/api";
import { toast } from "react-hot-toast";
import SectionGuide from "../components/ui/SectionGuide";

const MyComplaints = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchMyComplaints = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      else setIsLoading(true);

      const data = await issuesAPI.getMyIssues();
      setComplaints(Array.isArray(data) ? data : []);
      if (showToast) {
        toast.success("Complaints refreshed successfully");
      }
    } catch (error) {
      console.error("Error fetching user complaints:", error);
      toast.error("Failed to load your complaints. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyComplaints();
  }, [fetchMyComplaints]);

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/user/dashboard");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Recently";
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    switch (s) {
      case "pending":
        return {
          label: "Pending",
          className: "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
          icon: Clock,
          dotColor: "bg-amber-500",
        };
      case "in progress":
        return {
          label: "In Progress",
          className: "bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800",
          icon: RefreshCw,
          dotColor: "bg-blue-500",
        };
      case "resolved":
        return {
          label: "Resolved",
          className: "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
          icon: CheckCircle2,
          dotColor: "bg-emerald-500",
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800",
          icon: XCircle,
          dotColor: "bg-rose-500",
        };
      default:
        return {
          label: status || "Submitted",
          className: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700",
          icon: AlertCircle,
          dotColor: "bg-gray-500",
        };
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter = filter === "All" || (c.status || "Pending").toLowerCase() === filter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (c.title && c.title.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      (c.location && c.location.toLowerCase().includes(query)) ||
      (c.category && c.category.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-green-50/50 dark:from-gray-950 dark:via-emerald-950/30 dark:to-gray-900 relative pb-16">
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation & Header Actions Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchMyComplaints(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-gray-800 shadow-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-all"
              title="Refresh complaints"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/report-issue")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-2xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>
        </div>

        {/* Page Title Card */}
        <div className="text-center mb-8">
          <div className="inline-block px-8 py-6 rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-emerald-200/50 dark:border-emerald-900/40 shadow-xl backdrop-blur-xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-300 dark:to-teal-300 bg-clip-text text-transparent mb-2 tracking-tight">
              My Complaints
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg font-medium">
              Track the status, updates, and progress of your submitted civic issues
            </p>
          </div>
        </div>

        {/* Section Guide */}
        <SectionGuide
          title="Citizen Complaints Status & Lifecycle Tracker"
          purpose="This dashboard displays all complaints and civic tickets submitted by your verified account. It allows you to monitor municipal department actions, view stage progressions (Pending → In Progress → Resolved), inspect submitted photos, and review remarks from city field officers."
          steps={[
            "Filter tickets by status using the tabs (All, Pending, In Progress, Resolved, Rejected).",
            "Use the search box to find complaints by keyword, location, or issue description.",
            "Click on any complaint card to view complete submission details, date stamps, and photos.",
            "Click 'Refresh' anytime to fetch real-time updates directly from the municipal database.",
            "If an issue has not yet been filed, click '+ Report New Issue' to submit a new ticket."
          ]}
          source="Civix Real-time Citizen Redressal Database"
          scope="Account-Specific Civic Tickets (Associated with your registered Email and User ID)"
          category="Citizen History & Status"
        />

        {/* Search & Filter Controls */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-slate-200/80 dark:border-gray-800 rounded-3xl p-4 sm:p-5 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, description, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["All", "Pending", "In Progress", "Resolved", "Rejected"].map((statusOption) => {
                const isActive = filter === statusOption;
                return (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => setFilter(statusOption)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {statusOption}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">Loading your complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/70 dark:bg-gray-900/70 border border-slate-200/60 dark:border-gray-800 rounded-3xl shadow-xl backdrop-blur-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {complaints.length === 0 ? "No Complaints Submitted Yet" : "No Matching Complaints"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 text-base">
              {complaints.length === 0
                ? "You haven't submitted any civic issues or complaints yet. Click below to file your first complaint!"
                : "No complaints found matching your active filter criteria. Try clearing the filter or search keyword."}
            </p>
            {complaints.length === 0 ? (
              <button
                type="button"
                onClick={() => navigate("/report-issue")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                <span>File a Complaint</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setFilter("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map((issue) => {
              const badge = getStatusBadge(issue.status);
              const BadgeIcon = badge.icon;
              const issueId = issue._id ? String(issue._id).slice(-6).toUpperCase() : "N/A";

              return (
                <div
                  key={issue._id || issue.id || Math.random()}
                  className="group relative bg-white/90 dark:bg-gray-900/90 border border-slate-200/80 dark:border-gray-800/80 shadow-md hover:shadow-xl rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Top Bar: Date, Category, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{formatDate(issue.createdAt || issue.date)}</span>
                      </div>

                      {/* Category Tag */}
                      {issue.category && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-semibold">
                          <Tag className="w-3 h-3 text-emerald-500" />
                          <span>{issue.category}</span>
                        </div>
                      )}

                      {/* Location Badge */}
                      {issue.location && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 text-xs font-medium max-w-xs truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{issue.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold border shadow-sm ${badge.className}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badge.dotColor} animate-pulse`} />
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  {/* Complaint Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {issue.title || issue.complaint || "Civic Complaint"}
                  </h2>

                  {/* Complaint Description */}
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-4 whitespace-pre-line">
                    {issue.description || issue.complaint || "No description provided."}
                  </p>

                  {/* Admin Resolution Feedback Note */}
                  {issue.adminNote && (
                    <div className="mb-4 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                          Official Admin Resolution Note
                        </span>
                        <p className="text-sm text-amber-900 dark:text-amber-200 mt-0.5">
                          {issue.adminNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Photo / File Attachment */}
                  {issue.fileUrl && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(issue.fileUrl)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-all"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                        <span>View Attached Proof Image</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  )}

                  {/* Card Footer: Issue ID & Upvotes / Tracking info */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-gray-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Tracking ID:
                      </span>
                      <code className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        #{issueId}
                      </code>
                    </div>

                    {typeof issue.upvotes === "number" && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        ▲ {issue.upvotes} community upvotes
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Attached proof"
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
