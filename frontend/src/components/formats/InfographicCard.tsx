import React from 'react';
import { BarChart2, Download, Layers } from 'lucide-react';
import { getExportDownloadUrl } from '../../lib/api';

interface InfographicCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const InfographicCard: React.FC<InfographicCardProps> = ({ jobId, data }) => {
  const stats = data.key_stat_callouts || [];
  const sections = data.content_sections || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/25 tracking-wider uppercase font-mono shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              Visual Architecture Blueprint
            </span>
            <span className="text-xs font-mono text-pink-400">• Layout: {data.recommended_layout || 'Vertical Flow'}</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">{data.infographic_title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{data.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href={getExportDownloadUrl(jobId, 'infographic', 'pdf')}
            className="px-5 py-2.5 rounded-full roopantar-btn-primary text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download Spec (PDF)
          </a>
        </div>
      </div>

      {/* Stats Callout Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((st: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] text-center space-y-2 shadow-inner hover:border-pink-500/40 transition-all"
            >
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 font-mono">
                {st.metric}
              </span>
              <p className="text-xs font-bold text-slate-200">{st.label}</p>
              <p className="text-[11px] font-mono text-pink-400">Icon: {st.icon_suggestion || 'Metric'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sections Blueprint */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-400" />
          Content Layout & Graphic Architecture
        </h4>

        <div className="space-y-4">
          {sections.map((sec: any, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-pink-500/30 transition-all space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <h5 className="text-sm font-bold text-white">{sec.section_title}</h5>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20 font-mono font-semibold">
                  {sec.visual_type}
                </span>
              </div>

              <div className="space-y-2 pl-3 border-l-2 border-pink-500/40">
                {sec.content_points && sec.content_points.map((pt: string, pIdx: number) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">• {pt}</p>
                ))}
              </div>

              {sec.designer_tip && (
                <div className="p-3.5 rounded-xl bg-pink-500/5 border border-pink-500/15 text-xs text-pink-200 leading-relaxed shadow-inner">
                  <span className="font-bold text-pink-300">💡 Designer Graphic Direction: </span>
                  {sec.designer_tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
