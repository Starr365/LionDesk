import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Activate: React.FC = () => {
  const [matricNumber, setMatricNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Activation details:', { matricNumber, fullName, email, password });
    // Demo redirects on success
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Decorative Line Art Illustrations */}
      <div className="absolute top-1/4 left-8 md:left-24 hidden lg:block opacity-60 pointer-events-none">
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 80 Q 50 10, 100 80 T 190 80" stroke="#004d26" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="30" y="100" width="130" height="80" rx="6" stroke="#b9c0c3" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <line x1="50" y1="125" x2="120" y2="125" stroke="#b9c0c3" strokeWidth="2" />
          <line x1="50" y1="145" x2="100" y2="145" stroke="#b9c0c3" strokeWidth="2" />
          <circle cx="145" cy="120" r="4" fill="#00FF87" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-8 md:right-20 hidden lg:flex flex-col items-center opacity-70 pointer-events-none">
        <svg width="280" height="240" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 180 L110 180 L125 155 L65 155 Z" fill="none" stroke="#004d26" strokeWidth="2.5" />
          <path d="M150 200 C150 160, 130 140, 115 130 L115 90 C115 90, 125 90, 130 85 C135 80, 135 70, 130 65 C125 60, 115 65, 110 70 L100 85 L90 120 C90 120, 80 145, 95 155" stroke="#004d26" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="135" y="175" width="65" height="60" fill="none" stroke="#004d26" strokeWidth="2.5" rx="4" />
          <circle cx="150" cy="195" r="3" fill="#004d26" />
          <circle cx="165" cy="210" r="3" fill="#004d26" />
          <circle cx="180" cy="195" r="3" fill="#004d26" />
          <circle cx="150" cy="215" r="3" fill="#004d26" />
          <circle cx="170" cy="225" r="3" fill="#004d26" />
        </svg>
      </div>

      {/* Header bar */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
          LionDesk
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-semibold hover:text-brand-primary transition">
            Sign in
          </Link>
          <Link to="/" className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-bold px-4.5 py-2.5 rounded-lg transition shadow-xs">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main card */}
      <main className="grow flex items-center justify-center py-10 z-10">
        <div className="bg-brand-card border border-brand-border/40 w-full max-w-md rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text-main">
              Student Activation
            </h2>
            <p className="text-sm text-brand-text-muted font-semibold leading-relaxed">
              Activate your account using pre-verified registration details.
            </p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                Matric / Reg Number
              </label>
              <input
                type="text"
                required
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                placeholder="e.g., 202X/XXXXXX"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As registered in DB"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Preferred portal email"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                Create Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-bg/40 border border-brand-border/50 rounded-xl px-4 py-3 text-sm text-brand-text-main placeholder-brand-text-muted/65 focus:outline-none focus:border-brand-primary font-medium transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-brand-white font-extrabold py-3.5 px-4 rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200"
            >
              Activate Profile
            </button>
          </form>

          <div className="text-center text-xs text-brand-text-muted font-bold border-t border-brand-border/25 pt-4">
            Already activated?{' '}
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

export default Activate;
