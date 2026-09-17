import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Home.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "./context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import TestimonialCarousel from "./components/TestimonialCarousel";
import EnhancedQRCode from "./components/EnhancedQRCode";
import ProfileCompletionBanner from "./components/ProfileCompletionBanner";
import useProfileStatus from "./hooks/useProfileStatus";

import {
  FaCamera,
  FaLocationDot,
  FaClock,
  FaUserGroup,
  FaShieldHalved,
  FaCircleCheck,
  FaArrowRight,
  FaStar,
  FaChevronDown,
  FaApple,
  FaGooglePlay,
  FaSparkles,
  FaWrench,
  FaPlay,
  FaChartLine,
  FaBullhorn,
  FaCircleQuestion,
} from "react-icons/fa6";

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqFilter, setFaqFilter] = useState("All");
  const navigate = useNavigate();
  const { user, isAuthenticated: isSignedIn } = useAuthContext();
  const { isProfileComplete, isLoading: profileLoading } = useProfileStatus();

  // Redirect incomplete profiles to profile-setup if signed in
  useEffect(() => {
    const profileJustSubmitted = sessionStorage.getItem("profileJustSubmitted") === "true";

    if (isSignedIn && !profileLoading && !isProfileComplete && !profileJustSubmitted) {
      navigate("/profile-setup");
    }
  }, [isSignedIn, profileLoading, isProfileComplete, navigate]);

  const questions = [
    {
      id: 1,
      question: "What is Civix?",
      answer:
        "Civix is a modern civic engagement platform empowering citizens to report, track, and resolve local community issues like potholes, broken streetlights, water leakages, and sanitation hazards.",
      popular: true,
      category: "General",
      icon: <FaBullhorn className="text-emerald-500 text-lg" />,
    },
    {
      id: 2,
      question: "How do I report a new civic issue?",
      answer:
        "Reporting is fast and effortless! Click 'Report Issue', upload a clear photo of the problem, auto-detect your location on our interactive map, and submit. City teams and local authorities receive it instantly.",
      popular: true,
      category: "Usage",
      icon: <FaCamera className="text-emerald-500 text-lg" />,
    },
    {
      id: 3,
      question: "Is Civix completely free for citizens?",
      answer:
        "Yes, Civix is 100% free for all citizens and community members. There are no subscriptions, hidden charges, or premium paywalls.",
      popular: true,
      category: "General",
      icon: <FaCircleCheck className="text-emerald-500 text-lg" />,
    },
    {
      id: 4,
      question: "How can I track the live status of my complaint?",
      answer:
        "Navigate to your personal User Dashboard to view real-time updates, official status badges (Pending, In Progress, Resolved), and inspect technician timeline notes.",
      popular: false,
      category: "Tracking",
      icon: <FaClock className="text-emerald-500 text-lg" />,
    },
    {
      id: 5,
      question: "Can I upvote and prioritize issues in my neighborhood?",
      answer:
        "Yes! You can browse neighborhood complaints and upvote critical issues. High-priority upvoted issues automatically gain top visibility on municipal administration boards.",
      popular: true,
      category: "Community",
      icon: <FaUserGroup className="text-emerald-500 text-lg" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "I submitted a photo of a dangerous open pothole near our school. Within 48 hours, municipal contractors arrived and paved the entire stretch!",
      name: "Aarav Patel",
      role: "Resident, Bangalore",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      category: "Infrastructure",
    },
    {
      quote:
        "Civix has streamlined city administration workflow. We can pinpoint high-density problem zones instantly and dispatch repair teams with precision.",
      name: "Akshay Prakash",
      role: "Public Works Lead, New Delhi",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5,
      category: "Management",
    },
    {
      quote:
        "The real-time status notifications and community voting make everyone in our residential area feel accountable and connected.",
      name: "Meera Sharma",
      role: "Community Lead, Chennai",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5,
      category: "Community",
    },
    {
      quote:
        "Our municipal complaint resolution index improved by over 300% after rolling out Civix. Transparent tracking builds genuine public trust.",
      name: "Rahul Singh",
      role: "City Officer, Mumbai",
      avatar: "https://randomuser.me/api/portraits/men/57.jpg",
      rating: 5,
      category: "Government",
    },
  ];

  const features = [
    {
      icon: <FaCamera className="text-2xl text-emerald-500" />,
      title: "Instant Visual Reporting",
      description:
        "Capture civic issues directly from your smartphone with precise geolocation tagging and instant image uploads.",
      highlights: ["High-res photo upload", "Auto-GPS pin tagging", "Categorized issue routing"],
    },
    {
      icon: <FaChartLine className="text-2xl text-emerald-500" />,
      title: "Real-Time Tracking",
      description:
        "Monitor status progression from initial submission to verified resolution with live municipal updates.",
      highlights: ["Stage progress timeline", "Live push notifications", "Resolution photo proof"],
    },
    {
      icon: <FaUserGroup className="text-2xl text-emerald-500" />,
      title: "Community Upvoting",
      description:
        "Collaborate with neighbors to upvote critical local problems and drive immediate municipal prioritization.",
      highlights: ["Community voting index", "Neighborhood trend maps", "Priority issue board"],
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Spot & Snap Issue",
      description:
        "Take a quick photo of the civic problem, add brief details, and allow auto-geolocation to mark the exact spot.",
      icon: <FaCamera className="text-emerald-400 text-xl" />,
    },
    {
      step: "02",
      title: "Municipal Verification",
      description:
        "Local city officers evaluate reports, assign work orders to field crews, and set repair schedules.",
      icon: <FaWrench className="text-emerald-400 text-xl" />,
    },
    {
      step: "03",
      title: "Verified Resolution",
      description:
        "Field crews complete repairs and upload proof. Citizens verify completion and close the ticket with feedback.",
      icon: <FaCircleCheck className="text-emerald-400 text-xl" />,
    },
  ];

  const handleCTA = () => {
    if (isSignedIn) {
      navigate("/user/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-inter selection:bg-emerald-500 selection:text-white">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        theme="dark"
        toastClassName="!bg-slate-900 !text-slate-100 !border !border-slate-800 !rounded-xl shadow-2xl"
      />

      <Helmet>
        <title>Civix | Modern Civic Engagement & Issue Reporting Platform</title>
        <meta
          name="description"
          content="Report and resolve local civic issues like potholes, broken lights, and garbage collection problems with Civix."
        />
      </Helmet>

      <main className="flex-1">
        {/* Profile Completion Banner */}
        <ProfileCompletionBanner />

        {/* ─── HERO SECTION ────────────────────────────────────────────────────────── */}
        <section className="relative py-16 lg:py-24 bg-slate-950 border-b border-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headline & Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 flex flex-col items-start space-y-6"
              >
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
                  <FaSparkles className="text-emerald-400" />
                  <span>India's Leading Civic Action Platform</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Report Civic Issues. <br />
                  <span className="text-emerald-400">Transform Your City.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
                  Civix bridges citizens and municipal authorities to fast-track repairs for potholes, broken lights, sanitation, and public infrastructure.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
                  <button
                    onClick={handleCTA}
                    className="inline-flex items-center justify-center px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <span>{isSignedIn ? "Go to Dashboard" : "Get Started Now"}</span>
                    <FaArrowRight className="ml-2.5 text-sm transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => {
                      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-base rounded-xl border border-slate-800 transition-all duration-200 group"
                  >
                    <FaPlay className="mr-2 text-xs text-emerald-400" />
                    <span>How It Works</span>
                  </button>
                </div>

                {/* Rating & Social Proof */}
                <div className="pt-4 flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium text-slate-300">
                    <strong>4.9/5</strong> rating from 25,000+ active citizens
                  </span>
                </div>
              </motion.div>

              {/* Right Column: Interactive Card Demonstration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 flex justify-center"
              >
                <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                        <FaShieldHalved className="text-lg" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Live Complaint Tracker</h3>
                        <p className="text-xs text-slate-400">Ticket #CX-89420 • Indiranagar</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-semibold">
                      In Progress
                    </span>
                  </div>

                  {/* Complaint Preview */}
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                        alt="Road Maintenance Demo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <FaLocationDot className="text-emerald-400" />
                        <span>Bengaluru East • 12.9716° N</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      <h4 className="text-sm font-bold text-white mb-1">Pothole Repair Request</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Assigned to Public Works Department. Crew dispatched with road paving equipment.
                      </p>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                      <span>Verification</span>
                      <span className="text-emerald-400 font-bold">75% Completed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ─── KEY FEATURES SECTION ──────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-3"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Built For Citizens & Municipal Speed
              </h2>
              <p className="text-base sm:text-lg text-slate-400">
                Civix delivers end-to-end transparency, removing bureaucracy and delivering verified community repairs.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feat.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {feat.description}
                  </p>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-900">
                    {feat.highlights.map((item, i) => (
                      <li key={i} className="flex items-center text-xs font-semibold text-slate-300 gap-2">
                        <FaCircleCheck className="text-emerald-400 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS SECTION ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 bg-slate-950 border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-3"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Simple Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                3 Steps to a Better Neighborhood
              </h2>
              <p className="text-base sm:text-lg text-slate-400">
                From identifying a problem to final inspection, experience seamless digital civic resolution.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-emerald-400 tracking-wider">
                      {st.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                      {st.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{st.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{st.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS & CAROUSEL ────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16 space-y-3"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Community Feedback
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Loved By Citizens & Administration
              </h2>
              <p className="text-base sm:text-lg text-slate-400">
                Read authentic testimonials from residents and municipal leaders using Civix daily.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {testimonials.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold">
                        {item.category}
                      </span>
                      <div className="flex text-amber-400 gap-1 text-xs">
                        {[...Array(item.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-300 text-base italic leading-relaxed">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-900">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Carousel Component */}
            <TestimonialCarousel />
          </div>
        </section>

        {/* ─── FAQ SECTION ───────────────────────────────────────────────────────── */}
        <section id="faqs" className="py-20 bg-slate-950 border-b border-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3 mb-12"
            >
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Help & Information
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-slate-400">
                Everything you need to know about using Civix in your locality.
              </p>

              {/* Filter Tabs */}
              <div className="flex items-center justify-center gap-3 pt-4">
                {["All", "Popular"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFaqFilter(type)}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                      faqFilter === type
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {type} Questions
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Accordion Cards */}
            <div className="space-y-4">
              {(faqFilter === "All" ? questions : questions.filter((q) => q.popular)).map((q) => {
                const isOpen = activeFaq === q.id;
                return (
                  <div
                    key={q.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : q.id)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {q.icon}
                        <span className="text-base font-bold text-white">{q.question}</span>
                      </div>
                      <FaChevronDown
                        className={`text-slate-400 text-xs transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-emerald-400" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5 pt-1 text-sm text-slate-300 border-t border-slate-800/80 leading-relaxed"
                        >
                          {q.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── DOWNLOAD / QR CODE SECTION ───────────────────────────────────────── */}
        <section id="download" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center shadow-2xl">
              
              <div className="lg:col-span-7 space-y-6">
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Mobile Apps Available
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Get Civix On Your Mobile Device
                </h2>

                <p className="text-slate-400 text-base leading-relaxed max-w-xl">
                  Download the official Civix mobile app to capture geotagged issues on the go, receive push status updates, and stay active in community voting.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link to="/download-ios">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all duration-200 gap-2.5 shadow-lg shadow-emerald-950/40">
                      <FaApple className="text-lg" />
                      <span>Download for iOS</span>
                    </button>
                  </Link>

                  <Link to="/download-android">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm rounded-xl border border-slate-800 transition-all duration-200 gap-2.5">
                      <FaGooglePlay className="text-base text-emerald-400" />
                      <span>Download for Android</span>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <EnhancedQRCode />
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;