import React from 'react';
import { Video, Download, Film, Mic, Eye, Music } from 'lucide-react';
import { getExportDownloadUrl } from '../../lib/api';

interface VideoPackageCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const VideoPackageCard: React.FC<VideoPackageCardProps> = ({ jobId, data }) => {
  const scenes = data.scenes || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 tracking-wider uppercase font-mono shadow-2xs">
              {data.target_format || '16:9 Landscape'} • {data.target_duration || '90s'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{data.video_title}</h3>
          <p className="text-xs text-slate-500 italic mt-0.5">{data.logline}</p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <a
            href={getExportDownloadUrl(jobId, 'video_package', 'docx')}
            className="px-5 py-2.5 rounded-full roopantar-btn-primary text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download Script (.DOCX)
          </a>
        </div>
      </div>

      {/* Storyboard & Scenes Breakdown */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
          <Film className="w-4 h-4 text-purple-600" />
          Scene-by-Scene Storyboard & Narration Package
        </h4>

        <div className="space-y-4">
          {scenes.map((scene: any, idx: number) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all space-y-4 shadow-2xs"
            >
              {/* Scene Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold text-slate-900">
                  Scene {scene.scene_number || idx + 1}: {scene.scene_name}
                </span>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                  ⏱️ {scene.timestamp_marker}
                </span>
              </div>

              {/* Scene Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Visual Directions */}
                <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1.5">
                  <span className="font-bold text-purple-800 flex items-center gap-1.5 text-xs font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    Visual & B-Roll Direction:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{scene.visual_description}</p>
                </div>

                {/* Spoken Voiceover */}
                <div className="p-4 rounded-xl bg-orange-50/40 border border-orange-100 space-y-1.5">
                  <span className="font-bold text-orange-800 flex items-center gap-1.5 text-xs font-mono">
                    <Mic className="w-3.5 h-3.5" />
                    Voiceover Narration Script:
                  </span>
                  <p className="text-slate-700 italic leading-relaxed">"{scene.narration_voiceover}"</p>
                </div>
              </div>

              {/* Subtitles & Audio Mood */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs text-slate-500 border-t border-slate-100">
                <span>
                  <strong className="text-slate-800">On-Screen Text: </strong>
                  {scene.on_screen_text}
                </span>
                {scene.audio_mood && (
                  <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <Music className="w-3.5 h-3.5 text-amber-600" />
                    {scene.audio_mood}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
