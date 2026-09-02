export interface FormatItem {
  id: string;
  name: string;
  description: string;
  category: string;
  export_formats: string[];
  icon: string;
  color: string;
}

export interface GenerationParams {
  tone: string;
  audience: string;
  language: string;
  detail_level: string;
  objective: string;
  style_preference?: string;
}

export interface IntentContext {
  topic: string;
  domain: string;
  summary: string;
  key_entities: string[];
  key_facts: string[];
  tone_signals: string[];
  risk_flags: string[];
  recommended_actions: string[];
}

export interface GeneratedOutput {
  id: string;
  format_type: string;
  status: string;
  content_json: Record<string, any>;
  export_file_path?: string;
  export_file_type?: string;
  error_message?: string;
  generation_time?: number;
}

export interface Job {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  source_filename?: string;
  source_file_type?: string;
  source_raw_text: string;
  selected_formats: string[];
  parameters: GenerationParams;
  error_message?: string;
  duration_seconds?: number;
  intent_context?: IntentContext;
  outputs: GeneratedOutput[];
}

export interface JobSummary {
  id: string;
  created_at: string;
  status: string;
  source_filename?: string;
  source_file_type?: string;
  selected_formats: string[];
  topic?: string;
  duration_seconds?: number;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  configured_provider: string;
  api_keys_present: {
    groq: boolean;
    openai: boolean;
    gemini: boolean;
  };
  mode: string;
}
