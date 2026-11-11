import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, ExternalLink, ShieldCheck, Heart, Zap, Code2 } from 'lucide-react';

export const Footer = () => {
  const { setCurrentView, setIsDeploymentGuideOpen, setIsApiKeyModalOpen } = useApp();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-20 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">RankUP AI Intelligence</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Adaptive career intelligence and technical interview platform powered by Google Gemini 2.0 Flash. Real-time dynamic question branching, zero-hallucination evidence rubrics, speech-to-text, and recruiter analytics.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> SOC2 & EEOC Compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-400 font-mono text-[11px]">
                <Zap className="w-3.5 h-3.5" /> Zero Hallucination Engine
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-300">Platform</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setCurrentView("HOME")} className="hover:text-indigo-400 transition-colors">Platform Overview</button>
              </li>
              <li>
                <button onClick={() => setCurrentView("DASHBOARD")} className="hover:text-indigo-400 transition-colors">Candidate Command Center</button>
              </li>
              <li>
                <button onClick={() => setCurrentView("RESUME")} className="hover:text-indigo-400 transition-colors">Resume & Competency Intake</button>
              </li>
              <li>
                <button onClick={() => setCurrentView("STUDIO")} className="hover:text-indigo-400 transition-colors">Live Adaptive Interview Studio</button>
              </li>
              <li>
                <button onClick={() => setCurrentView("RECRUITER")} className="hover:text-indigo-400 transition-colors">Recruiter Candidate Pipeline</button>
              </li>
            </ul>
          </div>

          {/* Deployment & Resources */}
          <div className="space-y-2.5">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-slate-300">Deployment & Cloud</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setIsDeploymentGuideOpen(true)} className="hover:text-indigo-400 text-left transition-colors flex items-center gap-1">
                  <span>Deploy to Vercel (Recommended)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsDeploymentGuideOpen(true)} className="hover:text-indigo-400 text-left transition-colors flex items-center gap-1">
                  <span>Deploy to Netlify</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsDeploymentGuideOpen(true)} className="hover:text-indigo-400 text-left transition-colors flex items-center gap-1">
                  <span>Deploy to Cloudflare Pages</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsApiKeyModalOpen(true)} className="hover:text-indigo-400 text-left transition-colors flex items-center gap-1">
                  <span>Configure Gemini API Key</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Repositories */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} RankUP AI Intelligence Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ankemcharan5/stitch-adaptive-interview-intelligence-ui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Web Repository</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="https://github.com/parthivlella-ai/Ai-interview-intelligence-app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Android Core Repository</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
