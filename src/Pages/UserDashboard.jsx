import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  List, 
  User, 
  Headphones, 
  BarChart3, 
  BookOpen,
  Bell,
  X,
  MessageCircle,
  MapPin,
  Search,
  Calendar,
  Bus,
  ChartColumn,
  Vote,
  Building2,
  Car,
  Zap,
  HandCoins,
  ReceiptIndianRupee,
  TrainFront,
  School,
  ArrowRight
} from "lucide-react";

const DashboardCard = ({ title, description, onClick, icon: Icon, badgeColor = "bg-emerald-600", tag = "SERVICE" }) => {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className="group relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:shadow-emerald-950/10 hover:border-emerald-500/40 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between min-h-[200px]"
    >
      {/* Top Header Row with Floating 3D Badge & Category Tag */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-13 h-13 ${badgeColor} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10 border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 p-3`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 group-hover:text-emerald-600 border border-slate-200/60 dark:border-slate-700/60 transition-colors">
            {tag}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-4">
        <span>Open Section</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Complaint Update", message: "Your complaint #12345 has been reviewed", time: "2 hours ago", unread: true },
    { id: 2, title: "Community Vote", message: "New voting topic: Street Light Installation", time: "1 day ago", unread: true },
    { id: 3, title: "Profile Update", message: "Your profile information was successfully updated", time: "3 days ago", unread: false }
  ]);

  const dashboardItems = [
    { title: "File a Complaint", description: "Submit a new issue with full details.", onClick: () => navigate("/report-issue"), icon: FileText, badgeColor: "bg-emerald-600", tag: "REPORT ISSUE" },
    { title: "My Complaints", description: "Track all complaints you've raised.", onClick: () => navigate("/complaints"), icon: List, badgeColor: "bg-teal-600", tag: "MY COMPLAINTS" },
    { title: "Profile", description: "View or edit your profile details.", onClick: () => navigate("/profile"), icon: User, badgeColor: "bg-slate-900 dark:bg-slate-700", tag: "ACCOUNT" },
    { title: "Support", description: "Need help? Contact our support.", onClick: () => navigate("/contact"), icon: Headphones, badgeColor: "bg-indigo-600", tag: "HELP DESK" },
    { title: "Community Voting", description: "Interact with the community by casting your vote on trending topics.", onClick: () => navigate("/community-voting"), icon: BarChart3, badgeColor: "bg-amber-600", tag: "CIVIC VOTING" },
    { title: "Resources", description: "Read FAQs, citizen rights, and more.", onClick: () => navigate("/resources"), icon: BookOpen, badgeColor: "bg-emerald-600", tag: "KNOWLEDGE" },
    { title: "Chat Room", description: "Join the community chat and engage in real-time discussions.", onClick: () => navigate("/chatroom"), icon: MessageCircle, badgeColor: "bg-teal-600", tag: "COMMUNITY" },
    { title: "Nearby Services", description: "Find hospitals, police stations, and fire stations close to you.", onClick: () => navigate("/nearby-services"), icon: MapPin, badgeColor: "bg-rose-600", tag: "LOCAL MAP" },
    { title: "Lost & Found", description: "Bringing lost items back to their owners.", onClick: () => navigate("/lost-found"), icon: Search, badgeColor: "bg-emerald-600", tag: "RECOVERY" },
    { title: "Community Holidays", description: "Look for upcoming community holidays.", onClick: () => navigate("/community-holidays"), icon: Calendar, badgeColor: "bg-indigo-600", tag: "EVENTS" },
    { title: "Public Transport", description: "Real-time transit information.", onClick: () => navigate("/transport"), icon: Bus, badgeColor: "bg-amber-600", tag: "TRANSIT" },
    { title: "Civic Statistics", description: "Comprehensive Population & Water Analytics.", onClick: () => navigate("/civic-stats"), icon: ChartColumn, badgeColor: "bg-slate-900 dark:bg-slate-700", tag: "ANALYTICS" },
    { title: "Election & Governance", description: "Electoral Information & Voter Analytics.", onClick: () => navigate("/elections-info"), icon: Vote, badgeColor: "bg-emerald-600", tag: "GOVERNANCE" },
    { title: "Government Schemes", description: "Government Schemes & Financial Analytics.", onClick: () => navigate("/govt-schemes"), icon: Building2, badgeColor: "bg-teal-600", tag: "SCHEMES" },
    { title: "Traffic & Vehicle Info", description: "Access vehicle and transport services.", onClick: () => navigate("/vehical"), icon: Car, badgeColor: "bg-indigo-600", tag: "VEHICLE" },
    { title: "Utilities Schedule", description: "Updates on water supply and power outages.", onClick: () => navigate("/electricity"), icon: Zap, badgeColor: "bg-amber-600", tag: "UTILITIES" },
    { title: "Disaster & Food Security", description: "SDRF Allocation & NFSA Coverage.", onClick: () => navigate("/sdrf"), icon: HandCoins, badgeColor: "bg-rose-600", tag: "SECURITY" },
    { title: "Budget Estimates", description: "Budget Estimates evaluation.", onClick: () => navigate("/budget"), icon: ReceiptIndianRupee, badgeColor: "bg-emerald-600", tag: "FINANCE" },
    { title: "Real-Time Train Schedule", description: "Real-time train schedule subsystem.", onClick: () => navigate("/train"), icon: TrainFront, badgeColor: "bg-teal-600", tag: "RAILWAYS" },
    { title: "School Statistics", description: "Nationwide school statistics architecture.", onClick: () => navigate("/school"), icon: School, badgeColor: "bg-indigo-600", tag: "EDUCATION" }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const markAllAsRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Citizen Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Your centralized portal for civic engagement & local services
          </p>
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/60">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} onClick={(e) => markAsRead(e, n.id)} className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 ${n.unread ? "font-semibold" : ""}`}>
                    <div className="flex justify-between">
                      <span className="text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button onClick={markAllAsRead} className="text-xs font-semibold text-emerald-600 hover:underline">
                    Mark all read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search civic features & services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Feature Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardItems
          .filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
      </main>
    </div>
  );
};

export default UserDashboard;