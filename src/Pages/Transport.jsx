import React, { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import { Search, MapPin, Navigation, Hash, LayoutGrid, ExternalLink, Locate, Loader2, Bus } from "lucide-react";
import BackButton from "../components/ui/BackButton";
import SectionGuide from "../components/ui/SectionGuide";
import { toast } from "react-hot-toast";

export default function PublicTransportInfo() {
  const [stops, setStops] = useState([]);
  const [search, setSearch] = useState("");
  const [activeMode, setActiveMode] = useState("nearby"); // 'nearby' | 'delhi_gtfs'
  const [nearbyStops, setNearbyStops] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  // Load Delhi GTFS stops
  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/gtfs/stops.txt");
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setStops(result.data || []);
          },
        });
      } catch (error) {
        console.error("Error loading stops:", error);
      }
    }
    fetchStops();
  }, []);

  // Fetch live nearby transit stops using geolocation & OSM Overpass
  const fetchNearbyTransit = useCallback(async (lat, lon) => {
    setLoadingNearby(true);
    try {
      const overpassUrls = [
        "https://overpass-api.de/api/interpreter",
        "https://lz4.overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
      ];

      const query = `
        [out:json][timeout:25];
        (
          node["highway"="bus_stop"](around:5000,${lat},${lon});
          node["public_transport"="platform"](around:5000,${lat},${lon});
          node["public_transport"="stop_position"](around:5000,${lat},${lon});
          node["railway"="station"](around:8000,${lat},${lon});
          node["railway"="halt"](around:8000,${lat},${lon});
        );
        out body 30;
      `;

      let data = null;
      for (const url of overpassUrls) {
        try {
          const res = await fetch(url, {
            method: "POST",
            body: query,
          });
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch {
          // try next mirror
        }
      }

      if (data && data.elements) {
        const formatted = data.elements.map((el) => {
          const name =
            el.tags?.name ||
            el.tags?.["name:en"] ||
            el.tags?.ref ||
            (el.tags?.highway === "bus_stop" ? "Local Bus Stop" : "Public Transit Point");
          const type = el.tags?.railway ? "Railway / Metro Station" : "Bus Stop / Platform";
          return {
            id: el.id,
            name,
            type,
            lat: el.lat,
            lon: el.lon,
            operator: el.tags?.operator || el.tags?.network || "Public Transit Authority",
          };
        });
        setNearbyStops(formatted);
        if (formatted.length > 0) {
          toast.success(`Found ${formatted.length} nearby transit stops around your location!`);
        } else {
          toast.info("No transit stops tagged within 5km of your location. Try searching the GTFS database.");
        }
      } else {
        setNearbyStops([]);
      }
    } catch (err) {
      console.error("Nearby transit error:", err);
      toast.error("Could not fetch nearby transit points. Please check internet connection.");
    } finally {
      setLoadingNearby(false);
    }
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    toast.loading("Detecting your location...", { id: "geo-toast" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        toast.dismiss("geo-toast");
        setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        fetchNearbyTransit(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        toast.dismiss("geo-toast");
        console.error(err);
        toast.error("Location permission denied. Showing directory search.");
        setActiveMode("delhi_gtfs");
      },
      { timeout: 15000 }
    );
  };

  useEffect(() => {
    handleDetectLocation();
  }, []);

  const filteredGTFSStops = stops.filter(
    (stop) =>
      stop.stop_name?.toLowerCase().includes(search.toLowerCase()) ||
      stop.stop_id?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNearby = nearbyStops.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-25 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-green-950/10 relative pb-16">
      {/* Background orbs */}
      <div className="absolute top-16 right-20 w-80 h-80 bg-green-200/10 dark:bg-green-400/5 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 left-16 w-64 h-64 bg-green-300/15 dark:bg-green-500/8 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Section Guide & Data Origin */}
        <SectionGuide
          title="Public Transport & Transit Stops"
          purpose="This section helps citizens discover nearby public transportation, bus stands, metro and railway platforms in their immediate locality as well as explore official Open Transit GTFS transit networks."
          howToUse={[
            "Click 'Find Nearby (My Location)' to discover bus & transit stops within 5km of wherever you are currently located.",
            "Switch to 'Transit Directory (GTFS)' to search through thousands of indexed official municipal transit stops and stations.",
            "Click 'Open in Google Maps' on any stop to immediately navigate directly to the stop.",
          ]}
          dataSource="Open Transit Data (OTD Delhi GTFS) & OpenStreetMap Global Transit Network API"
          sourceUrl="https://otd.delhi.gov.in/"
          scope="Local GPS (Anywhere) + Delhi Open Transit GTFS"
        />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-green-800 dark:from-white dark:via-green-300 dark:to-green-400 bg-clip-text text-transparent">
                Public Transit Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-0.5">
                Real-time nearby stops and official transit network explorer
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector & Search Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-green-100/60 dark:border-green-800/40 shadow-lg p-6 mb-8">
          {/* Mode Switch Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-gray-800">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveMode("nearby")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeMode === "nearby"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <Locate className="w-4 h-4" />
                <span>Nearby Stops (My GPS Location)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("delhi_gtfs")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeMode === "delhi_gtfs"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Delhi GTFS Directory ({stops.length > 0 ? stops.length : "10k+"})</span>
              </button>
            </div>

            {activeMode === "nearby" && (
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={loadingNearby}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition"
              >
                <Locate className={`w-3.5 h-3.5 ${loadingNearby ? "animate-spin" : ""}`} />
                <span>Re-scan Current Location</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                activeMode === "nearby"
                  ? "Filter nearby stops or stations..."
                  : "Search Delhi GTFS directory by stop name or stop ID..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition font-medium text-sm"
            />
          </div>
        </div>

        {/* Display Content */}
        {activeMode === "nearby" ? (
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Live Transit Stops Around You</span>
              </h2>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                {filteredNearby.length} stops found
              </span>
            </div>

            {loadingNearby ? (
              <div className="py-20 text-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Scanning public transit points within 5km of your location...
                </p>
              </div>
            ) : filteredNearby.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white/80 dark:bg-gray-900/80 rounded-3xl border border-slate-200 dark:border-gray-800 shadow">
                <Bus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                  No Nearby Stops Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  We couldn't detect tagged bus or transit stops right at your GPS coordinates. You can switch to the GTFS directory to search across recorded municipal networks.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMode("delhi_gtfs")}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition"
                >
                  Explore Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredNearby.map((stop) => (
                  <div
                    key={stop.id}
                    className="p-5 bg-white/90 dark:bg-gray-900/90 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                          {stop.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                        {stop.name}
                      </h3>
                      {stop.operator && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                          Operator: {stop.operator}
                        </p>
                      )}
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${stop.lat},${stop.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition"
                    >
                      <span>Navigate on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-emerald-600" />
                <span>Delhi GTFS Open Transit Directory</span>
              </h2>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                {filteredGTFSStops.length} stops
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGTFSStops.slice(0, 30).map((stop, index) => (
                <div
                  key={stop.stop_id || index}
                  className="p-5 bg-white/90 dark:bg-gray-900/90 rounded-3xl border border-slate-200/80 dark:border-gray-800 shadow hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 font-mono">
                        ID: {stop.stop_id}
                      </span>
                      {stop.stop_code && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                          Code: {stop.stop_code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                      {stop.stop_name}
                    </h3>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${stop.stop_lat},${stop.stop_lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 transition"
                  >
                    <span>View Location on Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {filteredGTFSStops.length > 30 && (
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                Showing top 30 matching results. Use the search bar above to filter by specific bus stop names or codes.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}