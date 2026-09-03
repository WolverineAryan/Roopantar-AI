import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Plus,
  FolderKanban,
  CheckCircle2,
  Clock,
  Film,
  Hash,
  Tv,
  FileText,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { createJob, getJob, getExportDownloadUrl } from '../lib/api';
import { Job, GenerationParams, MarketingProject } from '../types';

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

const DEFAULT_PROJECTS: MarketingProject[] = [
  {
    id: 'proj-1',
    name: 'GreenPulse DTC Superbowls Launch',
    brand_or_product: 'GreenPulse Organic Bowls',
    campaign_goal: 'Product Launch & Viral Growth',
    target_channels: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'X'],
    visual_style: 'photorealistic',
    brief: 'Introducing "GreenPulse Superbowls" — 100% cold-crafted organic macro bowls with zero preservatives. Launching across 25 major metro hubs with direct-to-consumer sustainable packaging. Launch offer: 25% off first subscription box using code FRESH2026. Target audience: health-conscious professionals, fitness athletes, and eco-minded consumers.',
    created_at: new Date().toISOString(),
    status: 'draft'
  },
  {
    id: 'proj-2',
    name: 'Roopantar Cloud API Announcement',
    brand_or_product: 'Roopantar-AI Cloud API',
    campaign_goal: 'Thought-Leadership & Developer Adoption',
    target_channels: ['LinkedIn', 'X', 'YouTube'],
    visual_style: 'cyber_glow',
    brief: 'Announcing "Roopantar Cloud API" — Single-pass multi-modal content engine allowing dev teams to convert technical documentation into 8 multi-format deliverables in sub-10 seconds. Slashing token costs by 70% with deterministic JSON schema guarantees.',
    created_at: new Date().toISOString(),
    status: 'draft'
  }
];

export const MarketingStudio: React.FC = () => {
  // Projects State
  const [projects, setProjects] = useState<MarketingProject[]>(DEFAULT_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(DEFAULT_PROJECTS[0].id);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newGoal, setNewGoal] = useState('Product Launch & Viral Growth');
  const [newChannels, setNewChannels] = useState<string[]>(['Instagram', 'TikTok', 'LinkedIn', 'X']);
  const [newStyle, setNewStyle] = useState('photorealistic');
  const [newBrief, setNewBrief] = useState('');

  // Active Tool Sub-Studio: 'reels' | 'youtube' | 'graphics' | 'copy' | 'dashboard'
  const [activeToolTab, setActiveToolTab] = useState<'reels' | 'youtube' | 'graphics' | 'copy' | 'dashboard'>('reels');
  const [aspectFilter, setAspectFilter] = useState<string>('all');

  // Generation & Active Job state
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Lightbox & Prompt Tweaker state
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isReRendering, setIsReRendering] = useState(false);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roopantar_marketing_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
  }, []);

  // Save projects to localStorage on change
  const saveProjects = (updated: MarketingProject[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('roopantar_marketing_projects', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save projects to localStorage', e);
    }
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Handle Project Creation
  const handleCreateProject = () => {
    if (!newProjectName.trim() || !newBrief.trim()) return;
    const newProj: MarketingProject = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      brand_or_product: newBrand.trim() || newProjectName.trim(),
      campaign_goal: newGoal,
      target_channels: newChannels,
      visual_style: newStyle,
      brief: newBrief.trim(),
      created_at: new Date().toISOString(),
      status: 'draft'
    };

    const updated = [newProj, ...projects];
    saveProjects(updated);
    setActiveProjectId(newProj.id);
    setShowNewProjectModal(false);

    // Reset modal inputs
    setNewProjectName('');
    setNewBrand('');
    setNewBrief('');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (projects.length <= 1) return;
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (activeProjectId === id) {
      setActiveProjectId(updated[0].id);
    }
  };

  // Launch Campaign Generation for Active Project
  const handleLaunchCampaign = async () => {
    if (!activeProject || !activeProject.brief.trim()) return;
    setIsGenerating(true);

    try {
      const params: GenerationParams = {
        tone: 'Persuasive & High Energy',
        audience: activeProject.target_channels.join(', ') + ' Target Demographic',
        language: 'English',
        detail_level: 'Comprehensive',
        objective: activeProject.campaign_goal,
      };

      const selectedFormats = ['image_assets', 'video_package', 'linkedin', 'twitter', 'infographic'];
      const created = await createJob(null, activeProject.brief, selectedFormats, params);

      // Poll until completed
      let currentJob = created;
      let attempts = 0;
      while (attempts < 45 && (currentJob.status === 'queued' || currentJob.status === 'analyzing' || currentJob.status === 'generating')) {
        await new Promise((r) => setTimeout(r, 1500));
        currentJob = await getJob(created.id);
        attempts++;
      }

      // Update active project with job
      const updatedProjects = projects.map((p) => {
        if (p.id === activeProject.id) {
          return {
            ...p,
            status: 'completed' as const,
            job_id: currentJob.id,
            job: currentJob
          };
        }
        return p;
      });

      saveProjects(updatedProjects);
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

  const currentJob = activeProject?.job;
  const imageOutput = currentJob?.outputs?.find((o) => o.format_type === 'image_assets');
  const videoOutput = currentJob?.outputs?.find((o) => o.format_type === 'video_package');
  const linkedinOutput = currentJob?.outputs?.find((o) => o.format_type === 'linkedin');
  const twitterOutput = currentJob?.outputs?.find((o) => o.format_type === 'twitter');

  const imageAssets = imageOutput?.content_json?.assets || [];
  const videoScenes = videoOutput?.content_json?.scenes || [];

  // Filtered image assets for graphics studio
  const filteredAssets = aspectFilter === 'all' 
    ? imageAssets 
    : imageAssets.filter((a: any) => a.aspect_ratio === aspectFilter);

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
    <div className="space-y-8 py-6">
      
      {/* Top Project Switcher & Actions Bar */}
      <div className="roopantar-card-white rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 max-w-full">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200 shrink-0">
            <FolderKanban className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Campaign Projects:</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveProjectId(proj.id)}
                  className={`px-4 py-2 rounded-2xl cursor-pointer text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-900 to-slate-900 text-white border-slate-800 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="truncate max-w-[160px]">{proj.name}</span>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className={`p-1 rounded-full hover:bg-red-500/20 hover:text-red-400 ${isActive ? 'text-slate-400' : 'text-slate-400'}`}
                      title="Delete Project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4 text-purple-600" />
            <span>New Campaign Project</span>
          </button>
        </div>
      </div>

      {/* Campaign Project Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-8 sm:p-10 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-pink-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[11px] font-bold font-mono uppercase tracking-wider">
                Active Project: {activeProject.name}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-slate-300 text-[11px] font-medium">
                Goal: <strong>{activeProject.campaign_goal}</strong>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {activeProject.brand_or_product}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed italic bg-white/5 p-3 rounded-2xl border border-white/10">
              "{activeProject.brief}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleLaunchCampaign}
              className="px-8 py-4 rounded-full roopantar-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing All Deliverables...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-amber-300 fill-current" />
                  <span>{currentJob ? 'Re-Generate Campaign' : 'Generate Full Campaign'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5-Tool Sub-Studio Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-2xs max-w-full">
        <button
          onClick={() => setActiveToolTab('reels')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeToolTab === 'reels' ? 'roopantar-btn-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>📱 Reels & TikTok Studio (9:16)</span>
        </button>

        <button
          onClick={() => setActiveToolTab('youtube')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeToolTab === 'youtube' ? 'roopantar-btn-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>🎬 YouTube Video Studio (16:9)</span>
        </button>

        <button
          onClick={() => setActiveToolTab('graphics')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeToolTab === 'graphics' ? 'roopantar-btn-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>🎨 Graphics & AI Image Lab</span>
        </button>

        <button
          onClick={() => setActiveToolTab('copy')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeToolTab === 'copy' ? 'roopantar-btn-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>📢 Viral Social Copy</span>
        </button>

        <button
          onClick={() => setActiveToolTab('dashboard')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeToolTab === 'dashboard' ? 'roopantar-btn-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📊 Campaign Dashboard & Exports</span>
        </button>
      </div>

      {/* SUB-STUDIO 1: REELS & TIKTOK STUDIO */}
      {activeToolTab === 'reels' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 9:16 Vertical Visual Keyframes */}
            <div className="lg:col-span-5 space-y-4">
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-pink-50 text-pink-600">
                      <Film className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">9:16 Vertical Visual Frame</h4>
                      <p className="text-[11px] text-slate-500">Rendered for Instagram Reels & TikTok</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 text-[10px] font-mono font-bold">
                    9:16 (720x1280)
                  </span>
                </div>

                {imageAssets.find((a: any) => a.aspect_ratio === '9:16') ? (
                  (() => {
                    const verticalAsset = imageAssets.find((a: any) => a.aspect_ratio === '9:16');
                    return (
                      <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[9/16] max-h-[480px] mx-auto flex items-center justify-center shadow-lg group">
                        <img
                          src={verticalAsset.image_url}
                          alt="Reel Visual"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(verticalAsset)}
                            className="p-2 rounded-full bg-slate-900/80 text-white backdrop-blur-md"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] space-y-1">
                          <p className="font-bold">{verticalAsset.label}</p>
                          <p className="text-slate-300 italic line-clamp-1">"{verticalAsset.image_prompt}"</p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="h-64 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Film className="w-8 h-8 text-slate-300" />
                    <p className="text-xs text-slate-500">Click <strong>Generate Full Campaign</strong> to render your 9:16 FLUX.1 Realism vertical artwork.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: 3-Second Viral Hook & Teleprompter Voiceover */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 3-Second Thumb-Stopping Hook Options */}
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    3-Second Thumb-Stopping Hook Variations
                  </h4>
                  <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full font-bold">
                    High Conversion
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { type: 'Pattern Interrupt', hook: `Stop scrolling if you care about ${activeProject.brand_or_product}. Here is the breakdown.` },
                    { type: 'Direct Secret Reveal', hook: `Nobody is talking about how ${activeProject.brand_or_product} changes the entire game.` },
                    { type: 'Curiosity Question', hook: `Why is everyone switching to ${activeProject.brand_or_product}? Here is the 10-second truth.` },
                  ].map((h, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{h.type}:</span>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">"{h.hook}"</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(h.hook, `hook-${idx}`)}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0"
                      >
                        {copiedSection === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Storyboard Scenes */}
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  Spoken Reel Script & Visual Directions
                </h4>

                {videoScenes.length > 0 ? (
                  <div className="space-y-3">
                    {videoScenes.slice(0, 3).map((scene: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-800 font-mono">Scene {idx + 1}: {scene.scene_name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-mono">{scene.timestamp_marker}</span>
                        </div>
                        <p className="text-slate-600"><strong>Visual:</strong> {scene.visual_description}</p>
                        <p className="p-2.5 rounded-xl bg-white border border-slate-200 italic text-slate-800">
                          <strong>Voiceover:</strong> "{scene.narration_voiceover}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Generate campaign to see scene-by-scene Reel breakdown.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SUB-STUDIO 2: YOUTUBE VIDEO STUDIO */}
      {activeToolTab === 'youtube' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: 16:9 Thumbnail & Concept Artwork */}
            <div className="lg:col-span-6 space-y-4">
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-red-600" />
                    16:9 High-CTR YouTube Thumbnail & Concept Art
                  </h4>
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-mono font-bold">
                    16:9 (1280x720)
                  </span>
                </div>

                {imageAssets.find((a: any) => a.aspect_ratio === '16:9') ? (
                  (() => {
                    const heroAsset = imageAssets.find((a: any) => a.aspect_ratio === '16:9');
                    return (
                      <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center shadow-lg group">
                        <img
                          src={heroAsset.image_url}
                          alt="YouTube Hero"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(heroAsset)}
                            className="p-2 rounded-full bg-slate-900/80 text-white backdrop-blur-md"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Tv className="w-8 h-8 text-slate-300" />
                    <p className="text-xs text-slate-500">Generate campaign to render 16:9 cinematic YouTube visual concepts.</p>
                  </div>
                )}
              </div>

              {/* YouTube Video Description & Chapters */}
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    YouTube Description Box & Chapters SEO
                  </h4>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`CHAPTERS:\n00:00 - Introduction to ${activeProject.name}\n01:15 - Core Solution & Architecture\n03:30 - Live Demo\n05:45 - Conclusion & Next Steps\n\nLINKS:\nLearn more at https://roopantar-ai.vercel.app`, 'yt-desc')}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    {copiedSection === 'yt-desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Description</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
                  <p className="font-bold text-slate-900">TIMESTAMPS:</p>
                  <p>00:00 - Introduction to {activeProject.name}</p>
                  <p>01:15 - Core Architecture & Breakthroughs</p>
                  <p>03:30 - Live Demonstration</p>
                  <p>05:45 - Key Takeaways & Call to Action</p>
                </div>
              </div>
            </div>

            {/* Right: Full Teleprompter Script */}
            <div className="lg:col-span-6 space-y-4">
              <div className="roopantar-card-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-600" />
                    Full Video Teleprompter Script
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">5 Scenes Total</span>
                </div>

                {videoScenes.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {videoScenes.map((scene: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-bold text-purple-800 font-mono">Scene {scene.scene_number || idx + 1}: {scene.scene_name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-mono">{scene.timestamp_marker}</span>
                        </div>
                        <p className="text-slate-600"><strong>Visual Shot:</strong> {scene.visual_description}</p>
                        <div className="p-3 rounded-xl bg-white border border-slate-200 italic text-slate-800 leading-relaxed">
                          "{scene.narration_voiceover}"
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Generate campaign to view the YouTube teleprompter script.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-STUDIO 3: GRAPHICS & AI IMAGE LAB */}
      {activeToolTab === 'graphics' && (
        <div className="space-y-6">
          
          {/* Aspect Ratio Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-mono uppercase">Aspect Ratio:</span>
              {['all', '9:16', '16:9', '1.91:1', '1:1'].map((ar) => (
                <button
                  key={ar}
                  onClick={() => setAspectFilter(ar)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    aspectFilter === ar 
                      ? 'roopantar-btn-primary shadow-2xs' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ar === 'all' ? 'All Formats' : ar}
                </button>
              ))}
            </div>

            <a
              href={currentJob ? getExportDownloadUrl(currentJob.id, 'image_assets', 'zip') : '#'}
              className={`px-4 py-2 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-1.5 shadow-sm ${!currentJob ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Download className="w-3.5 h-3.5" />
              Download All PNGs (.ZIP)
            </a>
          </div>

          {/* Graphics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset: any, idx: number) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="relative w-full aspect-square bg-slate-950 overflow-hidden flex items-center justify-center">
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
                      HD PNG
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUB-STUDIO 4: VIRAL SOCIAL COPY */}
      {activeToolTab === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LinkedIn Post Studio */}
          <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">LinkedIn Thought-Leadership Post</h4>
              </div>
              {linkedinOutput && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(linkedinOutput.content_json?.full_formatted_post || JSON.stringify(linkedinOutput.content_json), 'li-post')}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  {copiedSection === 'li-post' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'li-post' ? 'Copied' : 'Copy Post'}</span>
                </button>
              )}
            </div>

            {linkedinOutput ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed space-y-3">
                {linkedinOutput.content_json?.headline_hook && (
                  <p className="font-bold text-slate-900 text-sm">{linkedinOutput.content_json.headline_hook}</p>
                )}
                <p>{linkedinOutput.content_json?.body_paragraphs?.join('\n\n')}</p>
                {linkedinOutput.content_json?.hashtags && (
                  <p className="text-blue-600 font-medium">{linkedinOutput.content_json.hashtags.join(' ')}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Generate campaign to create your LinkedIn post.</p>
            )}
          </div>

          {/* Twitter / X Thread Studio */}
          <div className="roopantar-card-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-slate-900" />
                <h4 className="font-extrabold text-slate-900 text-sm">Twitter / X Viral Thread Package</h4>
              </div>
              {twitterOutput && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(twitterOutput.content_json?.tweets?.map((t: any) => t.content).join('\n\n---\n\n') || '', 'tw-thread')}
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  {copiedSection === 'tw-thread' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'tw-thread' ? 'Copied' : 'Copy Thread'}</span>
                </button>
              )}
            </div>

            {twitterOutput ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {twitterOutput.content_json?.tweets?.map((t: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                    <span className="text-[10px] font-mono font-bold text-purple-600 block mb-1">Tweet {t.tweet_number || idx + 1}</span>
                    {t.content}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Generate campaign to create your viral thread.</p>
            )}
          </div>

        </div>
      )}

      {/* SUB-STUDIO 5: CAMPAIGN DASHBOARD & EXPORT HUB */}
      {activeToolTab === 'dashboard' && (
        <div className="roopantar-card-white rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Campaign Distribution & Asset Export Hub</h3>
              <p className="text-xs text-slate-500 mt-1">Review your campaign assets and download complete distribution packages.</p>
            </div>
            {currentJob && (
              <a
                href={getExportDownloadUrl(currentJob.id, 'image_assets', 'zip')}
                className="px-6 py-3 rounded-full roopantar-btn-primary text-xs font-bold flex items-center gap-2 shadow-md shadow-pink-500/20"
              >
                <Download className="w-4 h-4" />
                Download Complete Campaign Pack (.ZIP)
              </a>
            )}
          </div>

          {/* Launch Checklist */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Multi-Channel Distribution Checklist</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Instagram Reel & Feed', status: imageAssets.length > 0 ? 'Visuals Ready' : 'Pending', icon: Instagram },
                { title: 'TikTok & Shorts', status: videoScenes.length > 0 ? 'Script Ready' : 'Pending', icon: Film },
                { title: 'LinkedIn Thought-Leadership', status: linkedinOutput ? 'Copy Ready' : 'Pending', icon: Linkedin },
                { title: 'X Viral Thread', status: twitterOutput ? 'Thread Ready' : 'Pending', icon: Twitter },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-purple-600" />
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.status.includes('Ready') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900">{item.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-purple-600" />
                Create New Campaign Project
              </h4>
              <button onClick={() => setShowNewProjectModal(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Name:</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Q4 Flagship Product Launch"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand or Product Name:</label>
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="e.g. Roopantar Cloud"
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Goal:</label>
                <select
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                >
                  <option value="Product Launch & Viral Growth">🚀 Product Launch & Viral Growth</option>
                  <option value="Brand Awareness & Community Engagement">🌟 Brand Awareness & Engagement</option>
                  <option value="Direct Conversion & Limited Offer">💰 Direct Conversion & Sales</option>
                  <option value="Thought-Leadership & Authority">🏆 Thought-Leadership & Authority</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Brief & Source Notes:</label>
                <textarea
                  rows={4}
                  value={newBrief}
                  onChange={(e) => setNewBrief(e.target.value)}
                  placeholder="Paste your product release notes, launch details, marketing angles, or promotional offer..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowNewProjectModal(false)} className="px-4 py-2 rounded-full bg-slate-100 text-xs font-medium">Cancel</button>
              <button
                disabled={!newProjectName.trim() || !newBrief.trim()}
                onClick={handleCreateProject}
                className="px-6 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </div>
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
