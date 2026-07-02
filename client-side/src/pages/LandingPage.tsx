import React from 'react';
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

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col selection:bg-brand-primary selection:text-brand-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonial />
      <Security />
      <Roles />
      <Insights />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
