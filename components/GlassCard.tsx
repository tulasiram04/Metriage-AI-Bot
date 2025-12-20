import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`glass-panel rounded-2xl shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};