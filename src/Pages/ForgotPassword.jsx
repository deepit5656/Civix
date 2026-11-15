import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaEnvelope, FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { authAPI } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendResetCode = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await authAPI.sendOTP({ email, type: 'reset-password' });
      setStep(2);
      toast.success('Reset code sent to your email');
    } catch (error) {
      toast.error(error.message || 'Could not send reset code');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, newPassword });
      toast.success('Password reset successfully');
      setStep(3);
    } catch (error) {
      toast.error(error.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-16 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <FaShieldAlt />
          </div>
          <h1 className="text-2xl font-bold">{step === 3 ? 'Password updated' : 'Reset your password'}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {step === 1 && 'We will send a one-time code to your registered email.'}
            {step === 2 && 'Enter the code and choose a new password.'}
            {step === 3 && 'You can now sign in with your new password.'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={sendResetCode} className="space-y-4">
            <label className="block text-sm font-semibold">Email address
              <span className="relative mt-2 block">
                <FaEnvelope className="absolute left-3 top-3.5 text-slate-400" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </span>
            </label>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
              {loading ? 'Sending...' : 'Send reset code'} <FaArrowRight />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <label className="block text-sm font-semibold">Six-digit code
              <span className="relative mt-2 block">
                <FaKey className="absolute left-3 top-3.5 text-slate-400" />
                <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 tracking-[0.35em] outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </span>
            </label>
            <label className="block text-sm font-semibold">New password
              <span className="relative mt-2 block">
                <FaLock className="absolute left-3 top-3.5 text-slate-400" />
                <input required minLength={6} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-3 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </span>
            </label>
            <label className="block text-sm font-semibold">Confirm password
              <input required minLength={6} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
            </label>
            <button disabled={loading} className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <Link to="/login" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500">
            Continue to login <FaArrowRight />
          </Link>
        )}

        {step !== 3 && <Link to="/login" className="mt-6 block text-center text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400">Back to login</Link>}
      </div>
    </main>
  );
}
