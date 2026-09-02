import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { FileUploadZone } from './components/FileUploadZone';
import { FormatSelector } from './components/FormatSelector';
import { ParameterControls } from './components/ParameterControls';
import { GenerationProgress } from './components/GenerationProgress';
import { OutputPreviewModal } from './components/OutputPreviewModal';
import { JobHistory } from './components/JobHistory';

import { 
  FormatItem, 
  GenerationParams, 
  Job, 
  HealthStatus 
} from './types';
import { 
  checkHealth, 
  getFormats, 
  createJob, 
  getJob, 
  regenerateFormat 
} from './lib/api';

export function App() {
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
      
      // Update output in local job state
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar 
        health={health} 
        onNewJobClick={resetForm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Once • Generate Multiple • Zero Redundant LLM Calls</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Single-Source Gen AI Content Transformation Platform
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Ingest raw intelligence reports, articles, threat advisories, documents, images, or audio/video.
              Roopantar-AI extracts a unified Intent Context Object (ICO) and fans out to produce 7 publication-ready deliverables in parallel.
            </p>
          </div>
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Studio View */}
        {activeTab === 'generator' ? (
          <div className="space-y-8">
            
            {/* Step 1: Ingestion */}
            <FileUploadZone
              file={file}
              setFile={setFile}
              rawText={rawText}
              setRawText={setRawText}
              activeInputTab={activeInputTab}
              setActiveInputTab={setActiveInputTab}
            />

            {/* Step 2: Output Deliverables Selector */}
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

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Schema-validated with automatic retry • On-prem & Cloud Agnostic</span>
              </div>

              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing & Generating Formats...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                    <span>Generate {selectedFormats.length} Deliverables</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Live Progress & Results */}
            {activeJob && (
              <div className="space-y-8 pt-4">
                <GenerationProgress
                  job={activeJob}
                  isGenerating={isGenerating}
                />

                {activeJob.outputs && activeJob.outputs.length > 0 && (
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
          /* Job History View */
          <JobHistory onSelectJob={handleSelectPastJob} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Roopantar-AI • Smart India Hackathon (SIH26154) • NTRO Automation System</span>
          <span>IEEE 830 Specification Compliant • Single-Source Multi-Output</span>
        </div>
      </footer>

    </div>
  );
}
export default App;
