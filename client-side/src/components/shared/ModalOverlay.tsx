import React from 'react';

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
  /** Max width class — defaults to 'max-w-2xl' */
  maxWidth?: string;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  children,
  onClose,
  maxWidth = 'max-w-2xl',
}) => {
  return (
    <div
      className="fixed inset-0 bg-brand-primary/15 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={(e) => {
        // Close when clicking the backdrop, not the dialog itself
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-brand-card border border-brand-border/40 w-full ${maxWidth} rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalOverlay;
