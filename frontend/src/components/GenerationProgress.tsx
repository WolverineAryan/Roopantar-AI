import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Clock, Sparkles, AlertCircle, Cpu, Zap } from 'lucide-react';
import { Job } from '../types';

interface GenerationProgressProps {
  job: Job;
  isGenerating: boolean;
  selectedCount?: number;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ 
  job, 
  isGenerating,
  selectedCount = 7
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer effect
  useEffect(() => {
    let interval: any = null;
    if (isGenerating) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  // Estimate total time based on number of selected formats
  const estTotalSeconds = Math.max(10, Math.round(selectedCount * 2.0));
  const remainingSeconds = Math.max(0, estTotalSeconds - elapsedSeconds);
  const progressPercent = isGenerating
    ? Math.min(95, Math.round((elapsedSeconds / estTotalSeconds) * 90) + 10)
    : 100;

  const currentPhase = isGenerating
    ? elapsedSeconds < 3
      ? 'Phase 1/3: Ingesting & Extracting Source Document...'
      : elapsedSeconds < 6
      ? 'Phase 2/3: Performing Single-Pass Intent Context Analysis (ICO)...'
      : `Phase 3/3: Parallel Fan-Out Generation for ${selectedCount} Deliverables & Exporters...`
    : 'Transformation Complete: All Deliverables & File Exporters Ready';

  return (
    <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold text-pink-600 uppercase tracking-wider">
              Execution Pipeline
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {job.id.slice(0, 8)}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isGenerating ? currentPhase : 'All Deliverables Generated Successfully'}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Timer Pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            <Clock className="w-3.5 h-3.5 text-pink-600" />
            {isGenerating ? (
              <span>
                Elapsed: <strong>{elapsedSeconds}s</strong> • Est. Remaining: <strong>~{remainingSeconds}s</strong>
              </span>
            ) : (
              <span>Total Latency: <strong>{job.duration_seconds || elapsedSeconds}s</strong></span>
            )}
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              job.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : job.status === 'failed'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-pink-50 text-pink-700 border border-pink-200 animate-pulse'
            }`}
          >
            {job.status === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : job.status === 'failed' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            )}
            <span className="capitalize">{job.status}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Brand Gradient Progress Bar */}
      {isGenerating && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Executing format transformers...</span>
            <span className="font-bold text-pink-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F97316] transition-all duration-300 rounded-full shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Shared Intent Context Object (ICO) Callout */}
      {job.intent_context && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border border-pink-200/80 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <h4 className="text-xs font-bold text-pink-700 uppercase tracking-wider font-mono">
                Extracted Intent Context Object (ICO)
              </h4>
            </div>
            <span className="text-[11px] px-3 py-0.5 rounded-full bg-white text-pink-700 border border-pink-200 font-mono font-bold shadow-2xs">
              Shared Across {job.selected_formats.length} Formats
            </span>
          </div>

          <div className="space-y-1">
            <h5 className="text-lg font-bold text-slate-900">{job.intent_context.topic}</h5>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
              {job.intent_context.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {job.intent_context.risk_flags && job.intent_context.risk_flags.map((risk: string, i: number) => (
              <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-mono font-medium">
                ⚠️ {risk}
              </span>
            ))}
            {job.intent_context.key_entities && job.intent_context.key_entities.slice(0, 3).map((ent: string, i: number) => (
              <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-slate-700 font-mono border border-slate-200 shadow-2xs font-medium">
                🏛️ {ent}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fan-Out Deliverables Status Grid */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Parallel Deliverable Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {job.selected_formats.map((fmtId) => {
            const out = job.outputs.find((o) => o.format_type === fmtId);
            const isDone = out?.status === 'completed';

            return (
              <div
                key={fmtId}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isDone
                    ? 'bg-slate-50/80 border-slate-200 text-slate-800 font-medium'
                    : 'bg-white border-slate-200 text-slate-400 animate-pulse'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-pink-600 shadow-xs' : 'bg-purple-500 animate-ping'}`} />
                  <span className="font-semibold capitalize">{fmtId.replace('_', ' ')}</span>
                </div>
                {isDone && (
                  <span className="text-[10px] font-mono text-pink-600 font-bold">
                    {out?.generation_time}s
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
