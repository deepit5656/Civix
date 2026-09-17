import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, ArrowLeft, Filter, Layers, Info, Calendar, Tag, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Custom marker icon (green pin)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Fly to selected location
function FlyToLocation({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 14, { duration: 1.5 });
  return null;
}

export default function UserMap() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [mapView, setMapView] = useState("street");

  const handleBackClick = () => {
    navigate(-1);
  };

  const userIssues = [
    { id: 1, title: "Pothole near Main Street", description: "Big pothole near bus stop. Needs urgent repair.", status: "Pending", category: "Roads", date: "2025-08-01", lat: 13.0827, lng: 80.2707 },
    { id: 2, title: "Streetlight not working", description: "Dark street needs repair of light. Safety issue.", status: "Resolved", category: "Lighting", date: "2025-07-20", lat: 19.076, lng: 72.8777 },
    { id: 3, title: "Overflowing garbage bin", description: "Garbage collection delayed for 3 days.", status: "Under Review", category: "Waste", date: "2025-08-15", lat: 28.7041, lng: 77.1025 },
    { id: 4, title: "Broken water pipe", description: "Water flooding street due to burst pipe.", status: "In Progress", category: "Water", date: "2025-08-10", lat: 12.9716, lng: 77.5946 },
    { id: 5, title: "Damaged pedestrian crossing", description: "Zebra crossing faded near school.", status: "Pending", category: "Roads", date: "2025-08-05", lat: 22.5726, lng: 88.3639 },
    { id: 6, title: "Illegal dumping of waste", description: "Garbage dumped in open land, foul smell.", status: "Pending", category: "Waste", date: "2025-08-17", lat: 17.385, lng: 78.4867 },
    { id: 7, title: "Traffic signal malfunction", description: "Signal stuck on red causing jams.", status: "In Progress", category: "Roads", date: "2025-08-12", lat: 23.0225, lng: 72.5714 },
    { id: 8, title: "Public park lights off", description: "No lighting in park, unsafe at evening.", status: "Resolved", category: "Lighting", date: "2025-07-30", lat: 26.9124, lng: 75.7873 },
    { id: 9, title: "Open manhole", description: "Uncovered manhole near marketplace.", status: "Pending", category: "Safety", date: "2025-08-18", lat: 11.0168, lng: 76.9558 },
    { id: 10, title: "Sewage overflow", description: "Sewage water overflowing after rain.", status: "Under Review", category: "Water", date: "2025-08-16", lat: 15.2993, lng: 74.124 },
  ];

  const filteredIssues = userIssues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (categoryFilter === "All" || issue.category === categoryFilter)
  );

  const statusClasses = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800",
    Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800",
    "Under Review": "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800",
  };

  const tileUrls = {
    street: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackClick}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Civic Issues Map</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Explore report markers, filter by status, and inspect local community issues.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Waste">Waste</option>
              <option value="Lighting">Lighting</option>
              <option value="Water">Water</option>
              <option value="Safety">Safety</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setMapView("street")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mapView === "street"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Street
              </button>
              <button
                onClick={() => setMapView("topo")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  mapView === "topo"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Topo
              </button>
            </div>
          </div>
        </div>

        {/* MAP & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MAP DISPLAY CONTAINER */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-2 min-h-[480px]">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "480px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url={tileUrls[mapView]} />

              {filteredIssues.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[issue.lat, issue.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedIssue(issue),
                  }}
                >
                  <Popup>
                    <div className="p-1 max-w-xs space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{issue.title}</h4>
                      <p className="text-xs text-slate-600">{issue.description}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusClasses[issue.status]}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedIssue && <FlyToLocation position={[selectedIssue.lat, selectedIssue.lng]} />}
            </MapContainer>
          </div>

          {/* SIDEBAR LIST */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 max-h-[520px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Filtered Reports ({filteredIssues.length})
              </h3>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                No issues match your selected filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;

                  return (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {issue.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${statusClasses[issue.status]}`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                        <span>Category: {issue.category}</span>
                        <span>{issue.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}