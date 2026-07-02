import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition ${
        variant === 'primary'
          ? 'bg-blue-600 hover:bg-blue-500 text-white'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-750'
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
