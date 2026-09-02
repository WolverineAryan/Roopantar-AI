import axios from 'axios';
import { FormatItem, Job, JobSummary, HealthStatus, GeneratedOutput, GenerationParams } from '../types';

const API_BASE = 
  (typeof window !== 'undefined' && (window as any).__ENV?.NEXT_PUBLIC_API_BASE_URL) ||
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minutes max timeout
});

export const checkHealth = async (): Promise<HealthStatus> => {
  const resp = await api.get<HealthStatus>('/health');
  return resp.data;
};

export const getFormats = async (): Promise<FormatItem[]> => {
  const resp = await api.get<FormatItem[]>('/formats');
  return resp.data;
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
  let url = `${API_BASE}/jobs/${jobId}/export/${formatType}`;
  if (fileExt) {
    url += `?file_ext=${fileExt}`;
  }
  return url;
};

export const getJobsList = async (): Promise<JobSummary[]> => {
  const resp = await api.get<JobSummary[]>('/jobs');
  return resp.data;
};
