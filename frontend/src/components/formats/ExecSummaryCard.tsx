import React from 'react';
import { FileText, Download, CheckCircle, TrendingUp, AlertOctagon, Sparkles } from 'lucide-react';
import { getExportDownloadUrl } from '../../lib/api';

interface ExecSummaryCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const ExecSummaryCard: React.FC<ExecSummaryCardProps> = ({ jobId, data }) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner backdrop-blur-xl">
        <div>
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
            Executive Leadership Briefing
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{data.title}</h3>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href={getExportDownloadUrl(jobId, 'executive_summary', 'docx')}
            className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download .DOCX
          </a>
          <a
            href={getExportDownloadUrl(jobId, 'executive_summary', 'pdf')}
            className="px-4 py-2 rounded-full roopantar-btn-secondary text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        </div>
      </div>

      {/* BLUF Callout with Logo Gradient Glow */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-orange-950/30 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.15)] space-y-2">
        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-widest flex items-center gap-2 font-mono">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          Bottom Line Up Front (BLUF)
        </h4>
        <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
          {data.bottom_line_up_front}
        </p>
      </div>

      {/* Key Findings */}
      {data.key_findings && data.key_findings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Key Findings & Strategic Impact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.key_findings.map((item: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/30 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-400 font-mono">{item.area}</span>
                  <p className="text-xs sm:text-sm text-slate-100 mt-2 font-medium leading-relaxed">{item.observation}</p>
                </div>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-white/[0.06]">
                  <strong className="text-slate-300 font-semibold">Strategic Impact: </strong>
                  {item.business_or_mission_impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decisions Required */}
      {data.decision_and_action_requirements && data.decision_and_action_requirements.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Required Leadership Decisions</h4>
          <div className="space-y-2.5">
            {data.decision_and_action_requirements.map((dec: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
                <div>
                  <p className="font-bold text-slate-100 text-sm">{dec.decision_needed}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Owner: <strong className="text-slate-200">{dec.stakeholder}</strong></p>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs font-mono font-bold self-start sm:self-auto">
                  ⏱️ {dec.timeline}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
