import React from 'react';
import { Sliders, Volume2, Users, Globe2, ListCollapse, Target } from 'lucide-react';
import { GenerationParams } from '../types';

interface ParameterControlsProps {
  parameters: GenerationParams;
  setParameters: React.Dispatch<React.SetStateAction<GenerationParams>>;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  setParameters,
}) => {
  const handleChange = (field: keyof GenerationParams, value: string) => {
    setParameters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="roopantar-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden group">
      
      <div className="border-b border-white/[0.08] pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full roopantar-badge text-xs font-bold text-pink-300 mb-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[11px]">03</span>
          ORGANIZATIONAL ALIGNMENT
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Tone & Parameter Controls
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          These parameters govern all generated formats to enforce cohesive branding and messaging.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Tone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            Tone of Voice
          </label>
          <select
            value={parameters.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#080B12] border border-white/[0.1] text-xs text-slate-200 focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 focus:outline-none shadow-inner"
          >
            <option value="Formal">Formal & Authoritative</option>
            <option value="Urgent">Urgent / Critical Action</option>
            <option value="Technical">Technical & Precise</option>
            <option value="Executive">Executive & Strategic</option>
            <option value="Casual">Casual & Conversational</option>
            <option value="Persuasive">Persuasive & Visionary</option>
          </select>
        </div>

        {/* Target Audience */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-pink-400" />
            Target Audience
          </label>
          <select
            value={parameters.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#080B12] border border-white/[0.1] text-xs text-slate-200 focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 focus:outline-none shadow-inner"
          >
            <option value="Leadership & Stakeholders">Leadership & Stakeholders</option>
            <option value="Technical & Security Teams">Technical & Security Teams</option>
            <option value="General Public">General Public & Citizens</option>
            <option value="Media & Press">Media & Press</option>
            <option value="Inter-Agency Partners">Inter-Agency Partners</option>
          </select>
        </div>

        {/* Target Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-orange-400" />
            Target Language
          </label>
          <select
            value={parameters.language}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#080B12] border border-white/[0.1] text-xs text-slate-200 focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 focus:outline-none shadow-inner"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Spanish">Spanish (Español)</option>
            <option value="French">French (Français)</option>
            <option value="German">German (Deutsch)</option>
          </select>
        </div>

        {/* Detail Depth */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ListCollapse className="w-3.5 h-3.5 text-purple-400" />
            Detail Depth
          </label>
          <select
            value={parameters.detail_level}
            onChange={(e) => handleChange('detail_level', e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#080B12] border border-white/[0.1] text-xs text-slate-200 focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 focus:outline-none shadow-inner"
          >
            <option value="Brief">Brief (Executive BLUF)</option>
            <option value="Standard">Standard (Balanced)</option>
            <option value="Comprehensive">Comprehensive (In-Depth)</option>
          </select>
        </div>

        {/* Communication Objective */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-pink-400" />
            Primary Communication Objective
          </label>
          <input
            type="text"
            value={parameters.objective}
            onChange={(e) => handleChange('objective', e.target.value)}
            placeholder="e.g. Mandate immediate firmware compliance and brief executive leadership"
            className="w-full px-4 py-3 rounded-2xl bg-[#080B12] border border-white/[0.1] text-xs text-slate-200 focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 focus:outline-none shadow-inner font-sans"
          />
        </div>

      </div>
    </div>
  );
};
