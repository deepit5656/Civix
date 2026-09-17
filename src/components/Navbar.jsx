import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Switch from '../DarkModeToggle';
import logo from '../assets/logo1.png';
import { Info, Phone, Users, User, LogOut, Shield, LayoutDashboard, BookOpen, Menu, X, AlertTriangle, Vote, Map, Sparkles } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const rightDropdownRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    setRightDropdownOpen(false);
    navigate('/');
  };

  const handleSOSClick = () => {
    navigate('/sos');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rightDropdownRef.current && !rightDropdownRef.current.contains(event.target)) {
        setRightDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { title: "About", href: "/about", icon: Info },
    { title: "Contact", href: "/contact", icon: Phone },
    { title: "Contributors", href: "/contributors", icon: Users },
    { title: "Voting System", href: "/voting-system", icon: Vote },
    { title: "Issue Map", href: "/user-map", icon: Map },
    { title: "Feedback", href: "/feedback", icon: AlertTriangle },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U');

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-lg shadow-slate-900/5 px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/'); }} 
              className="flex items-center gap-3 group"
            >
              <div className="relative flex items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-transform group-hover:scale-105">
                <img 
                  src={logo} 
                  alt="Civix logo" 
                  className="h-8 w-auto object-contain" 
                />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight hidden sm:inline-block">
                CIVIX
              </span>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((navItem) => {
              const Icon = navItem.icon;
              const isActive = location.pathname === navItem.href;
              return (
                <Link
                  key={navItem.title}
                  to={navItem.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'text-white bg-emerald-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-white' : 'group-hover:scale-110 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600'
                  }`} />
                  <span>{navItem.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* SOS Action Button */}
            <button
              onClick={handleSOSClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl shadow-md transition-all duration-200"
              title="Emergency SOS"
              aria-label="Emergency SOS Button"
            >
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>SOS</span>
            </button>

            {/* Dark Mode Switch */}
            <div className="flex items-center justify-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Switch />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={rightDropdownRef}>
              <button
                onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all font-bold text-xs"
                aria-label="Open user menu"
              >
                {isAuthenticated ? userInitial : <User className="h-4 w-4" />}
              </button>

              {rightDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden p-2 space-y-1">
                  {isAuthenticated && (
                    <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl mb-1 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || user?.username}</p>
                        {isAdmin && (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded-md">ADMIN</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                  )}

                  <button
                    onClick={() => { setRightDropdownOpen(false); navigate('/civic-education'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 rounded-xl transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Civic Education & Rights</span>
                  </button>
                  
                  {!isAuthenticated ? (
                    <div className="pt-1 space-y-1.5">
                      <button
                        onClick={() => { setRightDropdownOpen(false); navigate('/login'); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Log In</span>
                      </button>
                      <button
                        onClick={() => { setRightDropdownOpen(false); navigate('/signup'); }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-xl transition-all"
                      >
                        <span>Create Account</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                      
                      <button
                        onClick={() => { setRightDropdownOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 rounded-xl transition-all"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => { setRightDropdownOpen(false); navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 rounded-xl transition-all"
                      >
                        {isAdmin ? (
                          <Shield className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>Dashboard</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Switch />
            <button
              id="mobile-nav-toggle"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 py-4 px-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="grid grid-cols-2 gap-1.5">
              {navLinks.map((navItem) => {
                const Icon = navItem.icon;
                const isActive = location.pathname === navItem.href;
                return (
                  <Link
                    key={navItem.title}
                    to={navItem.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                      isActive
                        ? 'text-white bg-emerald-600'
                        : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{navItem.title}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); handleSOSClick(); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency SOS</span>
              </button>

              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl text-center shadow-sm"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                    className="py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-center"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard'); }}
                    className="py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 rounded-xl text-center"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="py-2 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/50 rounded-xl text-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;