import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Download } from 'lucide-react';
import { getExportDownloadUrl } from '../../lib/api';

interface AdvisoryCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const AdvisoryCard: React.FC<AdvisoryCardProps> = ({ jobId, data }) => {
  const severity = data.severity || 'Medium';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold border border-rose-200 bg-rose-50 text-rose-700 font-mono tracking-wider shadow-2xs">
              SEVERITY: {severity.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-pink-700 font-semibold">ID: {data.advisory_id || 'ADV-2026-001'}</span>
            <span className="text-xs text-slate-500">• {data.date_issued || '2026-09-02'}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{data.title}</h3>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href={getExportDownloadUrl(jobId, 'advisory', 'docx')}
            className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download .DOCX
          </a>
          <a
            href={getExportDownloadUrl(jobId, 'advisory', 'pdf')}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Executive Overview</h4>
        <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-5 rounded-2xl border border-slate-200">
          {data.summary}
        </p>
      </div>

      {/* Threat Breakdown */}
      {data.threat_or_issue_breakdown && data.threat_or_issue_breakdown.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Technical Vectors & Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.threat_or_issue_breakdown.map((item: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 transition-all shadow-2xs">
                <h5 className="text-xs font-bold text-pink-700 mb-1.5">{item.heading}</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Mitigations Table */}
      {data.recommended_actions && data.recommended_actions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Mandatory Mitigation Directives</h4>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5">Target Team</th>
                  <th className="py-3 px-5">Action Item</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recommended_actions.map((act: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        (act.priority || '').toLowerCase() === 'immediate'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}>
                        {act.priority || 'Immediate'}
                      </span>
                    </td>
                    <td className="py-3 px-5 font-mono text-purple-700 font-semibold">{act.target_team || 'SecOps'}</td>
                    <td className="py-3 px-5 text-slate-800">{act.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* References */}
      {data.references && data.references.length > 0 && (
        <div className="text-xs text-slate-500 font-mono">
          <span className="font-bold text-slate-700">References: </span>
          {data.references.join(' • ')}
        </div>
      )}
    </div>
  );
};
