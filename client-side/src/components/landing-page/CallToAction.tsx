import React from 'react';
import { Link } from 'react-router-dom';

export const CallToAction: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Glow backdrop wrapper */}
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-brand-primary to-brand-spruce-2 border border-brand-primary p-8 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-8 shadow-xl">
          {/* Decorative backdrop light */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-light/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-white leading-tight">
            Ready to Get Started?
          </h2>
          
          <p className="text-brand-light max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-medium">
            Join students and staff in the Department of Computer Science, UNN. Submit enquiries, track academic support, and resolve issues in one place.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-brand-white hover:bg-brand-light text-brand-primary font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Access LionDesk
            </Link>
            <a
              href="#documentation"
              onClick={(e) => handleScrollTo(e, '#documentation')}
              className="w-full sm:w-auto text-center bg-transparent hover:bg-brand-white/10 text-brand-white font-bold px-8 py-3.5 rounded-xl border border-brand-white/30 transition"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
