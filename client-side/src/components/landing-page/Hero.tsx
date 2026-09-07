import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
        .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
        .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero-mockup',
          { opacity: 0, scale: 0.94, y: 60 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power4.out' },
          '-=0.5'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-15 pb-20 md:pt-20 md:pb-28">
      {/* Background gradients (soft overlay for light theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-100 h-100 bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-24 right-1/4 w-87.5 h-87.5 bg-brand-light/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8 md:space-y-12">
        {/* Badge Indicator */}
        <div className="hero-badge inline-flex items-center space-x-2 bg-brand-card border border-brand-border/40 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide text-brand-text-muted">
          <span className="flex h-2 w-2 rounded-full bg-brand-secondary animate-pulse" />
          <span>DEPARTMENT OF COMPUTER SCIENCE, UNN</span>
        </div>

        {/* Copy */}
        <div className="max-w-4xl space-y-4 md:space-y-6">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-brand-text-main">
            A smarter way to manage <br className="hidden sm:inline" />
            departmental support.
          </h1>
          <p className="hero-desc text-base sm:text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed font-medium">
            LionDesk is the official online help-desk for the Department of Computer Science, UNN. Students can easily submit academic enquiries, track complaints, and get fast answers from departmental staff and lecturers.
          </p>
        </div>

        {/* Actions - No trailing arrows */}
        <div className="hero-actions flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-2">
          <Link
            to="/login"
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-center font-bold px-8 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-brand-primary"
          >
            Access LionDesk
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => handleScrollTo(e, '#how-it-works')}
            className="w-full sm:w-auto text-center font-bold text-brand-text-main hover:text-brand-primary bg-brand-card hover:bg-brand-card-hover px-8 py-3.5 rounded-xl border-2 border-brand-primary/30 hover:border-brand-primary shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Explore the system
          </a>
        </div>

        {/* Realistic Photography Presentation */}
        <div className="hero-mockup w-full max-w-5xl pt-8 md:pt-12">
          <div className="relative group rounded-2xl overflow-hidden bg-brand-card border border-brand-border/40 p-2 sm:p-3 shadow-xl">
            <div className="relative rounded-xl overflow-hidden aspect-video sm:aspect-21/9 max-h-120">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80"
                alt="University students and faculty collaborating on academic computing and support"
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition duration-500"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-brand-bg/90 via-brand-bg/20 to-transparent" />
              
              {/* Floating feature summary chips on image */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 text-left">
                <div className="bg-brand-bg/90 backdrop-blur-md border border-brand-border/50 px-4 py-2 rounded-xl shadow-md">
                  <p className="text-[11px] font-bold text-brand-secondary uppercase tracking-wider">Help-Desk Workspace</p>
                  <p className="text-xs sm:text-sm font-extrabold text-brand-text-main">Direct connection between students & departmental lecturers</p>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-brand-card/95 backdrop-blur-md border border-brand-border/50 px-3.5 py-2 rounded-xl shadow-md">
                  <span className="flex h-2 w-2 rounded-full bg-brand-secondary" />
                  <span className="text-xs font-bold text-brand-text-main">University of Nigeria, Nsukka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
