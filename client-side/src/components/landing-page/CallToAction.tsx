import React from 'react';
import { Link } from 'react-router-dom';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Glow backdrop wrapper */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-brand-primary to-brand-spruce-2 border border-brand-primary p-8 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-8 shadow-xl">
          {/* Decorative backdrop light */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-light/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-white leading-tight">
            Ready for a more accountable <br className="hidden sm:inline" />
            departmental workspace?
          </h2>
          
          <p className="text-brand-alice max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            Activate your matriculation profile today and experience seamless support management.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/activate"
              className="w-full sm:w-auto bg-brand-white hover:bg-brand-alice text-brand-primary font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Activate Profile Now
            </Link>
            <Link
              to="/docs"
              className="w-full sm:w-auto text-center bg-transparent hover:bg-brand-white/10 text-brand-white font-bold px-8 py-3.5 rounded-xl border border-brand-white/30 transition"
            >
              Technical Docs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
