import React from 'react';
import { Link } from 'react-router-dom';
import heroMockup from '../../assets/hero_dashboard.png';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28">
      {/* Background gradients (soft overlay for light theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-24 right-1/4 w-[350px] h-[350px] bg-brand-light/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8 md:space-y-12">
        {/* Badge Indicator */}
        <div className="inline-flex items-center space-x-2 bg-brand-card border border-brand-border/40 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide text-brand-text-muted">
          <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-pulse" />
          <span>V1.1 Lean Release</span>
        </div>

        {/* Copy */}
        <div className="max-w-4xl space-y-4 md:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-brand-text-main">
            Modernized support infrastructure <br className="hidden sm:inline" />
            for <span className="bg-linear-to-r from-brand-secondary via-green-600 to-emerald-600 bg-clip-text text-transparent">the Den.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed font-medium">
            Streamline student complaints, automate ticket routing, and accelerate academic resolutions—all inside a single, role-aware portal built for the Department of Computer Science, UNN.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          <Link
            to="/activate"
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-center font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-brand-primary"
          >
            Activate Account
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto text-center font-bold text-brand-text-muted hover:text-brand-primary px-8 py-3.5 hover:bg-brand-silver/20 rounded-xl border border-transparent hover:border-brand-border transition duration-200 flex items-center justify-center gap-1.5"
          >
            <span>Log In</span>
            <span className="text-brand-secondary font-bold text-lg">&rarr;</span>
          </Link>
        </div>

        {/* Mockup Image */}
        <div className="w-full max-w-5xl pt-8 md:pt-12">
          <div className="relative group rounded-2xl overflow-hidden bg-brand-card border border-brand-border/40 p-1.5 sm:p-2.5 shadow-xl">
            {/* Outer border glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-brand-secondary/5 opacity-80 group-hover:opacity-100 transition duration-300 pointer-events-none rounded-2xl" />
            <img
              src={heroMockup}
              alt="LionDesk Dual-Pane Support Mockup Dashboard"
              className="w-full h-auto rounded-xl object-cover relative z-10 border border-brand-border/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
