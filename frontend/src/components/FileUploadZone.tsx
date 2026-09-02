import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Video, Image, FileCode, X, Sparkles, Wand2 } from 'lucide-react';

interface FileUploadZoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  rawText: string;
  setRawText: (text: string) => void;
  activeInputTab: 'file' | 'text';
  setActiveInputTab: (tab: 'file' | 'text') => void;
}

const SAMPLE_CYBER_BRIEFING = `GLOBAL CYBER DEFENSE INITIATIVE | OPERATIONAL THREAT BULLETIN
INCIDENT ID: CTI-2026-8841 | DATE: September 02, 2026

1. EXECUTIVE SUMMARY
Over the past 48 hours, perimeter telemetry detected a coordinated intrusion campaign targeting edge gateways, firewall appliances, and VPN concentrators across regional data infrastructure. The threat actors are exploiting a critical remote code execution vulnerability (CVE-2026-4419) in outdated gateway firmware (EdgeOS versions 4.1.0 through 4.3.8).

2. TECHNICAL DETAILS & VECTORS
- Target Ports: External interface port 8443 (Management GUI) and UDP port 500 (IPsec IKE daemon).
- Observed Signature: Encrypted binary staging via dynamic DNS endpoints hosted on offshore hosting clusters.
- Threat Vector: Memory buffer overrun condition enabling root-level shell execution.
- Observed Impact: Unauthorized configuration modifications detected on 4 critical perimeter gateways. Potential risk of lateral movement into internal operational databases.

3. MANDATORY MITIGATION DIRECTIVES
- Immediate (0-12 Hours): Isolate all management interfaces from public routing. Enforce access strictly via dedicated out-of-band bastion hosts.
- Immediate (0-24 Hours): Apply emergency vendor security hotfix HF-2026-9A across all perimeter devices.
- Short-Term (48 Hours): Rotate all administrative SSH private keys, API access tokens, and root passwords.
- Continuous: Deploy enhanced deep packet inspection rules (Rulepack SEC-2026-SEPT-01) on firewall ingress points.

4. DISSEMINATION MANDATE
Brief executive leadership, issue technical advisories to SecOps teams, and prepare public awareness communications.`;

const SAMPLE_FOOD_PRODUCT = `NUTRA-ORGANICS INDIA | PRODUCT STRATEGY & NUTRITION BRIEFING
SUBJECT: National Launch of 'ProMillet-Active' — Bio-Fortified Superfood Energy Drink
DATE: September 02, 2026 | DOCUMENT REF: NOI-RND-2026-4401

1. PRODUCT OVERVIEW & STRATEGIC CONTEXT
Nutra-Organics India has completed clinical trials for 'ProMillet-Active', an all-natural, plant-based functional energy beverage formulated from ancient Indian indigenous millets (Ragi, Jowar, and Bajra), fortified with vegan plant proteins, prebiotic fiber, and essential electrolytes. The product is designed to replace high-sugar commercial energy drinks for athletes, working professionals, and health-conscious consumers.

2. KEY PRODUCT SPECIFICATIONS & NUTRITIONAL METRICS
- Macro Profile: 18g Clean Plant Protein, 0g Added Refined Sugar, 6g Prebiotic Gut Fiber, 140 Calories per 250ml bottle.
- Active Ingredients: Sprouted Millet Extract, Ashwagandha adaptogen blend (for sustained stamina without caffeine crashes), and Himalayan Pink Salt electrolytes.
- Certifications: FSSAI Certified, 100% Non-GMO, USDA Organic, Vegan & Dairy-Free.
- Allergen Warning: Contains plant-based almond milk base (Tree Nut Allergen). Gluten-free and lactose-free.

3. MARKET & COMMERCIAL IMPACT
- Target Demographics: Urban fitness enthusiasts, corporate professionals aged 22-45, and athletes.
- Pricing & Packaging: ₹85 per unit in 100% biodegradable ocean-recycled PET bottles.
- Distribution Channels: Direct-to-Consumer (D2C website), Quick-Commerce apps (Blinkit, Zepto, Swiggy Instamart), and 2,500 premium supermarket retail outlets across Delhi-NCR, Mumbai, and Bangalore.
- Projected Revenue: ₹25 Crore ARR targeted within 12 months of rollout.

4. MANDATORY OPERATIONAL & MARKETING DIRECTIVES
- Immediate: Issue retail allergen advisory regarding the almond milk base for shelf labeling compliance.
- Short-Term (Launch Week): Roll out influencer campaign featuring marathon runners and wellness creators.
- Dissemination Mandate: Brief executive leadership on retail supply chain logistics, publish consumer LinkedIn thought-leadership on millet nutrition, and launch social awareness threads on healthy energy alternatives.`;

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  file,
  setFile,
  rawText,
  setRawText,
  activeInputTab,
  setActiveInputTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setActiveInputTab('file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const loadPreset = (presetText: string) => {
    setFile(null);
    setRawText(presetText);
    setActiveInputTab('text');
  };

  const estTokens = Math.round((rawText.length || 0) / 4);

  return (
    <div className="roopantar-card rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden group">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-600/15 transition-all" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full roopantar-badge text-xs font-bold text-pink-300 mb-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[11px]">01</span>
            MULTI-MODAL INGESTION LAYER
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Source Intelligence & Content
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload document files (PDF/Word), audio/video streams, or direct prompts for single-pass analysis.
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-full self-start">
          <button
            type="button"
            onClick={() => setActiveInputTab('text')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeInputTab === 'text'
                ? 'roopantar-btn-primary shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Paste / Prompt Text
          </button>
          <button
            type="button"
            onClick={() => setActiveInputTab('file')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeInputTab === 'file'
                ? 'roopantar-btn-primary shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            File Upload
          </button>
        </div>
      </div>

      {/* Preset Quick Loaders */}
      <div className="flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
          <Wand2 className="w-3.5 h-3.5 text-pink-400" />
          Test Presets:
        </span>
        <button
          type="button"
          onClick={() => loadPreset(SAMPLE_CYBER_BRIEFING)}
          className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-pink-500/15 border border-white/[0.08] hover:border-pink-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          🛡️ Security Incident Advisory
        </button>
        <button
          type="button"
          onClick={() => loadPreset(SAMPLE_FOOD_PRODUCT)}
          className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-orange-500/15 border border-white/[0.08] hover:border-orange-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
        >
          🥗 Superfood Product Launch
        </button>
      </div>

      {/* Upload Zone Tab */}
      {activeInputTab === 'file' ? (
        <div className="relative z-10">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.mp4,.mov,.mp3,.wav"
          />

          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.2)]'
                  : 'border-white/[0.12] hover:border-pink-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-pink-500/20 border border-white/10 flex items-center justify-center text-pink-300 mb-3 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-white">
                Drag and drop your document here, or <span className="text-pink-400 underline decoration-pink-400/50 underline-offset-4">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
                Supports PDF, DOCX, OCR images, and video/audio files (Groq Whisper-large-v3).
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"><FileText className="w-3.5 h-3.5 text-blue-400" /> Documents</span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"><Image className="w-3.5 h-3.5 text-pink-400" /> Images</span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]"><Video className="w-3.5 h-3.5 text-orange-400" /> Audio & Video</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-pink-500/40 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold border border-pink-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{file.name}</h4>
                  <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for ingestion</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 space-y-2">
          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your source intelligence, incident report, press release, product briefing, or prompt text here..."
            className="w-full rounded-2xl bg-[#080B12] border border-white/[0.1] p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500 font-mono resize-y leading-relaxed shadow-inner"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>Character Count: <strong className="text-slate-200">{rawText.length}</strong></span>
            <span>Est. Token Cost: <strong className="text-pink-400">~{estTokens}</strong></span>
          </div>
        </div>
      )}

    </div>
  );
};
