import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/liondesk.svg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-bg border-t border-brand-border/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Top footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link to="/">
              <img src={logo} alt="LionDesk Logo" className="h-10 w-auto filter invert brightness-50" />
            </Link>
            <p className="text-xs text-brand-text-muted max-w-xs leading-relaxed font-semibold">
              Official ticketing and support workspace for the Department of Computer Science, UNN. Built to accelerate academic workflows and resolutions.
            </p>
            <div className="flex items-center space-x-2 bg-brand-card border border-brand-border/40 py-1.5 px-3 rounded-full w-fit shadow-xs">
              <span className="flex h-2.5 w-2.5 rounded-full bg-brand-secondary animate-pulse" />
              <span className="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">All Systems Operational</span>
            </div>
          </div>

          {/* Links Column 1: System */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">System</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li><Link to="/login" className="hover:text-brand-primary transition">Shared Inbox</Link></li>
              <li><Link to="/login" className="hover:text-brand-primary transition">Ticket Timeline</Link></li>
              <li><Link to="/login" className="hover:text-brand-primary transition">Category Controls</Link></li>
              <li><Link to="/login" className="hover:text-brand-primary transition">Activity Logs</Link></li>
            </ul>
          </div>

          {/* Links Column 2: User Actions */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">User Actions</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li><Link to="/activate" className="hover:text-brand-primary transition">Student Activation</Link></li>
              <li><Link to="/login" className="hover:text-brand-primary transition">Staff Login</Link></li>
              <li><Link to="/login" className="hover:text-brand-primary transition">Admin Console</Link></li>
              <li><Link to="/forgot-password" className="hover:text-brand-primary transition">Password Recovery</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Academic Body */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Academic Body</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li><a href="https://cs.unn.edu.ng" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">Computer Science UNN</a></li>
              <li><a href="https://unn.edu.ng" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">Faculty of Physical Sciences</a></li>
              <li><a href="https://nacos.org.ng" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">NACOS UNN</a></li>
              <li><span className="text-brand-text-muted/60">Project Group 5</span></li>
            </ul>
          </div>

          {/* Links Column 4: Legal/Technical */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Legal / Technical</h5>
            <ul className="space-y-2 text-xs text-brand-text-muted font-semibold">
              <li><Link to="/docs" className="hover:text-brand-primary transition">Data Integrity Guidelines</Link></li>
              <li><Link to="/docs" className="hover:text-brand-primary transition">Role Middleware</Link></li>
              <li><Link to="/docs" className="hover:text-brand-primary transition">Encryption Standards</Link></li>
              <li><Link to="/docs" className="hover:text-brand-primary transition">System API</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-brand-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[11px] text-brand-text-muted font-semibold">
          <span>
            &copy; Copyright LionDesk 2026. Department of Computer Science, University of Nigeria, Nsukka.
          </span>
          <div className="flex space-x-4">
            <a href="https://github.com/Starr365/LionDesk" target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition">GitHub Repo</a>
            <span>&bull;</span>
            <Link to="/docs" className="hover:text-brand-primary transition">System Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
