import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "../components/ui/BackButton";
import SectionGuide from "../components/ui/SectionGuide";
import { useAuthContext } from "../context/AuthContext";
import { issuesAPI } from "../utils/api";
import { toast } from "react-hot-toast";
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  Moon,
  Sun,
  Building,
  Compass,
  RefreshCw
} from "lucide-react";

const CommunityVotingPage = () => {
  const { user } = useAuthContext();
  const [scopeTab, setScopeTab] = useState("all"); // 'my_area' or 'all'
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [sortBy, setSortBy] = useState("Most Votes");
  const [isDark, setIsDark] = useState(false);
  const [votedIssues, setVotedIssues] = useState({});
  const [confetti, setConfetti] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extract user city / area from profile location
  const userCity = useMemo(() => {
    if (!user?.location) return "";
    const parts = user.location.split(",");
    return parts[0]?.trim() || "";
  }, [user?.location]);

  const defaultMockIssues = [
    {
      id: "mock-1",
      title: "Pothole on Main Street",
      area: "Noida",
      daysOpen: 3,
      votes: 15,
      accidentsReported: 2,
      status: "Open",
      priority: "high",
    },
    {
      id: "mock-2",
      title: "Broken Street Light",
      area: "East Delhi",
      daysOpen: 5,
      votes: 8,
      accidentsReported: 1,
      status: "Open",
      priority: "medium",
    },
    {
      id: "mock-3",
      title: "Garbage Not Collected",
      area: "South Delhi",
      daysOpen: 7,
      votes: 22,
      accidentsReported: 0,
      status: "Open",
      priority: "low",
    },
    {
      id: "mock-4",
      title: "Water Leakage Issue",
      area: "West Delhi",
      daysOpen: 2,
      votes: 32,
      accidentsReported: 0,
      status: "In Progress",
      priority: "high",
    },
  ];

  const [issues, setIssues] = useState(defaultMockIssues);

  const fetchLiveIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await issuesAPI.getAll({ limit: 100 });
      const liveList = Array.isArray(res) ? res : (res?.issues || []);
      
      if (liveList.length > 0) {
        const transformedLive = liveList.map((item, idx) => {
          const createdDate = item.createdAt ? new Date(item.createdAt) : new Date();
          const diffDays = Math.max(1, Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24)));
          
          return {
            id: item._id || `live-${idx}`,
            title: item.title || "Civic Complaint",
            area: item.location ? item.location.split(",")[0].trim() : (item.category || "Local Ward"),
            fullLocation: item.location || "Local Ward",
            daysOpen: diffDays,
            votes: (item.upvotes || 0) + 1,
            accidentsReported: item.priority === 'High' ? 1 : 0,
            status: item.status || "Open",
            priority: item.priority ? item.priority.toLowerCase() : "medium",
          };
        });

        // Merge live issues with defaults
        setIssues([...transformedLive, ...defaultMockIssues]);
      }
    } catch (err) {
      console.warn("Could not load live issues for voting, using local set:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveIssues();
  }, [fetchLiveIssues]);

  // Extract all unique areas
  const areas = useMemo(() => {
    const set = new Set();
    set.add("All Areas");
    if (userCity) set.add(userCity);
    issues.forEach(i => {
      if (i.area) set.add(i.area);
    });
    return Array.from(set);
  }, [issues, userCity]);

  const sortOptions = [
    "Most Votes",
    "Most Recent",
    "Longest Open",
    "Most Accidents",
  ];

  const filteredIssues = issues
    .filter((issue) => {
      // Tab filter
      if (scopeTab === "my_area" && userCity) {
        const itemLocation = ((issue.area || "") + " " + (issue.fullLocation || "")).toLowerCase();
        if (!itemLocation.includes(userCity.toLowerCase())) {
          return false;
        }
      }
      
      // Dropdown filter
      if (selectedArea !== "All Areas" && issue.area !== selectedArea) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Most Votes") return b.votes - a.votes;
      if (sortBy === "Most Recent") return a.daysOpen - b.daysOpen;
      if (sortBy === "Longest Open") return b.daysOpen - a.daysOpen;
      if (sortBy === "Most Accidents")
        return b.accidentsReported - a.accidentsReported;
      return 0;
    });

  const handleVote = (id) => {
    const hasVoted = votedIssues[id];
    setIssues(
      issues.map((issue) =>
        issue.id === id
          ? { ...issue, votes: hasVoted ? issue.votes - 1 : issue.votes + 1 }
          : issue
      )
    );
    setVotedIssues((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!hasVoted) {
      setConfetti(id);
      toast.success("Vote recorded! Thank you for prioritizing this issue.");
      setTimeout(() => setConfetti(null), 1200);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300";
      case "medium":
        return "bg-lime-100 text-lime-700 dark:bg-lime-800/40 dark:text-lime-300";
      case "low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-200";
      case "In Progress":
        return "bg-lime-200 text-lime-900 dark:bg-lime-800/40 dark:text-lime-200";
      case "Resolved":
        return "bg-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200";
      default:
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
    }
  };
  const getStatColors = (color) => {
    const stat = {
      green:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      lime: "bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300",
      emerald:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    };
    return stat[color] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-700";
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-gray-900 dark:to-emerald-900 transition-colors duration-300">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 relative">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-2xl bg-white/80 dark:bg-green-900/80 backdrop-blur-md border border-slate-200 dark:border-green-800 text-slate-700 dark:text-slate-200 hover:scale-105 transition shadow-sm"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Community Voting
          </motion.h1>
          <p className="mt-3 text-center text-green-700 dark:text-green-300">
            Support civic issues with one click and make a difference.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <SectionGuide
            title="Community Civic Upvoting & Issue Prioritization"
            purpose="Enables local citizens to upvote pending community issues (such as road hazards, broken lights, and water leaks). Ward councilors and municipal administrators use these vote counts to prioritize emergency repairs and allocate civic budgets."
            steps={[
              "Filter neighborhood issues by area or sort by Most Votes, Most Recent, or Most Accidents.",
              "Click the Upvote button on any civic problem to raise its urgency ranking.",
              "Track issue status transitions from 'Open' to 'In Progress' and 'Resolved'.",
              "Share high-priority issues with neighbors to gather collective community momentum."
            ]}
            source="Civix Civic Democratic Voting Engine"
            scope="Local Ward & City Zones"
            category="Community Governance"
          />

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              {
                label: "Total Issues",
                value: issues.length,
                icon: AlertTriangle,
                color: "green",
              },
              {
                label: "Total Votes",
                value: issues.reduce((s, i) => s + i.votes, 0),
                icon: TrendingUp,
                color: "lime",
              },
              {
                label: "Active Areas",
                value: areas.length - 1,
                icon: MapPin,
                color: "emerald",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -2, scale: 1.02 }}
                className={`p-5 rounded-xl shadow-sm border border-green-100 dark:border-green-700 ${getStatColors(stat.color)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${getStatColors(stat.color)}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Location Scope Selector */}
          <div className="bg-white/90 dark:bg-green-950/70 p-3 rounded-2xl shadow-sm border border-green-100 dark:border-green-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setScopeTab("my_area");
                  if (userCity) setSelectedArea("All Areas");
                }}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  scopeTab === "my_area"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>My City / Area {userCity ? `(${userCity})` : ""}</span>
              </button>

              <button
                type="button"
                onClick={() => setScopeTab("all")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  scopeTab === "all"
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>All Cities & Areas</span>
              </button>
            </div>

            <button
              type="button"
              onClick={fetchLiveIssues}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl hover:bg-emerald-100 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh Issues</span>
            </button>
          </div>

          {/* Filters */}
          <motion.div
            className="bg-white/90 dark:bg-green-950/70 p-6 rounded-xl shadow border border-green-100 dark:border-green-800 mb-8"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                Filter & Sort
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{ label: "Filter by City / Zone", value: selectedArea, set: setSelectedArea, options: areas },
                { label: "Sort By", value: sortBy, set: setSortBy, options: sortOptions }]
                .map(({ label, value, set, options }) => (
                  <div key={label} className="space-y-2">
                    <label className="text-sm font-medium text-green-900 dark:text-green-300">
                      {label}
                    </label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="w-full appearance-none bg-white dark:bg-green-950 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3 text-green-900 dark:text-green-100 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-700 transition font-semibold"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Issues List */}
          <AnimatePresence>
            {filteredIssues.map((issue, i) => (
              <motion.div
                key={issue.id}
                className="bg-white/95 dark:bg-green-950/80 rounded-xl shadow border border-green-100 dark:border-green-700 mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                        {issue.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-green-800 dark:text-green-400">
                          <MapPin size={14} /> {issue.area}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority} priority
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[{ label: "Days Open", value: issue.daysOpen, icon: Clock },
                      { label: "Accidents", value: issue.accidentsReported, icon: AlertTriangle },
                      { label: "Votes", value: issue.votes, icon: TrendingUp }].map((m, idx) => (
                      <div
                        key={idx}
                        className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-xl"
                      >
                        <m.icon className="w-4 h-4 text-green-600 dark:text-green-300 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-950 dark:text-green-50">
                          {m.value}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 relative">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-800 dark:text-green-200">
                        Community Support
                      </span>
                      <span className="font-medium text-green-950 dark:text-green-100">
                        {Math.min(issue.votes * 5, 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(issue.votes * 5, 100)}%` }}
                        transition={{ duration: 1 }}
                        key={`bar-${issue.id}-${issue.votes}`}
                      />
                    </div>
                    <motion.button
                      onClick={() => handleVote(issue.id)}
                      className={`w-full py-3 mt-1 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
                        votedIssues[issue.id]
                          ? "bg-green-800 hover:bg-green-700 text-green-100"
                          : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg"
                      }`}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {votedIssues[issue.id] ? (
                        <CheckCircle size={16} />
                      ) : (
                        <TrendingUp size={16} />
                      )}
                      {votedIssues[issue.id]
                        ? `Voted (${issue.votes})`
                        : `Vote (${issue.votes})`}
                    </motion.button>
                    {confetti === issue.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[...Array(6)].map((_, idx) => (
                          <motion.div
                            key={idx}
                            className="absolute text-2xl"
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{
                              opacity: 0,
                              scale: 1.5,
                              x: (Math.random() - 0.5) * 120,
                              y: (Math.random() - 0.5) * 120,
                            }}
                            transition={{ duration: 1 }}
                          >
                            🎉
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredIssues.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-green-300 animate-bounce" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                No issues found
              </h3>
              <p className="text-green-700 dark:text-green-200 mt-2">
                Try adjusting your filters to see more issues.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityVotingPage;
