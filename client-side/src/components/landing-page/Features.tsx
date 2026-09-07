import React from 'react';

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
            Key Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            Built for everyday departmental needs.
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
              <h3 className="text-xl font-extrabold text-brand-text-main">Simple Issue Submission</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                Students can quickly submit requests for course registration, missing grades, project issues, or lab access with supporting files.
              </p>
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
              <h3 className="text-xl font-extrabold text-brand-text-main">Direct Lecturer Assignment</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                Every ticket is automatically forwarded to the responsible course lecturer or departmental officer based on the chosen category.
              </p>
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
              <h3 className="text-xl font-extrabold text-brand-text-main">Guaranteed Follow-Up</h3>
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                If a request isn't attended to in reasonable time, it automatically escalates to the Head of Department or Admin so no issue is ignored.
              </p>
            </div>
          </div>
        </div>

        {/* Lifecycle Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4">
          {['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className="inline-flex items-center bg-brand-card border border-brand-border/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-text-main tracking-wide shadow-xs">
                {step}
              </span>
              {i < arr.length - 1 && (
                <span className="text-brand-border font-bold text-xs">&bull;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
