import React from 'react';
import { ViewState } from '../types';
import {
  HomeIcon,
  Activity,
  FileText,
  Info,
  HeartPulse,
  Pill,
  User
} from './Icons';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { id: 'triage', label: 'Triage', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto max-w-7xl glass-panel rounded-2xl px-6 py-3 flex items-center justify-between border-white/10 shadow-2xl shadow-black/20">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white p-2.5 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-teal-200">
            MedTriage AI
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-white/10 text-cyan-300 shadow-sm border border-white/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section (empty for now, future actions can go here) */}
        <div />
      </div>
    </header>
  );
};
