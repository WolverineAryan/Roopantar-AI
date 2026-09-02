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
  ChevronRight,
  TrendingUp,
  Download,
  Play,
  Volume2
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
  return (
    <div className="space-y-16 pt-6 pb-4 relative">
      
      {/* Background Soft Pastel Ambient Halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-purple-200/40 via-pink-200/35 to-orange-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Headline & Intro */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        
        {/* Crisp White Top Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold tracking-tight shadow-sm text-slate-800">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 animate-pulse" />
          <span>Single-Source GenAI Content Transformation Engine</span>
          <span className="text-slate-300">•</span>
          <span className="brand-gradient-text font-mono text-[11px] font-extrabold">Enterprise Platform</span>
        </div>

        {/* High-Impact Hero Headline */}
        <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto">
          One Source Document.{' '}
          <span className="brand-gradient-text block sm:inline">
            7 Ready Deliverables.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
          Ingest raw documents, incident briefings, and multimedia once. Roopantar extracts a single-pass <strong className="text-slate-900 font-semibold">Intent Context Object (ICO)</strong> and deterministically outputs schema-validated presentation decks, executive summaries, advisories, and social threads in seconds.
        </p>

        {/* CTA Buttons & Presets */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 roopantar-btn-primary font-bold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-pink-500/20 group cursor-pointer"
          >
            <span>Open Studio Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onSelectPreset(SAMPLE_CYBER_BRIEFING)}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🛡️ Security Brief</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset(SAMPLE_FOOD_PRODUCT)}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🥗 Product Launch</span>
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Visual Stage: 3D Deliverable Objects Surrounding Neural Transformation Hub */}
      <div className="relative max-w-6xl mx-auto py-8">
        
        {/* Subtle grid pattern background under objects */}
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        {/* Central Transformation Hub */}
        <div className="relative z-20 flex flex-col items-center justify-center my-6">
          
          <div className="relative p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-purple-500/5 max-w-xs text-center space-y-3 group hover:border-pink-300 transition-all">
            
            {/* Glowing ambient ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity -z-10" />

            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-50 to-pink-50 border border-pink-100 flex items-center justify-center p-2 shadow-inner">
              <img src="/logo.png" alt="Roopantar Core" className="h-10 w-auto object-contain" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                Single-Pass Engine
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">
                Intent Context Object (ICO)
              </h3>
              <p className="text-[11px] text-slate-500 leading-snug">
                Extracts facts, risks, and taxonomy once. Eliminates 70%+ redundant LLM compute.
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fan-Out to 7 Formats Parallel</span>
            </div>
          </div>

        </div>

        {/* 4 Interactive Floating Deliverable Objects in Bento Array */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          
          {/* Object 1: PowerPoint Presentation Deck Object */}
          <div className="roopantar-floating-object p-5 rounded-3xl space-y-3 animate-float-slow hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                <Presentation className="w-3 h-3 text-purple-600" />
                Keynote Deck
              </span>
              <span className="text-[10px] font-mono text-slate-400">16:9 Widescreen</span>
            </div>

            {/* Mini Slide Preview Object */}
            <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-3.5 text-white flex flex-col justify-between shadow-md">
              <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>SLIDE 01/06</span>
                <span className="text-pink-400">Roopantar-AI</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-white leading-tight">Executive Threat Response</h5>
                <p className="text-[10px] text-slate-300 line-clamp-2 mt-0.5 leading-snug">
                  • Perimeter isolation enforced across all 4 edge gateway nodes.
                </p>
              </div>
              <div className="text-[8px] text-slate-500 font-mono pt-1 border-t border-slate-700">
                Speaker notes attached (.pptx)
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">Presentation Deck</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono text-[10px] font-bold">.PPTX</span>
            </div>
          </div>

          {/* Object 2: Security & Operational Threat Advisory */}
          <div className="roopantar-floating-object p-5 rounded-3xl space-y-3 animate-float-reverse hover:border-pink-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-rose-600" />
                Threat Advisory
              </span>
              <span className="text-[10px] font-mono text-rose-600 font-bold animate-pulse">CRITICAL</span>
            </div>

            {/* Mini Advisory Document Object */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-b border-slate-100 pb-1">
                <span>ADV-2026-8841</span>
                <span>CVE-2026-4419</span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 leading-tight">Edge Gateway Vulnerability</h5>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Port 8443 Management Interface</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Hotfix HF-2026-9A Mandated</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">Operational Advisory</span>
              <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 font-mono text-[10px] font-bold">.DOCX / .PDF</span>
            </div>
          </div>

          {/* Object 3: LinkedIn Viral Thought-Leadership */}
          <div className="roopantar-floating-object p-5 rounded-3xl space-y-3 animate-float-slow hover:border-pink-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1">
                <Share2 className="w-3 h-3 text-sky-600" />
                LinkedIn Post
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">98% Score</span>
            </div>

            {/* Mini Social Post Object */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
                  RA
                </div>
                <div className="text-[9px] text-slate-700 font-bold">Roopantar Engine</div>
              </div>
              <p className="text-[10px] text-slate-800 font-semibold leading-snug line-clamp-2">
                🚨 Critical cybersecurity update: Are your edge gateways patched?
              </p>
              <div className="text-[9px] text-pink-600 font-mono">
                #CyberSecurity #DevOps #Leadership
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">Social Distribution</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono text-[10px] font-bold">1-Click Copy</span>
            </div>
          </div>

          {/* Object 4: Video Script & Storyboard Scene Object */}
          <div className="roopantar-floating-object p-5 rounded-3xl space-y-3 animate-float-reverse hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 flex items-center gap-1">
                <Video className="w-3 h-3 text-orange-600" />
                Video Storyboard
              </span>
              <span className="text-[10px] font-mono text-slate-500">90s Package</span>
            </div>

            {/* Mini Storyboard Scene Object */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>SCENE 02</span>
                <span className="text-orange-600 font-bold">00:15 - 00:30</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[9px] text-slate-700 italic leading-snug line-clamp-2">
                "Voiceover: Immediate perimeter containment prevents lateral intrusion..."
              </div>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
                <Volume2 className="w-3 h-3 text-orange-500" />
                <span>Audio: Urgent synth beat</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
              <span className="font-semibold text-slate-800">Multimedia Script</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-mono text-[10px] font-bold">.DOCX</span>
            </div>
          </div>

        </div>

      </div>

      {/* Modular 4-Card Bento Stats Bar on Pure White Canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        
        <div className="p-5 rounded-2xl roopantar-card-white space-y-1.5 group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono brand-gradient-text">&gt;70%</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xs font-bold text-slate-900">Cost & Token Optimization</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminates redundant prompt token overhead by extracting the ICO once.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card-white space-y-1.5 group hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono brand-gradient-text">100%</span>
            <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xs font-bold text-slate-900">Deterministic Schemas</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Strict Pydantic schema validation ensures zero hallucinated layout defects.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card-white space-y-1.5 group hover:border-orange-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono brand-gradient-text">~8s</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xs font-bold text-slate-900">Sub-10s Parallel Latency</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Concurrent worker pool generates 7 deliverables simultaneously.
          </p>
        </div>

        <div className="p-5 rounded-2xl roopantar-card-white space-y-1.5 group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono brand-gradient-text">7-in-1</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-xs font-bold text-slate-900">Enterprise Formats</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Native PowerPoint, Word, PDF, video storyboards, and social threads.
          </p>
        </div>

      </div>

    </div>
  );
};
