import { useState, useMemo } from "react";
import { Search, Plus, MapPin, Calendar, User, Phone, Mail, X, Building, Compass } from "lucide-react";
import BackButton from "../components/ui/BackButton";
import SectionGuide from "../components/ui/SectionGuide";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function LostAndFoundPage() {
  const { user } = useAuthContext();
  const [scopeTab, setScopeTab] = useState("all"); // "my_area" or "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Extract user city
  const userCity = useMemo(() => {
    if (!user?.location) return "";
    return user.location.split(",")[0]?.trim() || "";
  }, [user?.location]);

  const [items, setItems] = useState([
    {
      id: "lf-1",
      type: "lost",
      name: "Black Leather Wallet with ID",
      description: "Lost near City Center Metro Station exit gate 2. Contains Aadhaar card and Metro card.",
      location: userCity || "Anand",
      date: "2025-01-14",
      contactName: user?.name || "Deep Patel",
      contactPhone: user?.phone || "+91 98765 43210",
      contactEmail: user?.email || "citizen@civix.gov.in"
    },
    {
      id: "lf-2",
      type: "found",
      name: "Silver Car Keys (Honda)",
      description: "Found on public park bench near children play area. Has a red key-chain.",
      location: userCity || "Anand",
      date: "2025-01-15",
      contactName: "Community Patrol Officer",
      contactPhone: "+91 98234 56789",
      contactEmail: "patrol@civix.gov.in"
    },
    {
      id: "lf-3",
      type: "lost",
      name: "Dell Laptop Charger 65W",
      description: "Left behind in Municipal Library reading room 3.",
      location: "Central Library",
      date: "2025-01-12",
      contactName: "Priya Sharma",
      contactPhone: "+91 98123 45678",
      contactEmail: "priya.s@example.com"
    }
  ]);

  const [formData, setFormData] = useState({
    type: "lost",
    name: "",
    description: "",
    location: userCity || user?.location || "",
    date: new Date().toISOString().split("T")[0],
    contactName: user?.name || "",
    contactPhone: user?.phone || "",
    contactEmail: user?.email || "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.location || !formData.date || 
        !formData.contactName || !formData.contactPhone || !formData.contactEmail) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setItems([{ ...formData, id: Date.now(), type: formData.type }, ...items]);
    toast.success("Item notice published to community board!");
    setFormData({
      type: "lost",
      name: "",
      description: "",
      location: userCity || user?.location || "",
      date: new Date().toISOString().split("T")[0],
      contactName: user?.name || "",
      contactPhone: user?.phone || "",
      contactEmail: user?.email || "",
    });
    setShowForm(false);
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Scope filter
    let matchesScope = true;
    if (scopeTab === "my_area" && userCity) {
      matchesScope = (item.location || "").toLowerCase().includes(userCity.toLowerCase());
    }

    return matchesTab && matchesSearch && matchesScope;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-emerald-950 dark:via-gray-900 dark:to-green-950 relative py-10 px-4">
      {/* Decorative background */}
      <div className="absolute top-20 right-16 w-72 h-72 bg-emerald-200/20 dark:bg-green-400/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-60 h-60 bg-emerald-200/15 dark:bg-green-500/8 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-600 to-teal-500 dark:from-white dark:via-green-300 dark:to-green-400 bg-clip-text text-transparent mb-2 tracking-tight">
              Lost & Found
            </h1>
            <p className="text-green-800/80 dark:text-green-200/80 font-medium">Help reunite people with their belongings</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 sm:mt-0 group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-600/40 transition hover:scale-[1.04]"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition" />
            Add Item
          </button>
        </div>

        {/* Section Guide */}
        <SectionGuide
          title="Community Lost & Found Item Registry"
          purpose="A community-powered recovery bulletin where citizens can post lost possessions (keys, wallets, documents, pets) or report found items to safely reconnect them with their rightful owners."
          steps={[
            "Browse existing listings or use the search bar to check if your lost item was already found.",
            "Switch between tabs: 'All', 'Lost Items', or 'Found Items'.",
            "Click '+ Add Item' to publish a new notice with item photo/description, location last seen, and your contact info.",
            "Directly call or email verified contacts when you recognize an item."
          ]}
          source="Civix Community Notice Registry"
          scope="Local Community & City-Wide"
          category="Citizen Community Recovery"
        />

        {/* Location Scope Selector */}
        <div className="bg-white/90 dark:bg-emerald-950/70 p-3 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/60 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setScopeTab("my_area")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                scopeTab === "my_area"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-emerald-50/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>In My City / Area {userCity ? `(${userCity})` : ""}</span>
            </button>

            <button
              type="button"
              onClick={() => setScopeTab("all")}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                scopeTab === "all"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-emerald-50/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>All Locations & Cities</span>
            </button>
          </div>
          <span className="text-xs text-emerald-700/80 dark:text-emerald-300/80 font-medium px-2">
            Showing {filteredItems.length} notice{filteredItems.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items by name, description, or city/area..."
              className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-emerald-900/80 backdrop-blur border border-emerald-100/70 dark:border-emerald-900/50 rounded-xl text-emerald-900 dark:text-white placeholder:text-emerald-500 font-medium shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Items", emoji: "📋" },
              { key: "lost", label: "Lost", emoji: "😔" },
              { key: "found", label: "Found", emoji: "🎉" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-lg"
                    : "bg-white/80 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-200 border border-emerald-100/50 dark:border-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
                }`}
              >
                <span className="mr-1">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white/90 dark:bg-emerald-900/95 rounded-3xl border border-emerald-100/70 dark:border-emerald-900/40 p-16 text-center shadow-lg">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-100 mb-1.5">No items found</h3>
            <p className="text-emerald-700/80 dark:text-emerald-300/80">Be the first to add a lost or found item!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white/95 dark:bg-emerald-950/80 border border-emerald-100/70 dark:border-emerald-900/50 rounded-2xl p-7 shadow-lg hover:shadow-emerald-100/10 dark:hover:shadow-emerald-900/20 transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-extrabold text-emerald-800 dark:text-emerald-100 group-hover:text-emerald-900 dark:group-hover:text-green-200 transition">
                    {item.name}
                  </h3>
                  <span className={`px-4 py-1 text-xs font-bold rounded-full ${
                    item.type === "lost"
                      ? "bg-gradient-to-r from-red-200 to-red-400 text-red-900"
                      : "bg-gradient-to-r from-green-200 to-green-400 text-emerald-900"
                  }`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-emerald-200 mb-4 line-clamp-2">{item.description}</p>
                <div className="space-y-3 text-xs font-medium">
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-100">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-100">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-100">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.contactName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-100">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-mono">{item.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-100">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.contactEmail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-emerald-100/70 dark:border-emerald-900/40">
              <div className="flex items-center justify-between mb-7">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-white">Add New Item</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-10 h-10 bg-gray-100 dark:bg-emerald-900/80 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-3 bg-emerald-50 dark:bg-green-900/30 rounded-xl">
                  {[
                    { value: "lost", label: "😔 Lost", desc: "I lost something" },
                    { value: "found", label: "🎉 Found", desc: "I found something" }
                  ].map((option) => (
                    <label key={option.value} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={formData.type === option.value}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`text-center p-3 rounded-lg border-2 transition-all ${
                        formData.type === option.value
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/70"
                          : "border-emerald-100 dark:border-emerald-800 hover:border-emerald-400"
                      }`}>
                        <div className="font-bold text-base">{option.label}</div>
                        <div className="text-xs text-emerald-500 dark:text-emerald-200">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {[
                  { key: "name", type: "text", placeholder: "Item Name", required: true },
                  { key: "description", type: "textarea", placeholder: "Description", required: true },
                  { key: "location", type: "text", placeholder: "Location", required: true },
                  { key: "date", type: "date", placeholder: "", required: true },
                  { key: "contactName", type: "text", placeholder: "Contact Name", required: true },
                  { key: "contactPhone", type: "tel", placeholder: "Contact Phone", required: true },
                  { key: "contactEmail", type: "email", placeholder: "Contact Email", required: true }
                ].map((field) => (
                  <div key={field.key}>
                    {field.type === "textarea" ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white/80 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-white placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition h-20 resize-none"
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white/80 dark:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-white placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold rounded-xl shadow-lg transition hover:scale-[1.03]"
                >
                  Submit Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
