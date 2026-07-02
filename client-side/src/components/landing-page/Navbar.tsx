import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/liondesk.svg';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/' + targetId);
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-bg/85 backdrop-blur-md border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="LionDesk Logo" className="h-10 w-auto filter invert brightness-50" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold transition"
          >
            Features
          </a>
          <a
            href="#roles"
            onClick={(e) => handleNavClick(e, '#roles')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold transition"
          >
            Roles
          </a>
          <a
            href="#security"
            onClick={(e) => handleNavClick(e, '#security')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold transition"
          >
            Security &amp; Integrity
          </a>
          <a
            href="#about-cs"
            onClick={(e) => handleNavClick(e, '#about-cs')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold transition"
          >
            About CS UNN
          </a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="text-brand-text-muted hover:text-brand-primary text-sm font-bold px-4 py-2 hover:bg-brand-silver/20 rounded-lg transition border border-transparent hover:border-brand-border"
          >
            Log In
          </Link>
          <Link
            to="/activate"
            className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-brand-primary/10 transition border border-brand-primary"
          >
            Activate Account
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-brand-text-muted hover:text-brand-primary focus:outline-none"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.828 4.828 4.829z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Links Panel */}
      {isOpen && (
        <div className="md:hidden bg-brand-bg border-t border-brand-border/40 px-6 py-4 flex flex-col space-y-4">
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, '#features')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold py-1 transition"
          >
            Features
          </a>
          <a
            href="#roles"
            onClick={(e) => handleNavClick(e, '#roles')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold py-1 transition"
          >
            Roles
          </a>
          <a
            href="#security"
            onClick={(e) => handleNavClick(e, '#security')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold py-1 transition"
          >
            Security &amp; Integrity
          </a>
          <a
            href="#about-cs"
            onClick={(e) => handleNavClick(e, '#about-cs')}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-semibold py-1 transition"
          >
            About CS UNN
          </a>
          <div className="h-px bg-brand-border/40 my-2" />
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-brand-text-muted hover:text-brand-primary text-sm font-bold py-2 text-center hover:bg-brand-silver/20 rounded-lg transition"
          >
            Log In
          </Link>
          <Link
            to="/activate"
            onClick={() => setIsOpen(false)}
            className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-2.5 text-center rounded-lg shadow-md hover:shadow-brand-primary/10 transition block"
          >
            Activate Account
          </Link>
        </div>
      )}
    </nav>
  );
};
