import React from 'react';
import { Link } from 'react-router-dom';

export const Insights: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative border-t border-brand-border/40">
      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Help &amp; Guidance
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            Maximizing system transparency.
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-brand-card border border-brand-border/45 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 group shadow-sm">
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">
                Submission Guide
              </span>
              <h3 className="text-lg font-bold text-brand-text-main leading-snug group-hover:text-brand-primary transition duration-200">
                How to write efficient descriptions to fast-track your resolution.
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                Explore writing styles, context-rich details, and categorizations that help faculty address complaints immediately without long back-and-forth loops.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-bold px-4 py-2 rounded-lg transition duration-200">
                Read Article &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-brand-card border border-brand-border/45 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 group shadow-sm">
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">
                Technical Paper
              </span>
              <h3 className="text-lg font-bold text-brand-text-main leading-snug group-hover:text-brand-primary transition duration-200">
                A deep dive into the Object-Oriented Analysis &amp; Design Methodology (OOADM) behind LionDesk.
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                Analyze the sequence diagrams, entity structures, auto-routing algorithms, and database designs used to architect this role-aware system.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-bold px-4 py-2 rounded-lg transition duration-200">
                Read Article &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-brand-card border border-brand-border/45 p-6 rounded-2xl flex flex-col justify-between hover:border-brand-primary/50 transition duration-300 group shadow-sm">
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">
                System Guide
              </span>
              <h3 className="text-lg font-bold text-brand-text-main leading-snug group-hover:text-brand-primary transition duration-200">
                Navigating student status badges: From Open to Escalated.
              </h3>
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                A quick reference handbook for students explaining ticket status transitions, comment logic, resolution feedback, and re-opening actions.
              </p>
            </div>
            <div className="pt-6">
              <Link to="/docs" className="inline-flex items-center justify-center bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-bold px-4 py-2 rounded-lg transition duration-200">
                Read Article &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
