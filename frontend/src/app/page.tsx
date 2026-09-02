'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  AlertCircle,
  TrendingUp,
  Flame,
  FileCheck
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FileUploadZone } from '@/components/FileUploadZone';
import { FormatSelector } from '@/components/FormatSelector';
import { ParameterControls } from '@/components/ParameterControls';
import { GenerationProgress } from '@/components/GenerationProgress';
import { OutputPreviewModal } from '@/components/OutputPreviewModal';
import { JobHistory } from '@/components/JobHistory';

import { 
  FormatItem, 
  GenerationParams, 
  Job, 
  HealthStatus 
} from '@/types';
import { 
  checkHealth, 
  getFormats, 
  createJob, 
  getJob, 
  regenerateFormat 
} from '@/lib/api';

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [formats, setFormats] = useState<FormatItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  
  // Ingestion State
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [activeInputTab, setActiveInputTab] = useState<'file' | 'text'>('text');

  // Selected Formats & Parameters
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'advisory',
    'executive_summary',
    'linkedin',
    'twitter',
    'presentation',
    'video_package',
    'infographic'
  ]);
  const [parameters, setParameters] = useState<GenerationParams>({
    tone: 'Formal',
    audience: 'Leadership & Stakeholders',
    language: 'English',
    detail_level: 'Standard',
    objective: 'Inform leadership and mandate mitigation compliance',
  });

  // Job Execution State
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const studioRef = useRef<HTMLDivElement>(null);

  const scrollToStudio = () => {
    setActiveTab('generator');
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroSelectPreset = (presetText: string) => {
    setFile(null);
    setRawText(presetText);
    setActiveInputTab('text');
    scrollToStudio();
  };

  // Initial Load
  useEffect(() => {
    const initApp = async () => {
      try {
        const [healthData, formatsData] = await Promise.all([
          checkHealth(),
          getFormats()
        ]);
        setHealth(healthData);
        setFormats(formatsData);
      } catch (err) {
        console.error('Initial health/format check failed', err);
      }
    };
    initApp();
  }, []);

  // Handle Job Generation
  const handleGenerate = async () => {
    if (!file && !rawText.trim()) {
      setErrorMessage('Please upload a source file or enter source text/prompt.');
      return;
    }
    if (selectedFormats.length === 0) {
      setErrorMessage('Please select at least one output deliverable format.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const newJob = await createJob(
        file,
        rawText,
        selectedFormats,
        parameters
      );
      setActiveJob(newJob);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(
        err.response?.data?.detail || err.message || 'An error occurred during content transformation.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Regenerating a Single Format
  const handleRegenerateFormat = async (formatType: string) => {
    if (!activeJob) return;
    setIsRegenerating(true);
    try {
      const updatedOutput = await regenerateFormat(
        activeJob.id,
        formatType,
        parameters
      );
      
      setActiveJob((prev) => {
        if (!prev) return prev;
        const newOutputs = prev.outputs.map((o) =>
          o.format_type === formatType ? updatedOutput : o
        );
        return { ...prev, outputs: newOutputs };
      });
    } catch (err: any) {
      console.error('Regeneration failed:', err);
      alert('Failed to regenerate format: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSelectPastJob = async (jobId: string) => {
    try {
      const loadedJob = await getJob(jobId);
      setActiveJob(loadedJob);
      setActiveTab('generator');
    } catch (err) {
      console.error('Failed to load past job:', err);
    }
  };

  const resetForm = () => {
    setFile(null);
    setRawText('');
    setActiveJob(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen roopantar-canvas flex flex-col font-sans relative text-slate-100">
      
      {/* Top Navbar */}
      <Navbar 
        health={health} 
        onNewJobClick={resetForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 relative z-10">
        
        {/* Modular Attractive Hero Section */}
        <HeroSection 
          onGetStarted={scrollToStudio}
          onSelectPreset={handleHeroSelectPreset}
        />

        {/* Studio View */}
        {activeTab === 'generator' ? (
          <div ref={studioRef} className="space-y-8 pt-4">
            
            {/* Step 1: Ingestion */}
            <FileUploadZone
              file={file}
              setFile={setFile}
              rawText={rawText}
              setRawText={setRawText}
              activeInputTab={activeInputTab}
              setActiveInputTab={setActiveInputTab}
            />

            {/* Step 2: Deliverables Selector */}
            <FormatSelector
              formats={formats}
              selectedFormats={selectedFormats}
              setSelectedFormats={setSelectedFormats}
            />

            {/* Step 3: Parameter Controls */}
            <ParameterControls
              parameters={parameters}
              setParameters={setParameters}
            />

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                <span>Deterministic Schema Validation • Air-Gapped & Enterprise Cloud Agnostic</span>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full sm:w-auto px-10 py-4 roopantar-btn-primary font-bold text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Transformation Engine...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-current group-hover:scale-110 transition-transform" />
                    <span>Generate {selectedFormats.length} Deliverables</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Tracker & Results */}
            {(isGenerating || activeJob) && (
              <div className="space-y-8 pt-6">
                <GenerationProgress
                  job={
                    activeJob || {
                      id: 'executing...',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      status: 'generating',
                      source_raw_text: rawText,
                      selected_formats: selectedFormats,
                      parameters: parameters,
                      outputs: [],
                    }
                  }
                  isGenerating={isGenerating}
                  selectedCount={selectedFormats.length}
                />

                {activeJob && activeJob.outputs && activeJob.outputs.length > 0 && !isGenerating && (
                  <OutputPreviewModal
                    job={activeJob}
                    onRegenerateFormat={handleRegenerateFormat}
                    isRegenerating={isRegenerating}
                  />
                )}
              </div>
            )}

          </div>
        ) : (
          /* Audit History View */
          <JobHistory onSelectJob={handleSelectPastJob} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#07090F]/90 py-8 mt-16 text-xs text-slate-500 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <span className="font-bold text-white">Roopantar-AI</span>
            <span>—</span>
            <span className="text-slate-400 font-normal">Enterprise AI Content Transformation Platform</span>
          </div>
          <div className="text-slate-400">
            <span>Single-Source-to-Multi-Deliverable Architecture</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
