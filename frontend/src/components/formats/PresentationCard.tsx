import React, { useState } from 'react';
import { Presentation, Download, ChevronLeft, ChevronRight, MessageSquareQuote, Sparkles } from 'lucide-react';
import { getExportDownloadUrl } from '../../lib/api';

interface PresentationCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const PresentationCard: React.FC<PresentationCardProps> = ({ jobId, data }) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const slides = data.slides || [];
  const currentSlide = slides[currentSlideIdx] || {};

  const prevSlide = () => {
    setCurrentSlideIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 tracking-wider uppercase font-mono shadow-2xs">
              PowerPoint Presentation ({slides.length} Slides)
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{data.deck_title}</h3>
          <p className="text-xs text-slate-500">{data.subtitle}</p>
        </div>

        <a
          href={getExportDownloadUrl(jobId, 'presentation', 'pptx')}
          className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          Download .PPTX Deck
        </a>
      </div>

      {/* Slide Interactive Preview Stage (16:9 aspect) */}
      <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden text-white">
        
        {/* Top bar inside slide */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest font-mono">
            {currentSlide.slide_type || 'Content Slide'}
          </span>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            Slide {currentSlideIdx + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Title & Bullets */}
        <div className="my-auto space-y-5 relative z-10">
          <h4 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h4>

          <div className="space-y-3">
            {currentSlide.bullet_points && currentSlide.bullet_points.map((bp: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 mt-2 shrink-0 shadow-sm"></span>
                <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">{bp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono relative z-10">
          <span>Roopantar-AI • Executive Presentation</span>
          <span>{data.target_audience || 'Strategic Briefing'}</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          className="p-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-all hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_: any, idx: number) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIdx(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlideIdx === idx ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 w-8 shadow-xs' : 'bg-slate-200 hover:bg-slate-300 w-2.5'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="p-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-2xs transition-all hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Speaker Notes Box */}
      {currentSlide.speaker_notes && (
        <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-2 text-purple-700 font-bold">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Presenter Speaker Script & Keynote Guidance:</span>
          </div>
          <p className="text-slate-700 leading-relaxed italic text-xs sm:text-sm pl-4 border-l-2 border-purple-500">
            "{currentSlide.speaker_notes}"
          </p>
        </div>
      )}
    </div>
  );
};
