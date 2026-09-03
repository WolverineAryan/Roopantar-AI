import React, { useState } from 'react';
import { Image as ImageIcon, Download, Sparkles, Maximize2, ExternalLink, RefreshCw, Copy, Check, Sliders, Palette, X } from 'lucide-react';
import { getExportDownloadUrl, regenerateFormat } from '../../lib/api';

interface ImageAsset {
  asset_type: string;
  label: string;
  aspect_ratio: string;
  dimensions: string;
  image_prompt: string;
  negative_prompt?: string;
  image_url: string;
}

interface ImageAssetsCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const ImageAssetsCard: React.FC<ImageAssetsCardProps> = ({ jobId, data, onRegenerate }) => {
  const assets: ImageAsset[] = data.assets || [];
  const [selectedAsset, setSelectedAsset] = useState<ImageAsset | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [editingAsset, setEditingAsset] = useState<ImageAsset | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isReRendering, setIsReRendering] = useState<boolean>(false);

  const copyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleOpenEdit = (asset: ImageAsset) => {
    setEditingAsset(asset);
    setCustomPrompt(asset.image_prompt);
  };

  const handleReRenderPrompt = () => {
    if (!editingAsset || !customPrompt.trim()) return;
    setIsReRendering(true);
    
    // Update local asset URL with new encoded prompt and random seed
    const encoded = encodeURIComponent(customPrompt.trim().replace(/\n/g, ' '));
    let w = 1280;
    let h = 720;
    if (editingAsset.aspect_ratio === '1.91:1') {
      w = 1200;
      h = 630;
    } else if (editingAsset.aspect_ratio === '1:1') {
      w = 1024;
      h = 1024;
    }
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const newUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux`;

    setTimeout(() => {
      editingAsset.image_prompt = customPrompt.trim();
      editingAsset.image_url = newUrl;
      setIsReRendering(false);
      setEditingAsset(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50/80 via-purple-50/50 to-orange-50/50 border border-pink-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200 tracking-wider uppercase font-mono shadow-2xs">
              AI Visual Media Suite (3 Rendered Assets)
            </span>
            <span className="text-xs text-slate-500">• Powered by Flux.1 Studio</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{data.title || 'Visual Media Assets'}</h3>
          <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
            <Palette className="w-3.5 h-3.5 text-pink-600" />
            <span>Theme: <strong>{data.visual_theme || 'High-Tech Enterprise Editorial'}</strong></span>
          </p>
        </div>

        <a
          href={getExportDownloadUrl(jobId, 'image_assets', 'zip')}
          className="px-6 py-3 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          Download Visual Media Bundle (.ZIP)
        </a>
      </div>

      {/* Color Palette Indicator */}
      {data.color_palette && Array.isArray(data.color_palette) && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            Brand Palette:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {data.color_palette.map((color: string, idx: number) => (
              <span key={idx} className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono font-medium text-slate-700 shadow-2xs">
                {color}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visual Asset Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {assets.map((asset, idx) => (
          <div
            key={idx}
            className="group rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Image Preview Container */}
            <div className="relative w-full aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
              <img
                src={asset.image_url}
                alt={asset.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Aspect Ratio Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[10px] font-mono font-bold">
                {asset.aspect_ratio} ({asset.dimensions})
              </div>

              {/* Lightbox / Expand Action */}
              <button
                type="button"
                onClick={() => setSelectedAsset(asset)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="View Full Resolution"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{asset.label}</h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{asset.asset_type}</span>
                </div>
                
                <p className="text-xs text-slate-600 line-clamp-3 italic leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{asset.image_prompt}"
                </p>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyPrompt(asset.image_prompt, idx)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors flex items-center gap-1"
                    title="Copy AI Prompt"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px] font-medium">{copiedIdx === idx ? 'Copied' : 'Prompt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(asset)}
                    className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs transition-colors flex items-center gap-1"
                    title="Edit Prompt & Re-render"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">Tweak</span>
                  </button>
                </div>

                <a
                  href={asset.image_url}
                  target="_blank"
                  rel="noreferrer"
                  download={`${asset.asset_type}.png`}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                >
                  <Download className="w-3 h-3" />
                  Save HD
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* High-Resolution Lightbox Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold font-mono">
                  {selectedAsset.aspect_ratio} • {selectedAsset.dimensions}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{selectedAsset.label}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="flex-1 bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[350px]">
              <img
                src={selectedAsset.image_url}
                alt={selectedAsset.label}
                className="max-h-[60vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>

            {/* Modal Prompt & Download Footer */}
            <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Synthesized Generation Prompt:</span>
                <p className="text-xs text-slate-700 italic leading-relaxed">"{selectedAsset.image_prompt}"</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={selectedAsset.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Full-Res PNG
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Tweaker Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                Tweak AI Image Prompt
              </h4>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Customize the visual directions, subject matter, or color scheme for <strong>{editingAsset.label}</strong>.
            </p>

            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-sans focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none shadow-inner"
              placeholder="Describe the desired visual style, elements, and mood..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isReRendering}
                onClick={handleReRenderPrompt}
                className="px-5 py-2 rounded-full roopantar-btn-primary text-xs font-bold shadow-sm flex items-center gap-2"
              >
                {isReRendering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Re-Render Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
