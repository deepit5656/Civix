import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import mission from '../assets/mission.png';
import { 
  Users, 
  Globe, 
  Heart, 
  Target, 
  Zap, 
  Shield,
  Award,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function About() {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      icon: Users,
      title: "Community Building",
      description: "Connect with like-minded individuals in your area",
      details: "Create lasting relationships and build stronger neighborhoods through our civic platform."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Make a difference on a local & worldwide scale",
      details: "Join community initiatives and see how local actions contribute to systemic change."
    },
    {
      icon: Heart,
      title: "Social Good",
      description: "Focus on projects that truly matter",
      details: "Our system helps prioritize the most impactful civic opportunities in your area."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Measure your impact with precision",
      details: "Real-time analytics and transparent updates help you track issue resolution progress."
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Take immediate action when it matters",
      details: "Instant reporting and one-click participation make reporting civic issues effortless."
    },
    {
      icon: Shield,
      title: "Verified Projects",
      description: "Trust in legitimate, vetted civic responses",
      details: "Every issue report undergoes verification to ensure official municipal action."
    },
    {
      icon: Award,
      title: "Recognition System",
      description: "Get acknowledged for your contributions",
      details: "Earn badges and community recognition for your active civic participation."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Participate on the go with mobile access",
      details: "Responsive access with real-time notifications and location tag capabilities."
    }
  ];

  const stats = [
    { label: "Issues Resolved", value: "25,000+" },
    { label: "Active Citizens", value: "100,000+" },
    { label: "Cities Covered", value: "45+" },
    { label: "Avg Resolution Rate", value: "94%" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs tracking-wide shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Empowering Citizens & Local Governance</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Report Local Issues.{' '}
            <span className="text-emerald-600 dark:text-emerald-400">Make Your City Better.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Civix is a modern civic engagement platform connecting citizens directly with municipal authorities. We turn everyday observations into real, actionable community improvements.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/report-issue"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 text-sm"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/user-map"
              className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-all duration-200 text-sm"
            >
              <span>Explore Issue Map</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Designed for Citizen Empowerment
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to report problems, vote on priorities, and track resolutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isSelected = activeFeature === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveFeature(isSelected ? null : index)}
                className={`bg-white dark:bg-slate-900 border ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
                } rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                    >
                      {feature.details}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2">
                  <span>{isSelected ? 'Less details' : 'Learn more'}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              OUR MISSION
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Building Accountable, Responsive Communities
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We believe every citizen deserves a clean, safe, and efficiently managed neighborhood. Civix bridges the communication gap between citizens and authorities through real-time tracking, transparent voting, and verified status updates.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Instant geotagged issue reporting with photo uploads",
                "Transparent municipal workflow and status tracking",
                "Community voting to prioritize high-urgency fixes",
                "Direct feedback loop with local representatives"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <img 
                src={mission} 
                alt="Civix Mission" 
                className="w-full h-auto rounded-2xl object-cover mb-4"
              />
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Civic Core Commitment</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  100% Transparent. Powered by Citizens, Built for Everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-slate-900 dark:bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Make a Real Impact?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Join thousands of active citizens transforming their local neighborhoods today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/report-issue"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg active:scale-95 transition-all text-sm"
            >
              Get Started Now
            </Link>
            <Link
              to="/contact"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl border border-slate-700 active:scale-95 transition-all text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
