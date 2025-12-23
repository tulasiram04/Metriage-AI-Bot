import React from 'react';
import { Button } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { Activity, ShieldAlert, Stethoscope, ChevronRight } from '../components/Icons';
import { ViewState } from '../types';

interface HomeProps {
  onStart: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
      {/* Localized Glows (Subtler to blend with global background) */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-teal-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse-slow"></div>

      <div className="z-10 text-center max-w-4xl space-y-10">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-800 text-cyan-300 text-xs font-semibold uppercase tracking-wide backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AI-Powered Assessment
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Healthcare Triage <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 filter drop-shadow-lg">Reimagined</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of preliminary health assessment.
            Smart risk analysis and guidance powered by <b>AI</b>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Button onClick={onStart} className="text-lg px-8 py-4 shadow-lg shadow-cyan-500/20 border-0 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white">
            Start Health Check
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <Button onClick={() => onNavigate('about')} variant="secondary" className="text-lg px-8 py-4 bg-white/5 hover:bg-white/10 border-white/10 text-white backdrop-blur-md">
            <span className="mr-2">ⓘ</span>
            More Info
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left animate-fade-in" style={{ animationDelay: '400ms' }}>
          <GlassCard className="p-6 border-white/5 bg-slate-900/40 hover:bg-slate-900/60">
            <div className="p-3 bg-rose-500/10 rounded-lg w-fit mb-4">
              <Activity className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Instant Triage</h3>
            <p className="text-sm text-slate-400 mt-2">
              Real-time symptom analysis to categorize risk levels immediately using advanced NLP.
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-slate-900/40 hover:bg-slate-900/60">
            <div className="p-3 bg-cyan-500/10 rounded-lg w-fit mb-4">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Specialist Mapping</h3>
            <p className="text-sm text-slate-400 mt-2">
              Intelligent recommendations linking your symptoms to the right specialist doctor.
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-slate-900/40 hover:bg-slate-900/60">
            <div className="p-3 bg-amber-500/10 rounded-lg w-fit mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Safety First</h3>
            <p className="text-sm text-slate-400 mt-2">
              Built with ethical AI guidelines to prioritize patient safety, privacy, and clarity.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};