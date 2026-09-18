import React, { useState } from "react";
import { Info, HelpCircle, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

/**
 * SectionGuide Component
 * Provides a user-friendly explanation of what the page is for, how to use it,
 * and cites official data sources for transparency and authenticity.
 */
const SectionGuide = ({
  title,
  purpose,
  howToUse = [],
  dataSource,
  sourceUrl,
  scope = "National (India)",
  defaultExpanded = true,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl border border-emerald-200/80 dark:border-emerald-900/50 shadow-lg overflow-hidden transition-all duration-300 mb-8 ${className}`}
    >
      {/* Header / Summary Bar */}
      <div
        className="px-6 py-4 flex items-center justify-between cursor-pointer bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70 dark:from-emerald-950/40 dark:via-gray-900 dark:to-teal-950/40 border-b border-emerald-100/60 dark:border-emerald-900/30"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>About this Section & Data Guide</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                Verified Purpose
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Click to {isExpanded ? "collapse" : "expand"} details on what this section does and its official data sources
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-xl hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50 text-slate-500 dark:text-slate-400 transition"
          aria-label={isExpanded ? "Collapse section guide" : "Expand section guide"}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-5 text-sm">
          {/* Main Purpose */}
          {purpose && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                What is the purpose of this section?
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {purpose}
              </p>
            </div>
          )}

          {/* How to use */}
          {howToUse && howToUse.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <HelpCircle className="w-3.5 h-3.5" />
                How to use this feature:
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {howToUse.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/80 border border-slate-200/70 dark:border-gray-700/60 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-snug">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Source & Authenticity Metadata */}
          {dataSource && (
            <div className="pt-4 border-t border-slate-200/70 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">Official Data Source:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40">
                  {dataSource}
                </span>
                {scope && (
                  <span className="bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                    Scope: {scope}
                  </span>
                )}
              </div>

              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SectionGuide;
