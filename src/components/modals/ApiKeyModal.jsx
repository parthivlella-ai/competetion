import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/geminiService';
import { Key, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, X } from 'lucide-react';

export const ApiKeyModal = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen } = useApp();
  const [keyInput, setKeyInput] = useState(() => GeminiService.getStoredApiKey());
  const [testingStatus, setTestingStatus] = useState(null); // 'testing', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState("");

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    GeminiService.setApiKey(keyInput);
    setStatusMessage("API Key saved successfully!");
    setTestingStatus("success");
    setTimeout(() => {
      setIsApiKeyModalOpen(false);
      setTestingStatus(null);
    }, 900);
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestingStatus("error");
      setStatusMessage("Please enter a valid Gemini API key first.");
      return;
    }

    setTestingStatus("testing");
    setStatusMessage("Validating key with Google Gemini 2.0 Flash API...");

    try {
      // Test generation call
      await GeminiService.callGeminiApi("gemini-2.0-flash", "Respond with JSON: {\"status\": \"ok\"}", keyInput.trim());
      setTestingStatus("success");
      setStatusMessage("Connection successful! Gemini 2.0 Flash is verified and active.");
      GeminiService.setApiKey(keyInput);
    } catch (err) {
      setTestingStatus("error");
      setStatusMessage(`Verification failed: ${err.message}`);
    }
  };

  const handleClear = () => {
    setKeyInput("");
    GeminiService.setApiKey("");
    setTestingStatus("success");
    setStatusMessage("Key removed. Switched to offline deterministic fallback engine.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-2xl p-6 md:p-8 bg-slate-900/95 border border-slate-700/60 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsApiKeyModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Configure Gemini AI Engine</h2>
            <p className="text-sm text-slate-400">Google Gemini 2.0 Flash Live Adaptive Intelligence</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-6 text-sm text-slate-300 space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your API key is stored <strong>locally in your browser</strong> (<code className="text-xs bg-slate-950 px-1 py-0.5 rounded text-indigo-300">localStorage</code>) and is never transmitted to any third-party server.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              <strong>Zero-Key Fallback:</strong> If no key is configured, RankUP automatically runs in deterministic rule-based evaluation mode with full functionality.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Gemini API Key</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-normal capitalize"
            >
              Get Free Key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm shadow-inner"
            />
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 rounded-xl mb-6 text-sm flex items-start gap-2.5 ${
            testingStatus === "success" 
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : testingStatus === "error"
              ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
              : "bg-indigo-500/10 border border-indigo-500/30 text-indigo-300"
          }`}>
            {testingStatus === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
            {testingStatus === "error" && <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            {testingStatus === "testing" && <Sparkles className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 text-sm font-medium transition-colors"
          >
            Clear Key (Use Fallback Engine)
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={testingStatus === "testing"}
              onClick={handleTestKey}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              Save & Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

