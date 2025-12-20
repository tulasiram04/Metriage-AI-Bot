import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all duration-300 rounded-xl group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/20 ring-cyan-500 border border-white/10",
    secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 ring-slate-600 hover:text-white",
    danger: "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20 ring-rose-500",
    ghost: "bg-transparent text-slate-400 hover:bg-white/10 hover:text-white ring-slate-500",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="w-5 h-5 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="w-5 h-5">{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
};