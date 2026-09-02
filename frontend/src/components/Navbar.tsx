import React, { useState } from 'react';
import { Layers, Zap, Cpu, Sparkles, Link, Check, RefreshCw, X, AlertCircle } from 'lucide-react';
import { HealthStatus } from '../types';
import { getBaseUrl, setCustomBackendUrl, checkHealth } from '../lib/api';

interface NavbarProps {
  health: HealthStatus | null;
  onNewJobClick: () => void;
  activeTab: 'generator' | 'history';
  setActiveTab: (tab: 'generator' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, onNewJobClick, activeTab, setActiveTab }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleOpenSettings = () => {
    setInputUrl(getBaseUrl().replace('/api', ''));
    setTestStatus('idle');
    setStatusMsg('');
    setShowSettings(true);
  };

  const handleSaveAndTest = async () => {
    setTestStatus('testing');
    setStatusMsg('Testing connection to backend...');
    try {
      setCustomBackendUrl(inputUrl);
      const h = await checkHealth();
      if (h.status !== 'offline') {
        setTestStatus('success');
        setStatusMsg('Successfully connected to backend!');
        setTimeout(() => {
          setShowSettings(false);
          window.location.reload();
        }, 1200);
      } else {
        setTestStatus('failed');
        setStatusMsg('Could not reach backend at this URL. Make sure it is live and allows CORS.');
      }
    } catch (e: any) {
      setTestStatus('failed');
      setStatusMsg('Connection error: ' + (e.message || 'Network error'));
    }
  };

  const isLiveOnline = health && health.status !== 'offline';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onNewJobClick}>
            <div className="relative flex items-center justify-center h-11 w-12 group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Roopantar-AI Logo"
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  Roopantar<span className="brand-gradient-text">.AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Single-Source GenAI Content Transformation Engine
              </p>
            </div>
          </div>

          {/* Minimalist Pill Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-2xs">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'generator'
                  ? 'roopantar-btn-primary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Studio Workspace
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'roopantar-btn-primary shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Audit History
            </button>
          </div>

          {/* Status Indicators & Settings Trigger */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenSettings}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 transition-all cursor-pointer shadow-2xs group"
              title="Click to configure backend URL"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600 group-hover:rotate-45 transition-transform" />
              <span>
                {isLiveOnline ? (
                  health?.api_keys_present?.groq ? (
                    <strong className="text-slate-800">Groq Engine (Connected)</strong>
                  ) : (
                    <strong className="text-slate-800">Backend Online</strong>
                  )
                ) : (
                  <span className="text-pink-600 font-bold">Connect Backend ⚙️</span>
                )}
              </span>
            </button>

            <div
              onClick={handleOpenSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                isLiveOnline
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border border-rose-200 text-rose-700 animate-pulse'
              }`}
              title="Click to check or link backend"
            >
              <span className={`w-2 h-2 rounded-full ${isLiveOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span>{isLiveOnline ? 'Online' : 'Set Endpoint'}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Backend URL Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[11px] font-mono font-bold">
                <Link className="w-3.5 h-3.5" />
                API CONNECTION MANAGER
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Connect Backend Service
              </h3>
              <p className="text-xs text-slate-500">
                Enter your live deployed backend URL (Render, Railway, or local server) to connect your frontend.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">
                Backend Server URL:
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="e.g. https://roopantar-backend.onrender.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 focus:outline-none shadow-inner"
              />
              <p className="text-[11px] text-slate-400 font-mono">
                Active Endpoint: <strong className="text-slate-700">{getBaseUrl()}</strong>
              </p>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                  testStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : testStatus === 'failed'
                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                    : 'bg-purple-50 text-purple-800 border border-purple-200'
                }`}
              >
                {testStatus === 'testing' ? (
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                ) : testStatus === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{statusMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setCustomBackendUrl('');
                  setInputUrl('http://localhost:8000');
                }}
                className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all"
              >
                Reset to Default
              </button>
              <button
                type="button"
                disabled={testStatus === 'testing'}
                onClick={handleSaveAndTest}
                className="px-6 py-2.5 rounded-full roopantar-btn-primary text-xs font-bold shadow-sm flex items-center gap-2"
              >
                {testStatus === 'testing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Save & Test Connection</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
