import { useEffect, useState } from "react";
import {
  Github,
  ChevronDown,
  Search,
  GitBranch,
  Users,
  TrendingUp,
  Award,
  Medal,
  Crown,
  ExternalLink,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

const ContributorsPage = () => {
  const [contributors, setContributors] = useState([]);
  const [displayedContributors, setDisplayedContributors] = useState([]);
  const [filteredContributors, setFilteredContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("contributions");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState({
    totalContributors: 0,
    totalContributions: 0,
    topContributor: null,
  });

  const CONTRIBUTORS_PER_PAGE = 12;

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/HarshS16/Civix/contributors?per_page=200"
        );
        if (!response.ok) throw new Error("Failed to fetch contributors");
        const data = await response.json();
        const sortedData = (data || []).sort(
          (a, b) => b.contributions - a.contributions
        );
        setContributors(sortedData);
        setFilteredContributors(sortedData);
        setDisplayedContributors(sortedData.slice(0, CONTRIBUTORS_PER_PAGE));
        setHasMore(sortedData.length > CONTRIBUTORS_PER_PAGE);
        setStats({
          totalContributors: sortedData.length,
          totalContributions: sortedData.reduce((sum, c) => sum + c.contributions, 0),
          topContributor: sortedData[0],
        });
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContributors();
  }, []);

  useEffect(() => {
    let filtered = contributors.filter((contributor) =>
      contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => {
      if (sortBy === "contributions") return b.contributions - a.contributions;
      if (sortBy === "alphabetical") return a.login.localeCompare(b.login);
      return 0;
    });
    setFilteredContributors(filtered);
    setDisplayedContributors(filtered.slice(0, CONTRIBUTORS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > CONTRIBUTORS_PER_PAGE);
  }, [searchTerm, sortBy, contributors]);

  const loadMoreContributors = () => {
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = page * CONTRIBUTORS_PER_PAGE;
    const endIndex = startIndex + CONTRIBUTORS_PER_PAGE;
    const newContributors = filteredContributors.slice(startIndex, endIndex);
    setTimeout(() => {
      setDisplayedContributors((prev) => [...prev, ...newContributors]);
      setPage(nextPage);
      setHasMore(endIndex < filteredContributors.length);
      setIsLoadingMore(false);
    }, 400);
  };

  const getRankIcon = (index) => {
    if (index === 0)
      return <Crown className="w-5 h-5 text-amber-500 drop-shadow-sm" />;
    if (index === 1)
      return <Medal className="w-5 h-5 text-slate-400 drop-shadow-sm" />;
    if (index === 2)
      return <Award className="w-5 h-5 text-amber-700 drop-shadow-sm" />;
    return null;
  };

  const getContributionBadge = (contributions) => {
    if (contributions >= 100)
      return {
        level: "Legend",
        badgeStyle: "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      };
    if (contributions >= 50)
      return {
        level: "Expert",
        badgeStyle: "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      };
    if (contributions >= 20)
      return {
        level: "Advanced",
        badgeStyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      };
    if (contributions >= 10)
      return {
        level: "Intermediate",
        badgeStyle: "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      };
    return {
      level: "Beginner",
      badgeStyle: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
      {/* HERO & STATS SECTION */}
      <section className="bg-slate-900 dark:bg-slate-900 text-white border-b border-slate-800 py-14 px-4 sm:px-6 lg:px-8 relative shadow-md">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-semibold text-xs tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Source Heroes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Our Amazing <span className="text-emerald-400">Contributors</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Meet the open-source developers building and powering Civix to make cities more responsive every day.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{stats.totalContributors}</div>
              <div className="uppercase mt-1 text-slate-400 font-bold text-[11px] tracking-wider">Total Contributors</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <GitBranch className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{stats.totalContributions}</div>
              <div className="uppercase mt-1 text-slate-400 font-bold text-[11px] tracking-wider">Total Commits</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-center shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{stats.topContributor?.contributions || 0}</div>
              <div className="uppercase mt-1 text-slate-400 font-bold text-[11px] tracking-wider">Top Contributions</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & CONTROL BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by GitHub username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            >
              <option value="contributions">Sort by Most Commits</option>
              <option value="alphabetical">Sort Alphabetically</option>
            </select>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Unable to load contributors right now</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">GitHub API rate limit may have been reached or network connectivity was lost.</p>
            <a
              href="https://github.com/HarshS16/Civix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm"
            >
              <Github className="w-4 h-4" />
              View Repository on GitHub
            </a>
          </div>
        ) : displayedContributors.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <p className="text-lg font-bold text-slate-900 dark:text-white">No contributors match "{searchTerm}"</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try searching with a different term.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {displayedContributors.map((contributor, index) => {
              const { level, badgeStyle } = getContributionBadge(contributor.contributions);
              const rankIcon = getRankIcon(index);

              return (
                <motion.div
                  key={contributor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 12) * 0.03 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700 group-hover:border-emerald-500 transition-colors"
                      />
                      {rankIcon && (
                        <div className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border border-slate-700 shadow">
                          {rankIcon}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {contributor.login}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${badgeStyle}`}>
                          {level}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{contributor.contributions} commits</span>
                    </div>

                    <a
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all"
                      title="View GitHub Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && !isLoading && !isError && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMoreContributors}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold px-7 py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
            >
              {isLoadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More Contributors</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributorsPage;
