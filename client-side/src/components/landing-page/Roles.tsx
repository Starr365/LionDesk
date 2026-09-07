import React from 'react';
import { Link } from 'react-router-dom';

export const Roles: React.FC = () => {
  return (
    <section id="roles" className="py-20 md:py-28 relative bg-brand-bg border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Dedicated Workspaces
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            Tailored for Every User
          </h2>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Student Card */}
          <div className="stagger-item bg-brand-card border border-brand-border/45 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 relative group shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Undergraduate & Postgraduate
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">Student Portal</h3>
              </div>
              <div className="h-px bg-brand-border/30" />
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                Submit enquiries, attach relevant course documents, receive real-time answers, and track resolution history.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/activate"
                className="w-full block text-center bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 border border-brand-primary shadow-xs"
              >
                Access Student Portal
              </Link>
            </div>
          </div>

          {/* Staff Card */}
          <div className="stagger-item bg-brand-card border-2 border-brand-primary/75 p-8 rounded-3xl flex flex-col justify-between relative group shadow-md">
            {/* Featured Badge */}
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-primary text-brand-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Academic & Non-Academic
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Lecturers & Officers
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">Staff Workspace</h3>
              </div>
              <div className="h-px bg-brand-border/40" />
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                View tickets assigned to your specific courses, provide explanations, post solutions, and mark requests as resolved.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full block text-center bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 shadow-xs"
              >
                Access Staff Workspace
              </Link>
            </div>
          </div>

          {/* Administrator Card */}
          <div className="stagger-item bg-brand-card border border-brand-border/45 p-8 rounded-3xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 relative group shadow-sm">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                  Head of Dept & Admins
                </span>
                <h3 className="text-2xl font-extrabold text-brand-text-main">Admin Console</h3>
              </div>
              <div className="h-px bg-brand-border/30" />
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                Oversee departmental support volume, reassign overdue tickets, manage categories and staff accounts, and view performance summaries.
              </p>
            </div>
            <div className="pt-8">
              <Link
                to="/login"
                className="w-full block text-center bg-transparent hover:bg-brand-primary text-brand-primary hover:text-brand-white text-sm font-bold py-3.5 rounded-xl transition duration-200 border border-brand-primary shadow-xs"
              >
                Access Admin Console
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
