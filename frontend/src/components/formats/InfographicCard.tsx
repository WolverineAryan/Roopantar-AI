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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200 tracking-wider uppercase font-mono shadow-2xs">
              Visual Architecture Blueprint
            </span>
            <span className="text-xs font-mono text-pink-700 font-semibold">• Layout: {data.recommended_layout || 'Vertical Flow'}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{data.infographic_title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{data.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href={getExportDownloadUrl(jobId, 'infographic', 'pdf')}
            className="px-5 py-2.5 rounded-full roopantar-btn-primary text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all"
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
              className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-2xs hover:border-pink-300 transition-all"
            >
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600 font-mono">
                {st.metric}
              </span>
              <p className="text-xs font-bold text-slate-900">{st.label}</p>
              <p className="text-[11px] font-mono text-pink-700 font-medium">Icon: {st.icon_suggestion || 'Metric'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sections Blueprint */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-600" />
          Content Layout & Graphic Architecture
        </h4>

        <div className="space-y-4">
          {sections.map((sec: any, idx: number) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 transition-all space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h5 className="text-sm font-bold text-slate-900">{sec.section_title}</h5>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 font-mono font-bold">
                  {sec.visual_type}
                </span>
              </div>

              <div className="space-y-2 pl-3 border-l-2 border-pink-500">
                {sec.content_points && sec.content_points.map((pt: string, pIdx: number) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">• {pt}</p>
                ))}
              </div>

              {sec.designer_tip && (
                <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-100 text-xs text-pink-900 leading-relaxed">
                  <span className="font-bold text-pink-800">💡 Designer Graphic Direction: </span>
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
