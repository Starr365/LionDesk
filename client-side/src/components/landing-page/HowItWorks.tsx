import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Submit Enquiry',
    description: 'Student picks a category (such as Course Registration or Grade Query) and submits the details.',
  },
  {
    number: '02',
    title: 'Direct Assignment',
    description: 'The system automatically routes the ticket to the assigned course lecturer or departmental staff.',
  },
  {
    number: '03',
    title: 'Review & Respond',
    description: 'The lecturer reviews the request, posts updates or solutions, and changes the ticket status.',
  },
  {
    number: '04',
    title: 'Resolution & Follow-up',
    description: 'The student confirms the solution. If unattended, the system alerts administrators.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-brand-card border-t border-b border-brand-border/40 relative">
      <div className="max-w-7xl mx-auto px-6 space-y-12 md:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-secondary">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text-main leading-none">
            How LionDesk Works
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="stagger-item bg-brand-bg border border-brand-border/60 p-8 rounded-2xl space-y-4 hover:border-brand-primary/55 transition duration-300 group shadow-xs"
            >
              {/* Step Number */}
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-brand-primary/10 text-brand-primary text-sm font-extrabold group-hover:scale-110 transition duration-200">
                  {step.number}
                </span>
                <span className="text-lg font-extrabold text-brand-text-main">{step.title}</span>
              </div>
              {/* Divider */}
              <div className="h-px bg-brand-border/30" />
              {/* Description */}
              <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
