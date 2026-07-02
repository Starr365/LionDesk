import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description }) => {
  return (
    <div className="bg-brand-card border border-brand-border/40 p-6 rounded-2xl space-y-3 shadow-xs relative overflow-hidden group hover:border-brand-primary/45 transition">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider">{title}</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-text-main tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="h-10 w-10 bg-brand-primary/5 border border-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-105 transition">
            {icon}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-brand-text-muted font-semibold">{description}</p>
      )}
    </div>
  );
};
export default StatCard;
