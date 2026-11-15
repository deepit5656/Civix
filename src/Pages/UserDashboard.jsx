import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
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
  Plus,
  ClipboardCheck,
  LifeBuoy,
  ChevronRight
} from "lucide-react";

const DashboardCard = ({ title, description, onClick, icon: Icon, tag = "SERVICE" }) => {
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
      className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-black/20 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[172px]"
    >
      {/* Top Header Row with Floating 3D Badge & Category Tag */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            {tag}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
        <span>Open service</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const dropdownRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  const dashboardItems = [
    { title: "My Complaints", description: "Track complaints, updates, and review requests.", onClick: () => navigate("/complaints"), icon: List, tag: "YOUR ACTIVITY" },
    { title: "Profile & account", description: "Update your personal details and preferences.", onClick: () => navigate("/profile"), icon: User, tag: "ACCOUNT" },
    { title: "Community Voting", description: "Support local issues that matter to your area.", onClick: () => navigate("/community-voting"), icon: BarChart3, tag: "PARTICIPATE" },
    { title: "Resources", description: "Read civic rights, FAQs, and practical guidance.", onClick: () => navigate("/resources"), icon: BookOpen, tag: "LEARN" },
    { title: "Community chat", description: "Discuss local needs with other residents.", onClick: () => navigate("/chatroom"), icon: MessageCircle, tag: "CONNECT" },
    { title: "Nearby services", description: "Find hospitals, police, fire, pharmacies, and more.", onClick: () => navigate("/nearby-services"), icon: MapPin, tag: "LOCAL HELP" },
    { title: "Lost & Found", description: "Report a lost item or help return one.", onClick: () => navigate("/lost-found"), icon: Search, tag: "COMMUNITY" },
    { title: "Community holidays", description: "Browse upcoming public and community holidays.", onClick: () => navigate("/community-holidays"), icon: Calendar, tag: "CALENDAR" },
    { title: "Public transport", description: "Search nearby transit and the Delhi GTFS directory.", onClick: () => navigate("/transport"), icon: Bus, tag: "TRANSPORT" },
    { title: "Civic statistics", description: "Explore population and water-service data.", onClick: () => navigate("/civic-stats"), icon: ChartColumn, tag: "PUBLIC DATA" },
    { title: "Election & governance", description: "Explore election information and civic data.", onClick: () => navigate("/elections-info"), icon: Vote, tag: "GOVERNANCE" },
    { title: "Government schemes", description: "Browse welfare schemes and official resources.", onClick: () => navigate("/govt-schemes"), icon: Building2, tag: "PUBLIC BENEFITS" },
    { title: "Vehicle services", description: "Open official registration and licence services.", onClick: () => navigate("/vehical"), icon: Car, tag: "TRANSPORT" },
    { title: "Utilities", description: "Explore electricity and public utility information.", onClick: () => navigate("/electricity"), icon: Zap, tag: "ESSENTIALS" },
    { title: "Disaster & food security", description: "Review SDRF and food-security information.", onClick: () => navigate("/sdrf"), icon: HandCoins, tag: "SAFETY" },
    { title: "Union budget", description: "Review public budget estimates and allocations.", onClick: () => navigate("/budget"), icon: ReceiptIndianRupee, tag: "PUBLIC FINANCE" },
    { title: "Train schedules", description: "Search the available Indian Railways timetable.", onClick: () => navigate("/train"), icon: TrainFront, tag: "RAILWAYS" },
    { title: "School statistics", description: "Explore nationwide UDISE+ school data.", onClick: () => navigate("/school"), icon: School, tag: "EDUCATION" }
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

  const markAsRead = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6] dark:bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400 mb-2">Citizen portal</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              Good to see you, {user?.name || user?.username || "citizen"}.
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Report local issues, follow your requests, and access public services from one place.
            </p>
          </div>
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              aria-label="Open notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              <Bell className="w-5 h-5" strokeWidth={1.8} />
              {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  <button aria-label="Close notifications" onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-7 text-center">
                    <Bell className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">You’re all caught up</p>
                    <p className="text-xs text-slate-500 mt-1">Updates about your civic activity will appear here.</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((n) => (
                      <div key={n.id} onClick={(e) => markAsRead(e, n.id)} className="p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <div className="flex justify-between"><span className="text-slate-900 dark:text-white">{n.title}</span><span className="text-[10px] text-slate-400">{n.time}</span></div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-10">
          <div className="rounded-2xl bg-emerald-900 text-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-200 font-semibold">Start here</p>
                <h2 className="text-2xl font-bold mt-3">Make your neighbourhood heard.</h2>
                <p className="text-sm text-emerald-100/80 mt-2 max-w-md">Report a civic issue with its location and details. You can review progress at any time.</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-emerald-200 shrink-0" strokeWidth={1.5} />
            </div>
            <button onClick={() => navigate("/report-issue")} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white text-emerald-900 px-4 py-2.5 text-sm font-bold hover:bg-emerald-50 transition-colors">
              <Plus className="w-4 h-4" /> Report an issue
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Track a request", detail: "See complaint status", icon: List, path: "/complaints" },
              { label: "Find local help", detail: "Services near you", icon: MapPin, path: "/nearby-services" },
              { label: "Get support", detail: "Ask for community help", icon: LifeBuoy, path: "/community-support" },
              { label: "Emergency help", detail: "Open SOS contacts", icon: Headphones, path: "/sos" }
            ].map(({ label, detail, icon: Icon, path }) => (
              <button key={path} onClick={() => navigate(path)} className="text-left rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 hover:border-emerald-400 dark:hover:border-emerald-700 transition-colors">
                <Icon className="w-5 h-5 text-emerald-700 dark:text-emerald-400 mb-4" strokeWidth={1.8} />
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{label}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1">{detail}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-500 font-bold">Explore Civix</p>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mt-1">Services and information</h2>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" aria-label="Search services" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardItems
          .filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <DashboardCard key={index} {...item} />
          ))}
        </main>
        {dashboardItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
          <div className="text-center py-16 text-sm text-slate-500 dark:text-slate-400">No services match “{searchTerm}”.</div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;