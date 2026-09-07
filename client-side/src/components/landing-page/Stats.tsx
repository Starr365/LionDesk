import React from 'react';

export const Stats: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-brand-card border-t border-b border-brand-border/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-bg border border-brand-border/60 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-brand-primary shadow-xs">
              <span>THE CHALLENGE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-tight">
              From scattered enquiries to timely resolution.
            </h2>
            <p className="text-brand-text-muted leading-relaxed text-base sm:text-lg font-medium">
              Student questions about course registration, missing grades, project topics, or lab issues often get lost in crowded WhatsApp groups and full email inboxes. LionDesk provides one unified platform where every request is recorded, assigned to the right lecturer, and tracked until it is solved.
            </p>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 md:gap-8">
            <div className="stagger-item bg-brand-bg border border-brand-border/60 p-6 rounded-2xl space-y-2 shadow-xs hover:border-brand-primary/40 transition duration-200">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                3
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Dedicated Portals
              </p>
              <p className="text-[11px] text-brand-text-muted font-semibold">
                Students, Staff & Administrators
              </p>
            </div>
            <div className="stagger-item bg-brand-bg border border-brand-border/60 p-6 rounded-2xl space-y-2 shadow-xs hover:border-brand-primary/40 transition duration-200">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                100%
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Accountability
              </p>
              <p className="text-[11px] text-brand-text-muted font-semibold">
                Complete history on every enquiry
              </p>
            </div>
            <div className="stagger-item bg-brand-bg border border-brand-border/60 p-6 rounded-2xl space-y-2 shadow-xs hover:border-brand-primary/40 transition duration-200">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                Direct
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Staff Routing
              </p>
              <p className="text-[11px] text-brand-text-muted font-semibold">
                Assigned straight to course lecturers
              </p>
            </div>
            <div className="stagger-item bg-brand-bg border border-brand-border/60 p-6 rounded-2xl space-y-2 shadow-xs hover:border-brand-primary/40 transition duration-200">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                Active
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Auto-Escalation
              </p>
              <p className="text-[11px] text-brand-text-muted font-semibold">
                Overdue issues alert department heads
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
