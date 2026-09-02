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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-inner backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-300 border border-pink-500/25 tracking-wider uppercase font-mono shadow-[0_0_15px_rgba(236,72,153,0.2)]">
              PowerPoint Presentation ({slides.length} Slides)
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">{data.deck_title}</h3>
          <p className="text-xs text-slate-400">{data.subtitle}</p>
        </div>

        <a
          href={getExportDownloadUrl(jobId, 'presentation', 'pptx')}
          className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          Download .PPTX Deck
        </a>
      </div>

      {/* Slide Interactive Preview Stage (16:9 aspect) */}
      <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#121624] via-[#0B0F19] to-[#181C2E] border border-white/[0.12] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle slide top ambient light */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar inside slide */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 relative z-10">
          <span className="text-xs font-bold text-pink-400 uppercase tracking-widest font-mono">
            {currentSlide.slide_type || 'Content Slide'}
          </span>
          <span className="text-xs font-mono text-slate-300 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
            Slide {currentSlideIdx + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Title & Bullets */}
        <div className="my-auto space-y-5 relative z-10">
          <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h4>

          <div className="space-y-3">
            {currentSlide.bullet_points && currentSlide.bullet_points.map((bp: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></span>
                <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">{bp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-slate-500 font-mono relative z-10">
          <span>Roopantar-AI • Executive Presentation</span>
          <span>{data.target_audience || 'Strategic Briefing'}</span>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prevSlide}
          className="p-3 rounded-full roopantar-btn-secondary text-slate-200 transition-all hover:scale-105"
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
                currentSlideIdx === idx ? 'bg-gradient-to-r from-pink-500 to-orange-400 w-8 shadow-[0_0_10px_rgba(236,72,153,0.6)]' : 'bg-white/20 hover:bg-white/40 w-2.5'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="p-3 rounded-full roopantar-btn-secondary text-slate-200 transition-all hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Speaker Notes Box */}
      {currentSlide.speaker_notes && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5 shadow-inner">
          <div className="flex items-center gap-2 text-pink-400 font-bold">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Presenter Speaker Script & Keynote Guidance:</span>
          </div>
          <p className="text-slate-300 leading-relaxed italic text-xs sm:text-sm pl-4 border-l-2 border-pink-500">
            "{currentSlide.speaker_notes}"
          </p>
        </div>
      )}
    </div>
  );
};
