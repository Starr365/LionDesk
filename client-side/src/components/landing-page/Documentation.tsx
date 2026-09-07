import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { docLinks } from '../../config/docLinks';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface DropdownItem {
  label: string;
  subtitle: string;
  href: string;
}

interface DocCard {
  id: string;
  number: string;
  title: string;
  chapters: string;
  description: string;
  buttonLabel: string;
  items: DropdownItem[];
}

const cards: DocCard[] = [
  {
    id: 'research-foundation',
    number: '01',
    title: 'Research Foundation',
    chapters: 'Chapters 1–2',
    description:
      'The background, problem definition, objectives, significance of the study and review of related literature and existing systems.',
    buttonLabel: 'Explore Research',
    items: [
      { label: 'Chapter One', subtitle: 'Introduction', href: docLinks.chapter1 },
      { label: 'Chapter Two', subtitle: 'Literature Review', href: docLinks.chapter2 },
      { label: 'Related Research', subtitle: 'Supporting papers & references', href: docLinks.relatedResearch },
    ],
  },
  {
    id: 'system-design',
    number: '02',
    title: 'System Design',
    chapters: 'Chapter 3 + Technical Documents',
    description:
      'The analysis, methodology, requirements and technical decisions that shaped the LionDesk system.',
    buttonLabel: 'Explore System Design',
    items: [
      { label: 'Chapter Three', subtitle: 'System Analysis & Methodology', href: docLinks.chapter3 },
      { label: 'Product Requirements Document', subtitle: 'System requirements & specifications', href: docLinks.prd },
      { label: 'System Architecture', subtitle: '', href: docLinks.architecture },
      { label: 'Database Design', subtitle: '', href: docLinks.database },
    ],
  },
  {
    id: 'implementation-evaluation',
    number: '03',
    title: 'Implementation & Evaluation',
    chapters: 'Chapters 4–5',
    description:
      'The implementation, testing, results, conclusions and recommendations from the completed project.',
    buttonLabel: 'Explore Project',
    items: [
      { label: 'Chapter Four', subtitle: 'System Design & Implementation', href: docLinks.chapter4 },
      { label: 'Chapter Five', subtitle: 'Summary, Conclusion & Recommendations', href: docLinks.chapter5 },
      { label: 'Testing & Evaluation', subtitle: '', href: docLinks.testing },
      { label: 'User Documentation', subtitle: '', href: docLinks.userGuide },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  DocCardDropdown                                                    */
/* ------------------------------------------------------------------ */

const DocCardDropdown: React.FC<{ card: DocCard }> = ({ card }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownId = `dropdown-${card.id}`;

  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Close on Escape */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    },
    [],
  );

  /* Desktop hover handlers — 200ms delay to open, stay open while in dropdown */
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(true), 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setIsOpen(false), 250);
  };

  /* Toggle for mobile tap / keyboard Enter / Space */
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="stagger-item bg-brand-bg border border-brand-border/60 rounded-2xl flex flex-col justify-between hover:border-brand-primary/55 transition duration-300 group shadow-xs relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {/* Card Body */}
      <div className="p-8 space-y-4">
        {/* Card Header */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-secondary tracking-wide">{card.number} —</span>
          <h3 className="text-xl font-extrabold text-brand-text-main">{card.title}</h3>
          <p className="text-xs font-bold text-brand-text-muted tracking-wide">{card.chapters}</p>
        </div>
        <div className="h-px bg-brand-border/30" />
        <p className="text-brand-text-muted text-sm leading-relaxed font-medium">{card.description}</p>
      </div>

      {/* Button + Dropdown */}
      <div className="px-8 pb-8 relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-controls={dropdownId}
          className="inline-flex items-center justify-center gap-1.5 bg-transparent border border-brand-primary hover:bg-brand-primary text-brand-primary hover:text-brand-white text-xs font-extrabold px-4.5 py-2 rounded-lg transition duration-200 w-full sm:w-auto"
        >
          <span>{card.buttonLabel}</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Panel */}
        <div
          ref={dropdownRef}
          id={dropdownId}
          role="menu"
          className={`absolute left-0 right-0 mx-4 sm:mx-8 mt-2 bg-brand-bg border border-brand-border/60 rounded-xl shadow-lg z-20 overflow-hidden transition-all duration-200 origin-top ${
            isOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
          }`}
        >
          {card.items.map((item, idx) => (
            <Link
              key={item.href}
              to={item.href}
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
              className={`block px-5 py-3.5 hover:bg-brand-primary/5 transition duration-150 focus:bg-brand-primary/5 focus:outline-none ${
                idx < card.items.length - 1 ? 'border-b border-brand-border/25' : ''
              }`}
            >
              <span className="block text-sm font-bold text-brand-text-main">{item.label}</span>
              {item.subtitle && (
                <span className="block text-xs text-brand-text-muted font-medium mt-0.5">{item.subtitle}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Documentation Section                                              */
/* ------------------------------------------------------------------ */

export const Documentation: React.FC = () => {
  return (
    <section id="documentation" className="py-20 md:py-28 relative bg-brand-card border-t border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            Project Documentation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-tight">
            Built from research. Documented from analysis. Evaluated in practice.
          </h2>
          <p className="text-brand-text-muted text-base sm:text-lg leading-relaxed font-medium max-w-2xl mx-auto">
            Explore the research and technical documentation behind LionDesk, from the foundation of the study through system design, implementation and evaluation.
          </p>
        </div>

        {/* Documentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <DocCardDropdown key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};
