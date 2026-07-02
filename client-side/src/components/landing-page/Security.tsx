import React from 'react';
import securityCluster from '../../assets/security_cluster.png';

export const Security: React.FC = () => {
  return (
    <section id="security" className="py-20 md:py-28 border-t border-brand-border/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-card border border-brand-border/40 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide text-brand-primary shadow-xs">
              <span>Security &amp; Data Integrity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-tight">
              Seamless database identity matching.
            </h2>
            <p className="text-brand-text-muted leading-relaxed text-base sm:text-lg font-medium">
              Security is locked down using JSON Web Tokens (JWT) and encrypted transport. Students don't need a lengthy registration process—they simply activate their account using their pre-verified university matriculation numbers.
            </p>
          </div>

          {/* Right Graphic Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group rounded-2xl overflow-hidden bg-brand-card border border-brand-border/40 p-1.5 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-70 group-hover:opacity-100 transition duration-300 pointer-events-none rounded-2xl" />
              <img
                src={securityCluster}
                alt="Security &amp; Data Integrity Mockup Icons"
                className="w-full max-w-lg h-auto rounded-xl relative z-10 border border-brand-border/25"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
