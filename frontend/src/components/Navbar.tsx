import React from 'react';
import { Layers, Zap, Cpu, Sparkles } from 'lucide-react';
import { HealthStatus } from '../types';

interface NavbarProps {
  health: HealthStatus | null;
  onNewJobClick: () => void;
  activeTab: 'generator' | 'history';
  setActiveTab: (tab: 'generator' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onNewJobClick, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onNewJobClick}>
          <div className="relative flex items-center justify-center h-11 w-12 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Roopantar-AI Logo"
              className="h-10 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Roopantar<span className="brand-gradient-text">.AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Single-Source GenAI Content Transformation Engine
            </p>
          </div>
        </div>

        {/* Minimalist Pill Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-2xs">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'roopantar-btn-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Studio Workspace
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'roopantar-btn-primary shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Audit History
          </button>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
            <Cpu className="w-3.5 h-3.5 text-purple-600" />
            <span>
              {health?.api_keys_present?.groq ? (
                <strong className="text-slate-800">Groq Inference (Active)</strong>
              ) : health?.api_keys_present?.openai ? (
                <strong className="text-slate-800">OpenAI (Active)</strong>
              ) : (
                <span className="text-slate-700">Production Mode</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>

      </div>
    </header>
  );
};
