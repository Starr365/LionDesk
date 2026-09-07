import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/liondesk.svg';

export const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-bg border-t border-brand-border/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand & Department Summary */}
          <div className="sm:col-span-2 md:col-span-4 space-y-4">
            <Link to="/">
              <img src={logo} alt="LionDesk Logo" className="h-10 w-auto filter invert brightness-50" />
            </Link>
            <p className="text-xs text-brand-text-muted max-w-sm leading-relaxed font-semibold">
              Departmental help-desk and ticketing system for the Department of Computer Science, University of Nigeria, Nsukka.
            </p>
          </div>

          {/* Column 1: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Navigation</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-brand-primary transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScrollTo(e, '#features')}
                  className="hover:text-brand-primary transition"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollTo(e, '#how-it-works')}
                  className="hover:text-brand-primary transition"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#roles"
                  onClick={(e) => handleScrollTo(e, '#roles')}
                  className="hover:text-brand-primary transition"
                >
                  Roles & Portals
                </a>
              </li>
              <li>
                <a
                  href="#documentation"
                  onClick={(e) => handleScrollTo(e, '#documentation')}
                  className="hover:text-brand-primary transition"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Portal Access */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Portal Access</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li>
                <Link to="/activate" className="hover:text-brand-primary transition">
                  Activate Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-primary transition">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-brand-primary transition">
                  Password Reset
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Department & Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Department</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li>
                <a
                  href="https://cs.unn.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition"
                >
                  Department of Computer Science
                </a>
              </li>
              <li>
                <a
                  href="https://unn.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition"
                >
                  University of Nigeria, Nsukka
                </a>
              </li>
              <li>
                <a
                  href="https://nacos.org.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary transition"
                >
                  NACOS UNN
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[11px] text-brand-text-muted font-semibold">
          <span>
            &copy; {new Date().getFullYear()} LionDesk. Department of Computer Science, University of Nigeria, Nsukka.
          </span>
          <div className="flex space-x-4">
            <a
              href="https://github.com/Starr365/LionDesk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-primary transition"
            >
              GitHub Repository
            </a>
            <span>&bull;</span>
            <a
              href="#documentation"
              onClick={(e) => handleScrollTo(e, '#documentation')}
              className="hover:text-brand-primary transition"
            >
              Project Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
