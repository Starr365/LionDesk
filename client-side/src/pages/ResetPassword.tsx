import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword: React.FC = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (code.trim().length !== 6 || isNaN(Number(code))) {
      setErrorMsg('Please enter a valid 6-digit numeric recovery code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    resetPassword.mutate(
      { token: code.trim(), new_password: newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated successfully! Please log in.');
          navigate('/login');
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.error || 'Invalid recovery code or connection issue.';
          setErrorMsg(errMsg);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Decorative Line Art Illustrations */}
      <div className="absolute top-1/4 left-8 md:left-24 hidden lg:block opacity-60 pointer-events-none">
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80 Q 50 10, 100 80 T 190 80" stroke="#004d26" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="30" y="100" width="130" height="80" rx="6" stroke="#b9c0c3" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <circle cx="145" cy="120" r="4" fill="#00FF87" />
        </svg>
      </div>

      {/* Header bar */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          LionDesk
        </Link>
        <Link to="/login" className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4.5 py-2.5 rounded-lg transition shadow-xs">
          Back to Login
        </Link>
      </header>

      {/* Main card */}
      <main className="grow flex items-center justify-center py-10 z-10">
        <div className="bg-brand-card border border-brand-border/40 w-full max-w-md rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text-main">
              Reset Password
            </h2>
            <p className="text-sm text-brand-text-muted font-semibold leading-relaxed">
              Enter your recovery code and set your new passcode.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold rounded-xl text-center leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                6-Digit Recovery Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit recovery code"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium tracking-widest text-center transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl pl-4 pr-11 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted/80 hover:text-brand-primary transition focus:outline-none flex items-center justify-center"
                >
                  {showPassword ? <FiEyeOff className="h-4.5 w-4.5" /> : <FiEye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
              />
            </div>

            <button
              type="submit"
              disabled={resetPassword.isPending}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3.5 px-4 rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2"
            >
              {resetPassword.isPending ? <span>Resetting...</span> : <span>Update Password</span>}
            </button>
          </form>

          <div className="text-center text-xs text-brand-text-muted font-bold border-t border-brand-border/25 pt-4">
            Remembered password?{' '}
            <Link to="/login" className="text-brand-primary hover:text-brand-primary-hover transition">
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="text-center text-[10px] text-brand-text-muted/75 font-semibold py-4 max-w-7xl mx-auto w-full border-t border-brand-border/20 flex justify-between items-center">
        <span>Copyright @liondesk 2026</span>
        <div className="space-x-4">
          <Link to="/docs" className="hover:text-brand-primary transition">Privacy Policy</Link>
          <span>|</span>
          <Link to="/docs" className="hover:text-brand-primary transition">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
