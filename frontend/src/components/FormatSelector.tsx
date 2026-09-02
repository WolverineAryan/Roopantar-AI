import React from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Share2, 
  Twitter, 
  Presentation, 
  Video, 
  BarChart2, 
  Check, 
  Layers 
} from 'lucide-react';
import { FormatItem } from '../types';

interface FormatSelectorProps {
  formats: FormatItem[];
  selectedFormats: string[];
  setSelectedFormats: (formats: string[]) => void;
}

const ICON_MAP: Record<string, any> = {
  ShieldAlert: ShieldAlert,
  FileText: FileText,
  Share2: Share2,
  Twitter: Twitter,
  Presentation: Presentation,
  Video: Video,
  BarChart2: BarChart2,
};

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  formats,
  selectedFormats,
  setSelectedFormats,
}) => {
  const toggleFormat = (id: string) => {
    if (selectedFormats.includes(id)) {
      if (selectedFormats.length === 1) return;
      setSelectedFormats(selectedFormats.filter((f) => f !== id));
    } else {
      setSelectedFormats([...selectedFormats, id]);
    }
  };

  const selectAll = () => {
    setSelectedFormats(formats.map((f) => f.id));
  };

  const selectCore = () => {
    setSelectedFormats(['advisory', 'linkedin', 'presentation']);
  };

  return (
    <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden group">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-700 mb-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-[11px]">02</span>
            CONFIGURABLE DELIVERABLE ROUTER
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Target Output Formats
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Simultaneously generated from the single-pass Intent Context Object (ICO).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-all shadow-2xs"
          >
            Select All ({formats.length})
          </button>
          <button
            type="button"
            onClick={selectCore}
            className="text-xs px-4 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-all shadow-2xs"
          >
            Core 3 Only
          </button>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {formats.map((fmt) => {
          const isSelected = selectedFormats.includes(fmt.id);
          const IconComp = ICON_MAP[fmt.icon] || Layers;

          return (
            <div
              key={fmt.id}
              onClick={() => toggleFormat(fmt.id)}
              className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-pink-500 shadow-md shadow-pink-500/10 ring-2 ring-pink-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                  isSelected ? 'bg-gradient-to-tr from-purple-100 to-pink-100 text-pink-700 border border-pink-200' : 'bg-white border border-slate-200 text-slate-500'
                }`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'roopantar-btn-primary shadow-xs'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{fmt.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {fmt.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Export:</span>
                {fmt.export_formats.map((ext) => (
                  <span
                    key={ext}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200"
                  >
                    .{ext}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
