import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Share2, 
  Twitter, 
  Presentation, 
  Video, 
  BarChart2, 
  Image as ImageIcon,
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
import { ImageAssetsCard } from './formats/ImageAssetsCard';

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
  image_assets: ImageIcon,
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

        {/* Regenerate format action */}
        <button
          type="button"
          onClick={() => onRegenerateFormat(activeTab)}
          disabled={isRegenerating}
          className="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all self-start md:self-auto shrink-0"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Format'}</span>
        </button>
      </div>

      {/* Main Active Deliverable Viewer Stage */}
      <div className="min-h-[400px]">
        {currentOutput && (
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
            {activeTab === 'image_assets' && (
              <ImageAssetsCard
                jobId={job.id}
                data={currentOutput.content_json}
                onRegenerate={() => onRegenerateFormat('image_assets')}
              />
            )}
          </div>
        )}
      </div>

    </div>
  );
};
