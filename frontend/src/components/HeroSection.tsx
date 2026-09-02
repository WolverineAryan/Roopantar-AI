import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  FileText, 
  Presentation, 
  Share2, 
  Twitter, 
  Video, 
  BarChart2, 
  Clock, 
  Database,
  Flame,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onSelectPreset: (presetText: string) => void;
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

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onSelectPreset }) => {
  const [activeVisualTab, setActiveVisualTab] = useState<'flow' | 'ico' | 'formats'>('flow');

  return (
    <div className="space-y-12 pt-4 pb-6 relative">
      
      {/* Background radial ambient halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-orange-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Headline & Intro */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full roopantar-badge text-xs font-bold tracking-tight shadow-[0_0_20px_rgba(236,72,153,0.25)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 animate-ping" />
          <span className="text-white font-medium">Single-Source GenAI Content Transformation</span>
          <span className="text-slate-500">•</span>
          <span className="text-pink-300 font-mono text-[11px] font-bold">Production MVP</span>
        </div>

        {/* Dynamic Dual-Tone Hero Title */}
        <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          One Source Document.{' '}
          <span className="brand-gradient-text block sm:inline">
            7 Ready Deliverables.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Stop writing presentations, executive summaries, and advisories manually. Ingest your source material once to extract a shared <strong className="text-white font-semibold">Intent Context Object (ICO)</strong> and fan out to PowerPoint, Word, PDF, Social, and Video scripts in seconds.
        </p>

        {/* Action Buttons & Quick Presets */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 roopantar-btn-primary font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-pink-500/25 group cursor-pointer"
          >
            <span>Launch Studio Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectPreset(SAMPLE_CYBER_BRIEFING)}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-full roopantar-btn-secondary text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🛡️ Threat Brief</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset(SAMPLE_FOOD_PRODUCT)}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-full roopantar-btn-secondary text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🥗 Product Launch</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modular Interactive Architecture Showcase */}
      <div className="roopantar-card rounded-3xl p-6 sm:p-8 border border-white/[0.1] shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
        
        {/* Showcase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-500/30 border border-white/10 flex items-center justify-center text-pink-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Interactive Transformation Architecture</h3>
              <p className="text-xs text-slate-400">Deterministic Single-Source to Multi-Format Pipeline</p>
            </div>
          </div>

          {/* Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveVisualTab('flow')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeVisualTab === 'flow' ? 'roopantar-btn-primary text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualTab('ico')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeVisualTab === 'ico' ? 'roopantar-btn-primary text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shared ICO Core
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualTab('formats')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeVisualTab === 'formats' ? 'roopantar-btn-primary text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Output Matrix
            </button>
          </div>
        </div>

        {/* Tab 1: Pipeline Flow Interactive Graphic */}
        {activeVisualTab === 'flow' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center py-4">
            
            {/* Stage 1: Input Ingestion */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 relative group hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  STEP 01
                </span>
                <FileText className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Multi-Modal Source Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ingest PDF, DOCX, TXT, OCR scanned images, or multimedia audio/video.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">.PDF</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">.DOCX</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">Whisper Audio</span>
              </div>
            </div>

            {/* Stage 2: Unified Intent Core */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-pink-950/30 to-purple-950/40 border border-pink-500/40 space-y-3 relative shadow-[0_0_30px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                  STEP 02 (CORE)
                </span>
                <Database className="w-4 h-4 text-pink-400 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white">Single-Pass Intent Extraction (ICO)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Extracts topic, key facts, risk flags, tone signals, and action items in 1 unified LLM pass.
              </p>
              <div className="text-[11px] font-mono text-pink-300 font-semibold flex items-center gap-1 pt-1">
                <span>⚡ 70%+ Token Cost Reduction</span>
              </div>
            </div>

            {/* Stage 3: Parallel Fan-Out */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 relative group hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                  STEP 03
                </span>
                <Layers className="w-4 h-4 text-orange-400" />
              </div>
              <h4 className="text-sm font-bold text-white">7 Concurrent Deliverable Exporters</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Parallel generator pool outputs schema-validated files and export downloads simultaneously.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-slate-300">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">.PPTX</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">.DOCX</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">.PDF</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Shared ICO Core Schema Inspector */}
        {activeVisualTab === 'ico' && (
          <div className="p-5 rounded-2xl bg-[#080B12] border border-white/[0.08] space-y-4 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 text-[11px] text-pink-400 font-bold">
              <span>IntentContextObject (ICO) — Pydantic Schema</span>
              <span>Single-Pass Ground Truth</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-purple-400 font-bold">• Core Taxonomy:</span>
                <p className="text-slate-400">topic: str, domain: str, executive_summary: str</p>
                <span className="text-pink-400 font-bold">• Extracted Intelligence:</span>
                <p className="text-slate-400">key_entities: List[str], key_facts: List[str]</p>
              </div>
              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-orange-400 font-bold">• Risk & Action Vectors:</span>
                <p className="text-slate-400">risk_flags: List[str], recommended_actions: List[str]</p>
                <span className="text-emerald-400 font-bold">• Stylistic Alignment:</span>
                <p className="text-slate-400">tone_signals: List[str], audience_target: str</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 7 Output Matrix Grid */}
        {activeVisualTab === 'formats' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 py-2">
            {[
              { title: 'Advisory', icon: ShieldCheck, ext: '.DOCX/.PDF', col: 'text-rose-400' },
              { title: 'Executive BLUF', icon: FileText, ext: '.DOCX/.PDF', col: 'text-purple-400' },
              { title: 'LinkedIn Post', icon: Share2, ext: 'Text / TXT', col: 'text-sky-400' },
              { title: 'Twitter Thread', icon: Twitter, ext: 'Thread / TXT', col: 'text-emerald-400' },
              { title: 'Presentation', icon: Presentation, ext: '.PPTX Slides', col: 'text-amber-400' },
              { title: 'Video Package', icon: Video, ext: 'Script (.DOCX)', col: 'text-pink-400' },
              { title: 'Infographic', icon: BarChart2, ext: 'Blueprint (.PDF)', col: 'text-orange-400' },
            ].map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2 hover:border-pink-500/40 transition-all">
                <f.icon className={`w-5 h-5 mx-auto ${f.col}`} />
                <div className="text-xs font-bold text-white truncate">{f.title}</div>
                <div className="text-[10px] font-mono text-slate-400">{f.ext}</div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modular 4-Card Bento Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        
        <div className="p-5 rounded-2xl roopantar-card space-y-2 group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white font-mono brand-gradient-text">&gt;70%</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Cost & Token Optimization</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Eliminates redundant prompt token overhead by extracting the ICO once.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card space-y-2 group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white font-mono brand-gradient-text">100%</span>
            <ShieldCheck className="w-4 h-4 text-pink-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Deterministic Schemas</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Strict Pydantic schema validation ensures zero hallucinated layout defects.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card space-y-2 group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white font-mono brand-gradient-text">~8s</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Sub-10s Parallel Latency</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Concurrent worker pool generates 7 deliverables simultaneously.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card space-y-2 group hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-white font-mono brand-gradient-text">7-in-1</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">Enterprise Formats</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Native PowerPoint, Word, PDF, video storyboards, and social threads.
          </p>
        </div>

      </div>

    </div>
  );
};
