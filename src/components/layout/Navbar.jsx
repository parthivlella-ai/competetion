import React from 'react';
import { useApp } from '../../context/AppContext';
import { GeminiService } from '../../services/geminiService';
import { 
  Cpu, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Award, 
  Users, 
  Rocket, 
  Key, 
  UserCheck,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    userRole,
    setUserRole,
    activeCandidate,
    setIsApiKeyModalOpen,
    setIsDeploymentGuideOpen,
    sessionStatus
  } = useApp();

  const aiStatus = GeminiService.getStatusDescription();

  const navItems = [
    { id: "HOME", label: "Overview", icon: Cpu },
    { id: "DASHBOARD", label: "Candidate Portal", icon: UserCheck },
    { id: "RESUME", label: "Resume & Skills", icon: FileText },
    { id: "STUDIO", label: "Live Studio", icon: Sparkles, highlight: sessionStatus === "ACTIVE" },
    { id: "REPORT", label: "Evaluation Report", icon: Award },
    { id: "RECRUITER", label: "Recruiter Pipeline", icon: Users },
    { id: "ROLES", label: "Role Library", icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentView("HOME")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">RankUP</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Adaptive Interview Intelligence</p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? "text-white bg-slate-800 border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Engine Status Button */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${aiStatus.badgeClass} hover:opacity-90`}
            title="Configure Gemini API Key"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{aiStatus.label}</span>
            <span className="sm:hidden font-mono text-[11px]">AI</span>
          </button>

          {/* Deployment Guide Trigger */}
          <button
            onClick={() => setIsDeploymentGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm transition-all"
            title="Open Platform Deployment Guide"
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Deploy</span>
          </button>

          {/* Role Switcher (Candidate vs Recruiter) */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setUserRole("CANDIDATE");
                setCurrentView("DASHBOARD");
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                userRole === "CANDIDATE"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => {
                setUserRole("RECRUITER");
                setCurrentView("RECRUITER");
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                userRole === "RECRUITER"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-900 gap-2 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? "bg-slate-800 text-indigo-400 border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
