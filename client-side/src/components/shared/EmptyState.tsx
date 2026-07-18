import React from 'react';
import { FiFolder, FiInbox, FiAlertCircle } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'folder' | 'inbox' | 'alert';
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  actionButton,
}) => {
  const renderIcon = () => {
    const iconClass = "h-12 w-12 text-brand-primary/60 stroke-[1.5]";
    switch (icon) {
      case 'folder':
        return <FiFolder className={iconClass} />;
      case 'alert':
        return <FiAlertCircle className={iconClass} />;
      case 'inbox':
      default:
        return <FiInbox className={iconClass} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-brand-card border border-brand-border/40 rounded-3xl shadow-sm max-w-lg mx-auto my-6 space-y-4">
      <div className="p-4 bg-brand-bg rounded-2xl border border-brand-border/25">
        {renderIcon()}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-brand-text-main">
          {title}
        </h3>
        <p className="text-xs text-brand-text-muted font-medium leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="bg-brand-primary hover:bg-brand-primary-hover text-brand-white text-xs font-extrabold px-5 py-3 rounded-xl transition duration-200 shadow-sm"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};
