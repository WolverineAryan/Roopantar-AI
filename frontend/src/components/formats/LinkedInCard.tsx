import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface LinkedInCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const LinkedInCard: React.FC<LinkedInCardProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const fullText =
    data.full_formatted_post ||
    `${data.headline_hook || ''}\n\n${(data.body_paragraphs || []).join('\n\n')}\n\nKey Takeaways:\n${(data.key_takeaways || []).map((t: string) => `🔹 ${t}`).join('\n')}\n\n${data.call_to_action || ''}\n\n${(data.hashtags || []).join(' ')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/20 shadow-inner">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Publication-Ready LinkedIn Post</h4>
            <p className="text-xs text-slate-400">Optimized with scroll-stopping hook, formatting whitespace & CTA</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all self-start sm:self-auto shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Full Post'}
        </button>
      </div>

      {/* Post Preview Box styled like a modern Dark LinkedIn Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080B12] border border-white/[0.1] shadow-2xl space-y-5 max-w-2xl mx-auto relative overflow-hidden">
        
        <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl roopantar-btn-primary flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            RA
          </div>
          <div>
            <h5 className="text-sm font-bold text-white flex items-center gap-2">
              Roopantar-AI Communications
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
            </h5>
            <p className="text-xs text-slate-400">Strategic Intelligence & Product Outreach • Just now</p>
          </div>
        </div>

        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-4 font-sans">
          <p className="font-extrabold text-base text-white">{data.headline_hook}</p>
          
          {data.body_paragraphs && data.body_paragraphs.map((p: string, i: number) => (
            <p key={i} className="text-slate-300">{p}</p>
          ))}

          {data.key_takeaways && data.key_takeaways.length > 0 && (
            <div className="space-y-2 py-2">
              <p className="font-bold text-pink-300">💡 Key Highlights & Insights:</p>
              {data.key_takeaways.map((takeaway: string, idx: number) => (
                <p key={idx} className="pl-3 border-l-2 border-pink-500 text-slate-200">
                  {takeaway}
                </p>
              ))}
            </div>
          )}

          {data.call_to_action && (
            <p className="text-slate-200 font-semibold italic pt-2">{data.call_to_action}</p>
          )}

          {data.hashtags && (
            <p className="text-pink-400 font-bold pt-2 font-mono">{data.hashtags.join(' ')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
