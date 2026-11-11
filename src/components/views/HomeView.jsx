import React from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ROLES } from '../../data/rolesAndQuestions';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  BrainCircuit, 
  Zap, 
  Rocket, 
  FileText,
  Activity,
  Play
} from 'lucide-react';

export const HomeView = () => {
  const { setCurrentView, startInterview, changeSelectedRole, selectedRole } = useApp();

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Algorithmic Behavioral & Technical Calibration</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-[11px] text-slate-400">v2.5.0 Production Ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Interviews That <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-teal-300">Adapt to Every Candidate</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Real-time AI behavioral and technical interviews that dynamically branch questions based on candidate depth, eliminating canned scripts, hiring bias, and hallucinated scores.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => startInterview("FORMAL")}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 transition-all group"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>Start Live Adaptive Interview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView("RECRUITER")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
              >
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Explore Recruiter Portal</span>
              </button>
            </div>

            {/* Spec Proof Chips */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Hallucination Rubric</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Powered by Gemini 2.0 Flash</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Live Anti-Cheat & Audio Transcription</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Selector Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Select Target Technical Domain</h2>
              <p className="text-sm text-slate-400">Pre-configured with industry rubrics across 8 core engineering & product specializations</p>
            </div>
            <button
              onClick={() => setCurrentView("RESUME")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 self-start"
            >
              Upload Custom Resume & JD <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVAILABLE_ROLES.map((role) => {
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => changeSelectedRole(role)}
                  className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">{role.department}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{role.title}</h3>
                  <div className="mt-3 flex items-center gap-1 text-[11px] text-indigo-300 font-medium">
                    <span>{role.keyCompetencies.length} Competencies</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture Showcase / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Adaptive Intelligence Outperforms Static Questionnaires
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Every candidate receives a personalized technical calibration loop that eliminates script memorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Difficulty Scaling</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              If a candidate easily explains baseline mechanics, the AI immediately scales difficulty up to Expert tier (probing race conditions, memory pressure, and distributed failures).
            </p>
            <div className="pt-2 text-xs font-mono text-purple-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Foundational → Intermediate → Expert
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Zero-Hallucination Rubrics</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every score requires an extracted verbatim quotation from candidate speech or text. Unsubstantiated claims remain classified as Claimed-Unvalidated, protecting hiring managers.
            </p>
            <div className="pt-2 text-xs font-mono text-teal-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Evidence Quotes & Missing Points
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Recruiter Intelligence Portal</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recruiters inspect multi-candidate comparison matrixes, side-by-side competency radar charts, anti-bias integrity timelines, and private interviewer notes without automated rejections.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Multi-Candidate Pipeline & Comparisons
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/80 border border-indigo-500/20 p-8 md:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Ready to Experience</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Launch the Live AI Adaptive Interview Studio
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                Test your skills in <strong>Practice Mode</strong> with per-question instant AI breakdowns, or take a <strong>Formal Interview</strong> with full integrity monitoring and an executive hiring report.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => startInterview("PRACTICE")}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                >
                  Start Practice Mode (Instant Feedback)
                </button>
                <button
                  onClick={() => startInterview("FORMAL")}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Start Formal Interview (Full Assessment)
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Target Role</span>
                <span className="font-mono text-indigo-300">{selectedRole.title}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Assessment Length</span>
                <span className="font-mono text-white">5 Questions (15 mins)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Audio Support</span>
                <span className="font-mono text-emerald-400">Web Speech Dictation</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Proctoring</span>
                <span className="font-mono text-purple-300">Anti-Cheat Timeline</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
