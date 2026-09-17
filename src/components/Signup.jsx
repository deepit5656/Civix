import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaArrowRight, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import signupImage from '../assets/signup.png';

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

const Signup = () => {
  const navigate = useNavigate();
  const { signup, sendOTP, verifyOTP, isAuthenticated, user } = useAuthContext();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [debugOtp, setDebugOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error('Username can only contain letters, numbers, and underscores');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  // Trigger Signup OTP
  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await sendOTP(formData.email, 'signup');
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setShowOtpModal(true);
      toast.success('📩 OTP verification code sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP verification code');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Complete Registration
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      toast.error('Please enter the complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP first
      await verifyOTP(formData.email, fullOtp, 'signup');

      // 2. Register User
      const data = await signup({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: fullOtp,
      });

      setShowOtpModal(false);
      toast.success(data.user?.role === 'admin' ? '👑 Admin Account Created Successfully!' : '🎉 Account Created Successfully!');

      setTimeout(() => {
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile-setup');
        }
      }, 800);
    } catch (err) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const isAdminEmail = formData.email.trim().toLowerCase() === 'admin123@gmail.com';

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-gray-900 to-slate-950 p-4 md:p-8 font-inter text-white">
      {/* Left Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 justify-center items-center p-6"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <motion.img
            src={signupImage}
            alt="Civix Signup Illustration"
            className="relative w-full max-w-lg h-auto object-contain drop-shadow-2xl rounded-2xl"
            animate={floatAnimation}
          />
        </div>
      </motion.div>

      {/* Right Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 w-full max-w-md"
      >
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Header Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl"></div>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
              <FaShieldAlt className="text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-sm text-gray-400 mt-1">Join Civix to empower your local community</p>
          </div>

          {/* Admin Email Notice */}
          {isAdminEmail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"
            >
              <span>👑</span>
              <span><strong>Admin Email Detected:</strong> This account will be granted full Administrator access.</span>
            </motion.div>
          )}

          <form onSubmit={handleInitiateSignup} className="space-y-3.5">
            {/* Username & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Username *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="username"
                    required
                    placeholder="john_doe"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-xs text-white placeholder-gray-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-xs text-white placeholder-gray-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-xs text-white placeholder-gray-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-xs text-white placeholder-gray-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Confirm Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-9 py-2 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-xs text-white placeholder-gray-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white text-xs"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify Email & Continue <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              Sign in
            </Link>
            <div className="mt-2">
              <Link to="/" className="text-gray-500 hover:text-gray-300">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm"
              >
                <FaTimes />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white">Enter Verification OTP</h3>
                <p className="text-xs text-gray-400 mt-1">We sent a 6-digit code to</p>
                <p className="text-xs font-semibold text-emerald-400">{formData.email}</p>
              </div>

              {debugOtp && (
                <div className="mb-4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs">
                  Test Mode OTP Code: <strong>{debugOtp}</strong>
                </div>
              )}

              <form onSubmit={handleCompleteSignup} className="space-y-5">
                <div className="flex justify-between gap-1.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-10 h-12 text-center text-lg font-bold bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-emerald-400 transition"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Create Account'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;
