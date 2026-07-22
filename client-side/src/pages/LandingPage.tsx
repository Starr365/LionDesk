import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/landing-page/Navbar';
import { Hero } from '../components/landing-page/Hero';
import { Stats } from '../components/landing-page/Stats';
import { Features } from '../components/landing-page/Features';
import { Testimonial } from '../components/landing-page/Testimonial';
import { Security } from '../components/landing-page/Security';
import { Roles } from '../components/landing-page/Roles';
import { Insights } from '../components/landing-page/Insights';
import { CallToAction } from '../components/landing-page/CallToAction';
import { Footer } from '../components/landing-page/Footer';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.scroll-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 75, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col selection:bg-brand-primary selection:text-brand-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="scroll-section"><Stats /></div>
      <div className="scroll-section"><Features /></div>
      <div className="scroll-section"><Testimonial /></div>
      <div className="scroll-section"><Security /></div>
      <div className="scroll-section"><Roles /></div>
      <div className="scroll-section"><Insights /></div>
      <div className="scroll-section"><CallToAction /></div>
      <Footer />
    </div>
  );
};

export default LandingPage;
