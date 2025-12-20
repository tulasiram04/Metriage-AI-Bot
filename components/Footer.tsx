import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto w-full px-4 pb-4 text-center text-slate-400 text-sm relative z-20">
      <div className="glass-panel w-full px-6 py-4 border border-slate-700/30 rounded-2xl">
        <p className="font-medium text-slate-300">
          AI - Powered Health Triage for Early Awareness<br></br>
          © 2025 MedTriage AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
