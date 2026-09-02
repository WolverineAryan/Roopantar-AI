import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Share2, 
  Twitter, 
  Presentation, 
  Video, 
  BarChart2, 
  RotateCw, 
  Download,
  Sparkles
} from 'lucide-react';
import { Job, GeneratedOutput } from '../types';
import { AdvisoryCard } from './formats/AdvisoryCard';
import { ExecSummaryCard } from './formats/ExecSummaryCard';
import { LinkedInCard } from './formats/LinkedInCard';
import { TwitterThreadCard } from './formats/TwitterThreadCard';
import { PresentationCard } from './formats/PresentationCard';
import { VideoPackageCard } from './formats/VideoPackageCard';
import { InfographicCard } from './formats/InfographicCard';

interface OutputPreviewModalProps {
  job: Job;
  onRegenerateFormat: (formatType: string) => void;
  isRegenerating: boolean;
}

const TAB_ICONS: Record<string, any> = {
  advisory: ShieldAlert,
  executive_summary: FileText,
  linkedin: Share2,
  twitter: Twitter,
  presentation: Presentation,
  video_package: Video,
  infographic: BarChart2,
};

export const OutputPreviewModal: React.FC<OutputPreviewModalProps> = ({
  job,
  onRegenerateFormat,
  isRegenerating,
}) => {
  const availableOutputs = job.outputs || [];
  const [activeTab, setActiveTab] = useState<string>(
    availableOutputs.length > 0 ? availableOutputs[0].format_type : 'advisory'
  );

  const currentOutput = availableOutputs.find((o) => o.format_type === activeTab);

  return (
    <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg shadow-slate-200/50">
      
      {/* Top Format Switcher Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {availableOutputs.map((output) => {
            const Icon = TAB_ICONS[output.format_type] || FileText;
            const isActive = activeTab === output.format_type;

            return (
              <button
                key={output.format_type}
                onClick={() => setActiveTab(output.format_type)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'roopantar-btn-primary shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="capitalize">{output.format_type.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>

        {/* Format Specific Actions */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            type="button"
            disabled={isRegenerating}
            onClick={() => onRegenerateFormat(activeTab)}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-2xs"
          >
            <RotateCw className={`w-3.5 h-3.5 text-pink-600 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate Format
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="min-h-[380px]">
        {!currentOutput ? (
          <div className="text-center py-20 text-slate-400 text-sm font-mono">
            Format output not found or still generating...
          </div>
        ) : (
          <div>
            {activeTab === 'advisory' && (
              <AdvisoryCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('advisory')}
              />
            )}
            {activeTab === 'executive_summary' && (
              <ExecSummaryCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('executive_summary')}
              />
            )}
            {activeTab === 'linkedin' && (
              <LinkedInCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('linkedin')}
              />
            )}
            {activeTab === 'twitter' && (
              <TwitterThreadCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('twitter')}
              />
            )}
            {activeTab === 'presentation' && (
              <PresentationCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('presentation')}
              />
            )}
            {activeTab === 'video_package' && (
              <VideoPackageCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('video_package')}
              />
            )}
            {activeTab === 'infographic' && (
              <InfographicCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('infographic')}
              />
            )}
          </div>
        )}
      </div>

    </div>
  );
};
