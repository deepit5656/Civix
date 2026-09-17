import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaKey, FaEye, FaEyeSlash, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { useAuthContext } from '../context/AuthContext';
import loginImage from '../assets/signup.png';

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
};

const Login = () => {
  const navigate = useNavigate();
  const { login, sendOTP, isAuthenticated, user } = useAuthContext();

  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [step, setStep] = useState(1); // For OTP mode: 1 = Email, 2 = Code
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');

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

  // Password Login Handler
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      toast.success(data.user?.role === 'admin' ? '👑 Admin Login Successful!' : '🎉 Login Successful!');
      
      const isComplete = Boolean(
        data.user?.isProfileComplete ||
        (data.user?.name && data.user?.email && data.user?.location)
      );
      if (isComplete) {
        localStorage.setItem('profileComplete', 'true');
      }

      setTimeout(() => {
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (isComplete) {
          navigate('/user/dashboard');
        } else {
          navigate('/profile-setup');
        }
      }, 800);
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Send Handler
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOTP(email, 'login');
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setStep(2);
      toast.success('📩 OTP verification code sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verify & Login Handler
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, otp: fullOtp });
      toast.success(data.user?.role === 'admin' ? '👑 Admin Login Successful!' : '🎉 Login Successful!');
      
      const isComplete = Boolean(
        data.user?.isProfileComplete ||
        (data.user?.name && data.user?.email && data.user?.location)
      );
      if (isComplete) {
        localStorage.setItem('profileComplete', 'true');
      }

      setTimeout(() => {
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (isComplete) {
          navigate('/user/dashboard');
        } else {
          navigate('/profile-setup');
        }
      }, 800);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const isAdminEmail = email.trim().toLowerCase() === 'admin123@gmail.com';

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-gray-900 to-slate-950 p-4 md:p-8 font-inter text-white">
      {/* Left Side Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 justify-center items-center p-6"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <motion.img
            src={loginImage}
            alt="Civix Login Illustration"
            className="relative w-full max-w-lg h-auto object-contain drop-shadow-2xl rounded-2xl"
            animate={floatAnimation}
          />
        </div>
      </motion.div>

      {/* Right Side - Custom Login Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 w-full max-w-md"
      >
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Header Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl"></div>

          {/* Title & Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
              <FaShieldAlt className="text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-gray-400 mt-1">Sign in to access your Civix account</p>
          </div>

          {/* Admin Email Notice */}
          {isAdminEmail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2"
            >
              <span>👑</span>
              <span><strong>Admin Email Detected:</strong> Logging in will grant Administrator privileges.</span>
            </motion.div>
          )}

          {/* Login Mode Toggle Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-gray-700/50">
            <button
              type="button"
              onClick={() => { setMode('password'); setStep(1); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'password'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('otp'); setStep(1); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'otp'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              OTP Quick Login
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Mode 1: Password Login */}
            {mode === 'password' && (
              <motion.form
                key="password-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePasswordLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white placeholder-gray-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white placeholder-gray-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In <FaArrowRight />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* Mode 2: OTP Login */}
            {mode === 'otp' && step === 1 && (
              <motion.form
                key="otp-step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-sm text-white placeholder-gray-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Send OTP Code <FaKey />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {mode === 'otp' && step === 2 && (
              <motion.form
                key="otp-step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpLogin}
                className="space-y-4"
              >
                <div className="text-center mb-2">
                  <p className="text-xs text-gray-400">Enter the 6-digit code sent to</p>
                  <p className="text-sm font-semibold text-emerald-400">{email}</p>
                </div>

                {debugOtp && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs">
                    Test Mode OTP Code: <strong>{debugOtp}</strong>
                  </div>
                )}

                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-11 h-12 text-center text-lg font-bold bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none text-emerald-400 transition"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Log In'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Change Email Address
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Links */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
              Sign up
            </Link>
            <div className="mt-2">
              <Link to="/" className="text-gray-500 hover:text-gray-300">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
