import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Switch from '../DarkModeToggle';
import logo from '../assets/logo.png';
import { Info, Phone, Users, User, LogOut, Shield, LayoutDashboard, BookOpen, Menu, X, AlertTriangle, Vote, Map } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const rightDropdownRef = useRef(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuthContext();

  const handleNav = (cb) => {
    setMobileMenuOpen(false);
    if (cb) cb();
  };

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
    {
      title: "About",
      href: "/about",
      icon: Info,
    },
    {
      title: "Contact Us",
      href: "/contact",
      icon: Phone,
    },
    {
      title: "Our contributors",
      href: "/contributors",
      icon: Users,
    },
    {
      title: "Voting System",
      href: "/voting-system",
      icon: Vote,
    },
    {
      title: "Issue Map",
      href: "/user-map",
      icon: Map,
    },
    {
      title: "Feedback",
      href: "/feedback",
      icon: AlertTriangle,
    },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-green-100 dark:border-green-900/20 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center">
            <button 
              onClick={() => { setMobileMenuOpen(false); navigate('/'); }} 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Civix logo" 
                  className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((navItem) => {
              const Icon = navItem.icon;
              const isActive = location.pathname === navItem.href;
              return (
                <Link
                  key={navItem.title}
                  to={navItem.href}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'text-green-700 dark:text-green-300 bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-green-200/50 dark:border-green-700/50'
                      : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 dark:from-green-500/20 dark:to-emerald-500/20 rounded-xl" />
                  )}
                  <Icon className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span className="relative z-10">{navItem.title}</span>
                </Link>
              );
            })}
          </nav>

          <button
            id="mobile-nav-toggle"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-300 group"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Menu className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-5">
            <button
              onClick={handleSOSClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-red-200 dark:hover:shadow-red-900/50 transform hover:scale-105 transition-all duration-300 group"
              title="Emergency SOS"
              aria-label="Emergency SOS Button"
            >
              <AlertTriangle className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>SOS</span>
            </button>

            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/50 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors duration-300">
              <Switch />
            </div>

            <div className="relative" ref={rightDropdownRef}>
              <button
                onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/50 transform hover:scale-105 transition-all duration-300 font-bold"
                aria-label="Open user menu"
              >
                {isAuthenticated ? userInitial : <User className="h-5 w-5" />}
              </button>

              {rightDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-green-100 dark:border-green-900/20 z-50 overflow-hidden">
                  <div className="p-2">
                    {isAuthenticated && (
                      <div className="px-4 py-3 bg-green-50 dark:bg-slate-800/60 rounded-xl mb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || user?.username}</p>
                          {isAdmin && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-full">ADMIN</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      </div>
                    )}

                    <button
                      onClick={() => { setRightDropdownOpen(false); navigate('/civic-education'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-xl transition-all duration-200 group"
                    >
                      <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Civic Education & Rights</span>
                    </button>
                    
                    {!isAuthenticated ? (
                      <>
                        <button
                          onClick={() => { setRightDropdownOpen(false); navigate('/login'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 group mt-2"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Login</span>
                        </button>
                        <button
                          onClick={() => { setRightDropdownOpen(false); navigate('/signup'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-emerald-500/30 rounded-xl transition-all duration-200 group mt-1"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Sign Up</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-green-100 dark:border-green-900/20 my-2"></div>
                        
                        <button
                          onClick={() => { setRightDropdownOpen(false); navigate('/profile'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-xl transition-all duration-200 group"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Profile</span>
                        </button>
                        
                        <button
                          onClick={() => { setRightDropdownOpen(false); navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard'); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-xl transition-all duration-200 group"
                        >
                          {isAdmin ? (
                            <Shield className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform duration-200" />
                          ) : (
                            <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          )}
                          <span>Dashboard</span>
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-gradient-to-r from-red-500 to-red-600 rounded-xl transition-all duration-200 group mt-2"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Logout</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;