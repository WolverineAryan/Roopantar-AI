import React, { useState } from 'react';
import { 
  Sparkles, 
  Megaphone, 
  Image as ImageIcon, 
  Video, 
  Share2, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Maximize2, 
  X, 
  RefreshCw, 
  Palette, 
  Zap, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { createJob, getJob, getExportDownloadUrl } from '../lib/api';
import { Job, GenerationParams } from '../types';

interface StyleOption {
  id: string;
  name: string;
  desc: string;
  badge: string;
  icon: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'photorealistic', name: 'Cinematic Photorealism (8K)', desc: 'Hasselblad 50mm, studio depth, hyper-detailed textures', badge: 'Ultra HD', icon: '📸' },
  { id: 'glassmorphism_3d', name: '3D Isometric Glassmorphism', desc: 'Translucent glowing glass, vibrant neon reflections, octane render', badge: '3D Modern', icon: '💎' },
  { id: 'minimalist_editorial', name: 'Executive Minimalist', desc: 'Clean Apple/Stripe-style SaaS aesthetic, high contrast', badge: 'Editorial', icon: '🏛️' },
  { id: 'cyber_glow', name: 'Cyber Neon Tech Glow', desc: 'Dark obsidian canvas, vivid purple and coral neon laser accents', badge: 'Cyberpunk', icon: '⚡' },
];

const PRESETS = [
  {
    title: '🥗 DTC Organic Food Brand Launch',
    content: 'Introducing "GreenPulse Superbowls" — 100% cold-crafted organic macro bowls with zero preservatives. Launching across 25 major metro hubs with direct-to-consumer sustainable packaging. Launch offer: 25% off first subscription box using code FRESH2026. Target audience: health-conscious professionals, fitness athletes, and eco-minded consumers.'
  },
  {
    title: '⚡ Next-Gen AI Developer Platform',
    content: 'Announcing "Roopantar Cloud API" — Single-pass multi-modal content engine allowing dev teams to convert technical documentation into 8 multi-format deliverables in sub-10 seconds. Slashing token costs by 70% with deterministic JSON schema guarantees.'
  },
  {
    title: '🛡️ Enterprise Cyber Resilience Brief',
    content: 'Urgent security directive: All corporate workstations must enforce multi-factor hardware security tokens and patch perimeter VPN clients within 24 hours to prevent unauthorized credential stuffing.'
  }
];

export const MarketingStudio: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['Instagram', 'TikTok', 'LinkedIn', 'X']);
  const [selectedStyle, setSelectedStyle] = useState<string>('photorealistic');
  const [campaignGoal, setCampaignGoal] = useState<string>('Product Launch & Viral Growth');
  
  // Generation & Active Job state
  const [isGenerating, setIsGenerating] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'visuals' | 'storyboard' | 'copy'>('visuals');
  
  // Lightbox & Tweaker modals
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isReRendering, setIsReRendering] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => 
      prev.includes(channel) ? (prev.length > 1 ? prev.filter((c) => c !== channel) : prev) : [...prev, channel]
    );
  };

  const handleLaunchCampaign = async () => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setJob(null);

    try {
      const params: GenerationParams = {
        tone: 'Persuasive & Engaging',
        audience: selectedChannels.join(', ') + ' Audience',
        language: 'English',
        detail_level: 'Comprehensive',
        objective: campaignGoal,
      };

      // Select marketing-relevant formats
      const selectedFormats = ['image_assets', 'video_package', 'linkedin', 'twitter', 'infographic'];
      const created = await createJob(null, promptText, selectedFormats, params);

      // Poll until completed
      let currentJob = created;
      let attempts = 0;
      while (attempts < 40 && (currentJob.status === 'queued' || currentJob.status === 'analyzing' || currentJob.status === 'generating')) {
        await new Promise((r) => setTimeout(r, 1500));
        currentJob = await getJob(created.id);
        attempts++;
      }

      setJob(currentJob);
    } catch (err: any) {
      console.error('Marketing generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const imageOutput = job?.outputs?.find((o) => o.format_type === 'image_assets');
  const videoOutput = job?.outputs?.find((o) => o.format_type === 'video_package');
  const linkedinOutput = job?.outputs?.find((o) => o.format_type === 'linkedin');
  const twitterOutput = job?.outputs?.find((o) => o.format_type === 'twitter');

  const imageAssets = imageOutput?.content_json?.assets || [];
  const videoScenes = videoOutput?.content_json?.scenes || [];

  const handleReRenderPrompt = () => {
    if (!editingImage || !customPrompt.trim()) return;
    setIsReRendering(true);
    
    const encoded = encodeURIComponent(customPrompt.trim().replace(/\n/g, ' '));
    const seed = Math.floor(Math.random() * 900000) + 100000;
    
    let w = 1280;
    let h = 720;
    if (editingImage.aspect_ratio === '9:16') {
      w = 720;
      h = 1280;
    } else if (editingImage.aspect_ratio === '1.91:1') {
      w = 1200;
      h = 630;
    } else if (editingImage.aspect_ratio === '1:1') {
      w = 1024;
      h = 1024;
    }

    const newUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${w}&height=${h}&nologo=true&seed=${seed}&model=flux-realism&enhance=true`;

    setTimeout(() => {
      editingImage.image_prompt = customPrompt.trim();
      editingImage.image_url = newUrl;
      setIsReRendering(false);
      setEditingImage(null);
    }, 600);
  };

  return (
    <div className="space-y-10 py-6">
      
      {/* Marketing Studio Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-slate-900 to-pink-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-pink-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold font-mono text-pink-300">
            <Megaphone className="w-3.5 h-3.5 text-pink-400" />
            AI CREATIVE & SOCIAL MARKETING ENGINE
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Multi-Platform Visual & Video Campaigns <span className="brand-gradient-text">in Seconds</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Convert any product launch, marketing brief, or announcement into photorealistic <strong>FLUX.1 Realism graphics</strong> (`9:16` Reels, `1:1` Feed, `1.91:1` Banners), video storyboards with spoken voiceover, and viral platform copy.
          </p>
        </div>
      </div>

      {/* Campaign Setup Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Campaign Brief Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                1. Campaign Brief & Product Details:
              </label>
            </div>

            <textarea
              rows={6}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste your product release notes, launch details, marketing angles, or promotional offer..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none transition-all shadow-inner leading-relaxed"
            />

            {/* Quick-Fill Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">1-Click Starter Presets:</span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptText(preset.content)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-xs font-medium transition-all"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Channels Selector */}
          <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-4">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              2. Target Marketing Channels:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Instagram', icon: Instagram, desc: 'Reels & Feed' },
                { name: 'TikTok', icon: Video, desc: 'Shorts & FYP' },
                { name: 'LinkedIn', icon: Linkedin, desc: 'B2B Thought-Leadership' },
                { name: 'X', icon: Twitter, desc: 'Viral Threads' },
              ].map((chan) => {
                const isSelected = selectedChannels.includes(chan.name);
                const Icon = chan.icon;

                return (
                  <button
                    key={chan.name}
                    type="button"
                    onClick={() => toggleChannel(chan.name)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-tr from-pink-50 to-purple-50 border-pink-500 ring-2 ring-pink-500/20 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-pink-600' : 'text-slate-500'}`} />
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-pink-600 text-white' : 'border border-slate-300'}`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{chan.name}</div>
                      <div className="text-[10px] text-slate-500">{chan.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Visual Style & Launch Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-5">
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-500" />
              3. Visual Aesthetic & Render Style:
            </label>

            <div className="space-y-3">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-white border-pink-500 shadow-md ring-2 ring-pink-500/20'
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{style.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold text-slate-600 border border-slate-200">
                          {style.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{style.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campaign Goal Dropdown */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700">Campaign Objective:</label>
              <select
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              >
                <option value="Product Launch & Viral Growth">🚀 Product Launch & Viral Growth</option>
                <option value="Brand Awareness & Community Engagement">🌟 Brand Awareness & Engagement</option>
                <option value="Direct Conversion & Limited Offer">💰 Direct Conversion & Lead Gen</option>
                <option value="Thought-Leadership & Industry Authority">🏆 Thought-Leadership & Authority</option>
              </select>
            </div>

            {/* Action Button */}
            <button
              type="button"
              disabled={isGenerating || !promptText.trim()}
              onClick={handleLaunchCampaign}
              className="w-full py-4 rounded-2xl roopantar-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Visual Campaign & Copy...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300" />
                  <span>Generate Multi-Channel Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Generated Campaign Dashboard Stage */}
      {job && (
        <div className="roopantar-card-white rounded-3xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  CAMPAIGN READY (FLUX.1 REALISM)
                </span>
                <span className="text-xs text-slate-500">• 4 Aspect Ratios Generated</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {imageOutput?.content_json?.title || 'Visual Campaign Suite'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={getExportDownloadUrl(job.id, 'image_assets', 'zip')}
                className="px-5 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20"
              >
                <Download className="w-4 h-4" />
                Download All Assets (.ZIP)
              </a>
            </div>
          </div>

          {/* Sub-Tabs: Visuals vs Storyboard vs Copy */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full w-fit border border-slate-200">
            <button
              onClick={() => setActiveSubTab('visuals')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'visuals' ? 'roopantar-btn-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Multi-Aspect Visuals (4)
            </button>
            <button
              onClick={() => setActiveSubTab('storyboard')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'storyboard' ? 'roopantar-btn-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video Storyboard & Voiceover
            </button>
            <button
              onClick={() => setActiveSubTab('copy')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'copy' ? 'roopantar-btn-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Viral Copy & Captions
            </button>
          </div>

          {/* TAB 1: Visuals Grid (4 Multi-Aspect Renders) */}
          {activeSubTab === 'visuals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {imageAssets.map((asset: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  {/* Image Container with Dynamic Aspect */}
                  <div className="relative w-full aspect-[4/5] bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={asset.image_url}
                      alt={asset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white text-[10px] font-mono font-bold">
                      {asset.aspect_ratio}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedImage(asset)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Asset Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{asset.label}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic mt-1 bg-slate-50 p-2 rounded-lg">
                        "{asset.image_prompt}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingImage(asset);
                          setCustomPrompt(asset.image_prompt);
                        }}
                        className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Sliders className="w-3 h-3" />
                        Tweak
                      </button>

                      <a
                        href={asset.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        HD
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Video Storyboard & Script */}
          {activeSubTab === 'storyboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videoScenes.map((scene: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="font-bold text-xs uppercase tracking-wider text-purple-700 font-mono">
                        Scene {scene.scene_number || idx + 1}: {scene.scene_name}
                      </span>
                      <span className="px-3 py-0.5 rounded-full bg-slate-200 text-[10px] font-mono font-bold text-slate-700">
                        {scene.timestamp_marker || '00:15'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-900">🎬 Visual Direction:</strong>
                        <p className="text-slate-600 mt-0.5">{scene.visual_description}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <strong className="text-purple-900">🎙️ Spoken Voiceover Narration:</strong>
                        <p className="text-slate-800 italic mt-1">"{scene.narration_voiceover}"</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>On-Screen: <strong>{scene.on_screen_text}</strong></span>
                        <span>Mood: <strong>{scene.audio_mood}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Viral Social Copy */}
          {activeSubTab === 'copy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* LinkedIn Post Copy */}
              {linkedinOutput && (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">LinkedIn Viral Post Copy</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(linkedinOutput.content_json?.full_formatted_post || JSON.stringify(linkedinOutput.content_json), 'linkedin')}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs"
                    >
                      {copiedSection === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'linkedin' ? 'Copied' : 'Copy Post'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {linkedinOutput.content_json?.headline_hook && (
                      <p className="font-bold text-slate-900 mb-3">{linkedinOutput.content_json.headline_hook}</p>
                    )}
                    <p>{linkedinOutput.content_json?.body_paragraphs?.join('\n\n')}</p>
                    {linkedinOutput.content_json?.hashtags && (
                      <p className="text-blue-600 mt-4">{linkedinOutput.content_json.hashtags.join(' ')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Twitter / X Thread Copy */}
              {twitterOutput && (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Twitter className="w-5 h-5 text-slate-900" />
                      <h4 className="font-bold text-slate-900 text-sm">Twitter / X Thread Package</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(twitterOutput.content_json?.tweets?.map((t: any) => t.content).join('\n\n---\n\n') || '', 'twitter')}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs"
                    >
                      {copiedSection === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSection === 'twitter' ? 'Copied' : 'Copy Thread'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {twitterOutput.content_json?.tweets?.map((t: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                        <span className="text-[10px] font-mono font-bold text-purple-600 block mb-1">Tweet {t.tweet_number || idx + 1}</span>
                        {t.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <span className="font-bold text-xs font-mono text-purple-700">{selectedImage.aspect_ratio} • {selectedImage.dimensions}</span>
              <button onClick={() => setSelectedImage(null)} className="p-1.5 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center">
              <img src={selectedImage.image_url} alt="Full View" className="max-h-[65vh] object-contain rounded-xl" />
            </div>
            <div className="p-4 flex items-center justify-between bg-white border-t border-slate-200">
              <p className="text-xs text-slate-600 italic max-w-xl line-clamp-2">"{selectedImage.image_prompt}"</p>
              <a
                href={selectedImage.image_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full roopantar-btn-primary text-xs font-bold"
              >
                Download PNG
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tweak Prompt Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                Tweak FLUX.1 Realism Prompt
              </h4>
              <button onClick={() => setEditingImage(null)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setEditingImage(null)} className="px-4 py-2 rounded-full bg-slate-100 text-xs font-medium">Cancel</button>
              <button
                disabled={isReRendering}
                onClick={handleReRenderPrompt}
                className="px-5 py-2 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2"
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
