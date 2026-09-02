import React, { useState } from 'react';
import { Twitter, Copy, Check } from 'lucide-react';

interface TwitterThreadCardProps {
  jobId: string;
  data: Record<string, any>;
  onRegenerate: () => void;
}

export const TwitterThreadCard: React.FC<TwitterThreadCardProps> = ({ data }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const tweets = data.tweets || [];

  const copySingleTweet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAllTweets = () => {
    const fullThread = tweets.map((t: any) => t.content).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullThread);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center border border-orange-200 shadow-inner">
            <Twitter className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">X / Twitter Thread ({tweets.length} Tweets)</h4>
            <p className="text-xs text-slate-500">Structured narrative with hook, data breakdowns, and call to action</p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyAllTweets}
          className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 transition-all self-start sm:self-auto shrink-0"
        >
          {allCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {allCopied ? 'Copied Full Thread!' : 'Copy Entire Thread'}
        </button>
      </div>

      {/* Tweets Flow on Crisp White Cards */}
      <div className="space-y-3.5 max-w-xl mx-auto">
        {tweets.map((tweet: any, idx: number) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-2xs group"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-bold border border-pink-200">
                Tweet {tweet.tweet_number || idx + 1} / {tweets.length}
              </span>
              <button
                type="button"
                onClick={() => copySingleTweet(tweet.content, idx)}
                className="text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                title="Copy tweet"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-pink-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {tweet.content}
            </p>

            <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-mono">
              <span className="text-orange-700 font-semibold">{tweet.purpose || 'Post'}</span>
              <span>{(tweet.content || '').length} / 280 chars</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
