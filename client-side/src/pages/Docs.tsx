import React from 'react';
import { Link } from 'react-router-dom';

const Docs: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-main flex flex-col justify-between p-6">
      <header className="border-b border-brand-border/40 py-4 max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="text-xl font-bold bg-linear-to-r from-brand-secondary to-brand-primary bg-clip-text text-transparent">
          LionDesk Docs
        </Link>
        <Link to="/" className="text-sm bg-brand-primary hover:bg-brand-primary-hover text-brand-white px-4 py-2 rounded-lg font-bold transition">
          Back to Home
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full grow py-12 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Research &amp; Technical Documentation</h1>
        <p className="text-brand-text-muted text-lg font-medium">
          Welcome to the LionDesk documentation portal. This houses research chapters, developer guides, and system blueprints.
        </p>
        <div className="border border-brand-border/40 bg-brand-card p-6 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-2xl font-extrabold">Research Chapters Outline</h2>
          <ul className="list-disc list-inside space-y-2 text-brand-text-muted font-medium">
            <li><strong>Chapter 1:</strong> Introduction and Statement of the Problem</li>
            <li><strong>Chapter 2:</strong> Literature Review on Support Infrastructures</li>
            <li><strong>Chapter 3:</strong> System Analysis &amp; Design (OOADM Methodology)</li>
            <li><strong>Chapter 4:</strong> System Implementation, Testing &amp; Deployment</li>
            <li><strong>Chapter 5:</strong> Conclusion, Recommendations, and Future Work</li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-brand-border/40 py-6 text-center text-sm text-brand-text-muted max-w-7xl mx-auto w-full font-semibold">
        &copy; 2026 Department of Computer Science, UNN.
      </footer>
    </div>
  );
};

export default Docs;
