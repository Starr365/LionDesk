import React from 'react';

export const Testimonial: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-bg border-y border-brand-border/40 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-brand-card border border-brand-border/40 p-8 sm:p-12 md:p-16 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center shadow-md">
          {/* Quote Section */}
          <div className="lg:col-span-8 space-y-6">
            <svg className="h-10 w-10 text-brand-secondary/35 fill-current" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.6 9.367-10.09l.616 1.085c-3.562.889-4.633 3.495-4.633 5.408h5.592V21h-10.942zm-14 0v-7.391c0-5.704 3.748-9.6 9.384-10.09l.617 1.085c-3.562.889-4.633 3.495-4.633 5.408h5.592V21h-10.96z" />
            </svg>
            <p className="text-xl sm:text-2xl md:text-3xl text-brand-text-main font-bold leading-relaxed">
              "This system has completely transformed how we address student challenges. We can now review historical logs, prevent duplicate inquiries, and maintain an absolute, transparent record of our resolutions."
            </p>
          </div>

          {/* Author Profile */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-brand-border/30 pt-8 lg:pt-0 lg:pl-12 flex items-center lg:items-start space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4">
            <div className="h-14 w-14 rounded-full bg-brand-primary border border-brand-secondary/40 flex items-center justify-center text-brand-white font-extrabold text-xl shadow-xs">
              CS
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-brand-text-main leading-tight">
                Departmental Board Representative
              </h4>
              <p className="text-sm text-brand-secondary font-bold mt-1">
                Computer Science Administration, UNN
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
