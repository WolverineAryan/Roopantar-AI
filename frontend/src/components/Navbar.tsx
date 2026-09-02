import React from 'react';
import Image from 'next/image';
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
    <header className="sticky top-0 z-50 w-full bg-[#0A0D14]/90 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Real User Logo Image */}
        <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onNewJobClick}>
          <div className="relative flex items-center justify-center h-11 w-14 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Roopantar-AI Logo"
              className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Roopantar<span className="brand-gradient-text">.AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Single-Source GenAI Content Transformation Engine
            </p>
          </div>
        </div>

        {/* Minimalist Pill Navigation */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'generator'
                ? 'roopantar-btn-primary shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            Studio Workspace
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'roopantar-btn-primary shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Audit History
          </button>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-pink-400" />
            <span>
              {health?.api_keys_present?.groq ? (
                <strong className="text-white">Groq Inference (Active)</strong>
              ) : health?.api_keys_present?.openai ? (
                <strong className="text-white">OpenAI (Active)</strong>
              ) : (
                <span className="text-amber-400">Production Mode</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>

      </div>
    </header>
  );
};
