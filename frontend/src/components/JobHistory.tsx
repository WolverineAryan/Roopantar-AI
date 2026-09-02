import React, { useEffect, useState } from 'react';
import { Layers, Clock, FileText, ArrowRight, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';
import { JobSummary } from '../types';
import { getJobsList } from '../lib/api';

interface JobHistoryProps {
  onSelectJob: (jobId: string) => void;
}

export const JobHistory: React.FC<JobHistoryProps> = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getJobsList();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load job history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="roopantar-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full roopantar-badge text-xs font-bold text-pink-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            OPERATIONAL AUDIT TRAIL
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Transformation Job History
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Revisit, re-download, or inspect previous multi-format deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchHistory}
          className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs transition-all shadow-sm"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 text-pink-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs font-mono">
          Loading transformation history...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-xs font-mono">
          No transformation jobs executed yet. Launch a job in the Studio Workspace.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.id}
              onClick={() => onSelectJob(j.id)}
              className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] cursor-pointer transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-pink-400">
                    ID: {j.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    {new Date(j.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    {j.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                  {j.topic || j.source_filename || 'Content Transformation Job'}
                </h4>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {j.selected_formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-300 font-mono capitalize border border-white/[0.05]"
                    >
                      {fmt.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {j.duration_seconds && (
                  <span className="text-xs font-mono text-slate-400 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/[0.06]">
                    ⏱️ {j.duration_seconds}s
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-white/[0.04] group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-500 group-hover:to-orange-500 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
