import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Decorative Line Art */}
      <div className="absolute top-1/4 left-8 md:left-24 hidden lg:block opacity-60 pointer-events-none">
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80 Q 50 10, 100 80 T 190 80" stroke="#004d26" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="30" y="100" width="130" height="80" rx="6" stroke="#b9c0c3" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <line x1="50" y1="125" x2="120" y2="125" stroke="#b9c0c3" strokeWidth="2" />
        </svg>
      </div>

      <header className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          LionDesk
        </Link>
        <Link to="/login" className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4.5 py-2.5 rounded-lg transition shadow-xs">
          Back to Login
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center py-10 z-10">
        <div className="bg-brand-card border border-brand-border/40 w-full max-w-md rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text-main">
              Password Reset
            </h2>
            <p className="text-sm text-brand-text-muted font-semibold leading-relaxed">
              Retrieve access to your portal account.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  University Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@unn.edu.ng"
                  className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-xs text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3.5 px-4 rounded-xl shadow-xs transition"
              >
                Send Recovery Link
              </button>
            </form>
          ) : (
            <div className="p-4 bg-brand-primary/5 border border-brand-primary text-brand-primary text-xs font-bold rounded-xl text-center space-y-3">
              <p>Recovery link has been dispatched to your email address!</p>
              <p className="text-[10px] text-brand-text-muted font-semibold">
                Please check your university inbox or spam folder.
              </p>
            </div>
          )}

          <div className="text-center text-xs text-brand-text-muted font-bold border-t border-brand-border/25 pt-4">
            Remembered your passcode?{' '}
            <Link to="/login" className="text-brand-primary hover:text-brand-primary-hover transition">
              Sign In
            </Link>
          </div>
        </div>
      </main>

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

export default ForgotPassword;
