import React from 'react';

export const Stats: React.FC = () => {
  return (
    <section id="about-cs" className="py-20 md:py-28 bg-brand-bg border-t border-b border-brand-border/40 relative">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-card border border-brand-border/40 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-brand-primary">
              <span>Departmental Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-tight">
              Transitioning from manual lines to instant digital resolution.
            </h2>
            <p className="text-brand-text-muted leading-relaxed text-base sm:text-lg font-medium">
              We are replacing slow, undocumented physical office trackings with an authoritative reference engine. No more lost complaints, misplaced letters, or endless follow-up visits.
            </p>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 md:gap-8">
            <div className="stagger-item bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-2 shadow-sm">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                100%
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Digital Accountability
              </p>
            </div>
            <div className="stagger-item bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-2 shadow-sm">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                &lt; 3s
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Rapid Page Response
              </p>
            </div>
            <div className="stagger-item bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-2 shadow-sm">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                0
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Lost Submissions
              </p>
            </div>
            <div className="stagger-item bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-2 shadow-sm">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text-main tracking-tight">
                24/7
              </span>
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                Portal Availability
              </p>
            </div>
          </div>
        </div>

        {/* Trusted By Academic Badges Section */}
        <div className="pt-10 border-t border-brand-border/40 space-y-6">
          <p className="text-center text-xs font-bold text-brand-text-muted uppercase tracking-widest">
            Authorized and Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {/* Badge 1: UNN */}
            <div className="flex items-center space-x-2.5 bg-brand-card border border-brand-border/40 px-4 py-2 rounded-xl shadow-xs">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-bold text-brand-text-main uppercase tracking-wider">University of Nigeria</span>
            </div>

            {/* Badge 2: Faculty */}
            <div className="flex items-center space-x-2.5 bg-brand-card border border-brand-border/40 px-4 py-2 rounded-xl shadow-xs">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
              </svg>
              <span className="text-xs font-bold text-brand-text-main uppercase tracking-wider">Faculty of Physical Sciences</span>
            </div>

            {/* Badge 3: NACOS */}
            <div className="flex items-center space-x-2.5 bg-brand-card border border-brand-border/40 px-4 py-2 rounded-xl shadow-xs">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-bold text-brand-text-main uppercase tracking-wider">NACOS UNN</span>
            </div>

            {/* Badge 4: GDG */}
            <div className="flex items-center space-x-2.5 bg-brand-card border border-brand-border/40 px-4 py-2 rounded-xl shadow-xs">
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-bold text-brand-text-main uppercase tracking-wider">GDG Campus UNN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
