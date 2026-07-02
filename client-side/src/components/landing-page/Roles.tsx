import React from 'react';
import { Link } from 'react-router-dom';

export const Roles: React.FC = () => {
  return (
    <section id="roles" className="py-20 md:py-28 relative bg-brand-bg border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Role-Based Access Control
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            Dedicated workspaces built for your specific objective.
          </h2>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Student Card */}
          <div className="bg-brand-card border border-brand-border/45 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 relative group shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Identity Verified
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">STUDENT</h3>
              </div>
              <div className="h-px bg-brand-border/30" />
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>One-click activation</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Categorized submission</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Open/Reopen capability</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Feedback submission</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/activate"
                className="w-full block text-center bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 border border-brand-primary shadow-xs"
              >
                Activate Account
              </Link>
            </div>
          </div>

          {/* Faculty Staff Card */}
          <div className="bg-brand-card border-2 border-brand-primary/75 p-8 rounded-3xl flex flex-col justify-between relative group shadow-md">
            {/* Featured Badge */}
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-primary text-brand-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Departmental Staff
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Admin Provisioned
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">FACULTY STAFF</h3>
              </div>
              <div className="h-px bg-brand-border/40" />
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Personal workflow queue</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Target status tracking</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>In-depth comment logs</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Direct resolution notes</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full block text-center bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 shadow-xs"
              >
                Staff Sign In
              </Link>
            </div>
          </div>

          {/* Administrator (HOD) Card */}
          <div className="bg-brand-card border border-brand-border/45 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 relative group shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Complete Oversight
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">ADMINISTRATOR (HOD)</h3>
              </div>
              <div className="h-px bg-brand-border/30" />
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Track all department tickets instantly</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Configure escalations</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-brand-text-muted font-medium">
                  <span className="text-brand-primary font-bold text-lg leading-none">&bull;</span>
                  <span>Manage user accounts</span>
                </li>
              </ul>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full block text-center bg-transparent hover:bg-brand-primary text-brand-primary hover:text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 border border-brand-primary shadow-xs"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
