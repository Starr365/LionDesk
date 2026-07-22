import React from 'react';
import { Link } from 'react-router-dom';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute bottom-12 right-1/4 w-75 h-75 bg-brand-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-secondary">
            System Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            Powerful modules for swift resolution.
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="stagger-item bg-brand-card border border-brand-border/40 p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/55 transition duration-300 group shadow-xs">
            <div className="space-y-4">
              <div className="h-10 w-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition duration-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-brand-text-main">Structured Ticket Submission</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                Students can launch clear, categorized help requests from their dashboard. Complete with server-side text enforcement to ensure issues are descriptive enough to act upon instantly.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-extrabold px-4.5 py-2 rounded-lg transition duration-200">
                Learn about submissions &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="stagger-item bg-brand-card border border-brand-border/40 p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/55 transition duration-300 group shadow-xs">
            <div className="space-y-4">
              <div className="h-10 w-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition duration-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-brand-text-main">Pluggable Auto-Routing Engine</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                Say goodbye to duplicate or misdirected complaints. On submission, tickets are instantly processed and routed to specialized departmental staff based on smart workload queues.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-extrabold px-4.5 py-2 rounded-lg transition duration-200">
                Explore routing parameters &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="stagger-item bg-brand-card border border-brand-border/40 p-8 rounded-2xl flex flex-col justify-between hover:border-brand-primary/55 transition duration-300 group shadow-xs">
            <div className="space-y-4">
              <div className="h-10 w-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition duration-200">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-brand-text-main">Automated Escalation Protocols</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                Strict accountability built right in. If a critical category threshold is passed without a resolution note, the system triggers a background cron job to escalate the ticket directly to the HOD.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-extrabold px-4.5 py-2 rounded-lg transition duration-200">
                View escalation thresholds &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
