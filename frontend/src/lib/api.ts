import axios from 'axios';
import { FormatItem, Job, JobSummary, HealthStatus, GeneratedOutput, GenerationParams } from '../types';

export const getBaseUrl = (): string => {
  let raw = 
    (typeof window !== 'undefined' && (window as any).__ENV?.NEXT_PUBLIC_API_BASE_URL) ||
    process.env.NEXT_PUBLIC_API_BASE_URL || 
    process.env.NEXT_PUBLIC_API_URL || 
    'http://localhost:8000/api';

  raw = raw.trim();
  if (raw.endsWith('/')) {
    raw = raw.slice(0, -1);
  }
  
  if (raw.endsWith('/api/v1')) {
    raw = raw.replace('/api/v1', '/api');
  } else if (!raw.endsWith('/api')) {
    raw = `${raw}/api`;
  }
  return raw;
};

const API_BASE = getBaseUrl();

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minutes max timeout
});

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const resp = await api.get<HealthStatus>('/health');
    return resp.data;
  } catch (e) {
    console.warn('Backend health check returned fallback status:', e);
    return {
      status: 'offline',
      database: 'disconnected',
      llm_provider: 'groq',
      api_keys_present: { groq: false, openai: false, gemini: false, grok: false },
      active_models: { fast: 'llama-3.1-8b-instant', strong: 'llama-3.1-8b-instant', whisper: 'whisper-large-v3' }
    };
  }
};

export const getFormats = async (): Promise<FormatItem[]> => {
  try {
    const resp = await api.get<FormatItem[]>('/formats');
    return resp.data;
  } catch (e) {
    console.warn('Backend formats unavailable, using default schema matrix:', e);
    return [
      { id: 'advisory', name: 'Technical / Threat Advisory', description: 'Structured operational advisory document with severity level and mitigations table.', category: 'Security & Governance', export_formats: ['docx', 'pdf', 'json'], icon: 'ShieldAlert' },
      { id: 'executive_summary', name: 'Executive Summary', description: 'Strategic leadership briefing with Bottom Line Up Front (BLUF) and required decisions.', category: 'Leadership & Strategy', export_formats: ['docx', 'pdf', 'json'], icon: 'FileText' },
      { id: 'linkedin', name: 'LinkedIn Thought-Leadership Post', description: 'Publication-ready LinkedIn post with hook and hashtags.', category: 'Social & PR', export_formats: ['txt', 'json'], icon: 'Share2' },
      { id: 'twitter', name: 'Twitter / X Thread', description: 'Numbered viral thread formatted for social distribution.', category: 'Social & PR', export_formats: ['txt', 'json'], icon: 'Twitter' },
      { id: 'presentation', name: 'Presentation Slide Deck', description: 'Executive 16:9 widescreen PowerPoint deck with speaker notes.', category: 'Presentations & Media', export_formats: ['pptx', 'json'], icon: 'Presentation' },
      { id: 'video_package', name: 'Video Script & Storyboard', description: 'Scene-by-scene script with visual directions and voiceover narration.', category: 'Presentations & Media', export_formats: ['docx', 'pdf', 'json'], icon: 'Video' },
      { id: 'infographic', name: 'Infographic Architecture Spec', description: 'Visual blueprint specifying stat callouts and designer tips.', category: 'Visual & Design', export_formats: ['pdf', 'json'], icon: 'BarChart2' },
    ];
  }
};

export const createJob = async (
  file: File | null,
  rawText: string,
  selectedFormats: string[],
  parameters: GenerationParams
): Promise<Job> => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  if (rawText) {
    formData.append('raw_text', rawText);
  }
  formData.append('selected_formats', JSON.stringify(selectedFormats));
  formData.append('parameters', JSON.stringify(parameters));

  const resp = await api.post<Job>('/jobs', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return resp.data;
};

export const getJob = async (jobId: string): Promise<Job> => {
  const resp = await api.get<Job>(`/jobs/${jobId}`);
  return resp.data;
};

export const regenerateFormat = async (
  jobId: string,
  formatType: string,
  parameters?: GenerationParams,
  customInstructions?: string
): Promise<GeneratedOutput> => {
  const resp = await api.post<GeneratedOutput>(`/jobs/${jobId}/formats/${formatType}`, {
    parameters,
    custom_instructions: customInstructions,
  });
  return resp.data;
};

export const getExportDownloadUrl = (jobId: string, formatType: string, fileExt?: string): string => {
  let url = `${getBaseUrl()}/jobs/${jobId}/export/${formatType}`;
  if (fileExt) {
    url += `?file_ext=${fileExt}`;
  }
  return url;
};

export const getJobsList = async (): Promise<JobSummary[]> => {
  try {
    const resp = await api.get<JobSummary[]>('/jobs');
    return resp.data;
  } catch (e) {
    return [];
  }
};
