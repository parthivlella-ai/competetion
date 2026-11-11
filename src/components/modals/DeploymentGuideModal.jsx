import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Rocket, Check, Copy, ExternalLink, Globe, Layers, Shield, Zap, X, Cpu, Server } from 'lucide-react';

export const DeploymentGuideModal = () => {
  const { isDeploymentGuideOpen, setIsDeploymentGuideOpen } = useApp();
  const [activeTab, setActiveTab] = useState("vercel");
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isDeploymentGuideOpen) return null;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const platforms = [
    {
      id: "vercel",
      name: "Vercel",
      badge: "Top Recommended",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      icon: Zap,
      rating: "10/10",
      bestFor: "Fastest deployment for Vite + React, instant Git integration, zero configuration.",
      steps: [
        "Push this repository to GitHub.",
        "Go to vercel.com and click 'Add New Project'.",
        "Import repository `ankemcharan5/stitch-adaptive-interview-intelligence-ui`.",
        "Vercel automatically detects Vite: Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`.",
        "(Optional) Add Environment Variable: `VITE_GEMINI_API_KEY` with your Google Gemini key.",
        "Click 'Deploy'. Your site goes live on a fast global edge CDN in under 45 seconds!"
      ],
      commands: "npm run build"
    },
    {
      id: "netlify",
      name: "Netlify",
      badge: "Great Alternative",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      icon: Globe,
      rating: "9.5/10",
      bestFor: "Effortless Git triggers, preview deploys for PRs, 100GB/mo free bandwidth.",
      steps: [
        "Go to app.netlify.com and click 'Add new site' → 'Import an existing project'.",
        "Select GitHub and authorize the repository.",
        "Set Build Command to `npm run build` and Publish directory to `dist`.",
        "Add a `_redirects` rule (`/* /index.html 200`) for Single-Page App routing (already included in public folder).",
        "Click 'Deploy site'."
      ],
      commands: "npm run build"
    },
    {
      id: "cloudflare",
      name: "Cloudflare Pages",
      badge: "Highest Performance",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      icon: Shield,
      rating: "9.5/10",
      bestFor: "Zero bandwidth fees, 300+ edge data centers worldwide, enterprise-grade DDoS protection.",
      steps: [
        "In the Cloudflare Dashboard, go to 'Workers & Pages' → 'Create application' → 'Pages'.",
        "Connect your GitHub repository.",
        "Select Framework preset: `Vite`.",
        "Build command: `npm run build`, Build output directory: `dist`.",
        "Deploy and bind custom domain with automatic SSL."
      ],
      commands: "npm run build"
    },
    {
      id: "github_pages",
      name: "GitHub Pages",
      badge: "Direct Repo Hosting",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      icon: Layers,
      rating: "8.5/10",
      bestFor: "Zero external accounts needed. Hosts directly from your GitHub repository via GitHub Actions.",
      steps: [
        "In the repository, navigate to Settings → Pages.",
        "Under 'Build and deployment', set Source to 'GitHub Actions'.",
        "Use the Static HTML / Vite workflow.",
        "Every push to `main` will build and publish automatically."
      ],
      commands: "git push origin main"
    }
  ];

  const currentPlatform = platforms.find(p => p.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel-elevated rounded-2xl p-6 md:p-8 bg-slate-900/95 border border-slate-700/80 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsDeploymentGuideOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Platform Deployment Guide</h2>
            <p className="text-sm text-slate-400">Recommended platforms, configurations, and step-by-step setup</p>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {platforms.map(p => {
            const Icon = p.icon;
            const isSelected = activeTab === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="text-[10px] mt-0.5 text-slate-400 font-mono">{p.rating}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Platform Detail Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{currentPlatform.name}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${currentPlatform.badgeColor}`}>
                  {currentPlatform.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentPlatform.bestFor}</p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-indigo-300">
              Score: {currentPlatform.rating}
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-400">Step-by-Step Instructions</h4>
            <div className="space-y-2">
              {currentPlatform.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Build Settings Reference */}
          <div className="pt-2">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">Build Configuration Reference</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Framework Preset</span>
                <span className="font-mono font-semibold text-emerald-400">Vite</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Build Command</span>
                <span className="font-mono font-semibold text-indigo-300">npm run build</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Output Directory</span>
                <span className="font-mono font-semibold text-amber-300">dist</span>
              </div>
            </div>
          </div>

          {/* Env variable tip */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-300 flex items-start gap-2.5">
            <Zap className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
            <p>
              <strong>Pro-tip:</strong> You do not need to configure backend servers or databases. This application is completely self-contained with client-side reactive state and connects directly to Google Gemini 2.0 Flash with zero proxy latency.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setIsDeploymentGuideOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
