import React from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ROLES } from '../../data/rolesAndQuestions';
import { 
  User, 
  Briefcase, 
  FileText, 
  Award, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const CandidateDashboardView = () => {
  const { 
    activeCandidate, 
    selectedRole, 
    changeSelectedRole, 
    extractedCompetencies, 
    startInterview, 
    setCurrentView,
    activeSessionReport,
    candidatesPipeline
  } = useApp();

  const demonstratedCount = extractedCompetencies.filter(c => c.status === "DEMONSTRATED").length;
  const claimedCount = extractedCompetencies.filter(c => c.status === "CLAIMED_UNVALIDATED").length;
  const totalCount = extractedCompetencies.length || 5;
  const readinessPercent = Math.round((demonstratedCount / totalCount) * 100);

  // Past interview sessions for this candidate
  const candidatePastSessions = candidatesPipeline.filter(c => c.email === activeCandidate.email);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Candidate Command Center</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Profile Verified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, {activeCandidate.name}
          </h1>
          <p className="text-sm text-slate-400">Target Role: <strong className="text-slate-200">{selectedRole.title}</strong> ({selectedRole.department})</p>
        </div>

        {/* Start Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => startInterview("PRACTICE")}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Practice Studio</span>
          </button>
          <button
            onClick={() => startInterview("FORMAL")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Formal Assessment</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">Verified Readiness</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white tracking-tight">{readinessPercent}%</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              readinessPercent >= 75 ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
            }`}>
              {readinessPercent >= 75 ? "Interview Ready" : "Calibration Incomplete"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500" 
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">Demonstrated Skills</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{demonstratedCount}</span>
            <span className="text-xs text-slate-400">of {totalCount} total</span>
          </div>
          <p className="text-xs text-slate-400">Backed by extracted verbatim answer evidence</p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">Claimed (Unvalidated)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{claimedCount}</span>
            <span className="text-xs text-slate-400">from resume</span>
          </div>
          <p className="text-xs text-slate-400">Probed next during adaptive interview sessions</p>
        </div>

        {/* Card 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 block">Integrity Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-400 tracking-tight">100%</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3" /> Clean
            </span>
          </div>
          <p className="text-xs text-slate-400">Zero anti-cheat flags or window anomalies</p>
        </div>
      </div>

      {/* Main Grid: Competency Breakdown & Role Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Competencies Table (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Role Competency Matrix</h2>
              <p className="text-xs text-slate-400">Status determined strictly by demonstrated technical answers</p>
            </div>
            <button
              onClick={() => setCurrentView("RESUME")}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 self-start"
            >
              <span>Manage Resume & Criteria</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {extractedCompetencies.map((comp, idx) => {
              const isDemonstrated = comp.status === "DEMONSTRATED";
              const isClaimed = comp.status === "CLAIMED_UNVALIDATED";

              return (
                <div
                  key={comp.id || idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{comp.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        comp.importance === "CRITICAL"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : comp.importance === "HIGH"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {comp.importance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl">{comp.evidenceCriteria}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border flex items-center gap-1.5 ${
                      isDemonstrated
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : isClaimed
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {isDemonstrated && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {isClaimed && <AlertCircle className="w-3 h-3 text-amber-400" />}
                      <span>{comp.status.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Target Role Configuration & Recent Sessions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Role Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Role</span>
              <button 
                onClick={() => setCurrentView("ROLES")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Change Role
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{selectedRole.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedRole.description}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-2 font-medium">Quick switch:</span>
              <div className="space-y-1.5">
                {AVAILABLE_ROLES.slice(0, 4).map(r => (
                  <button
                    key={r.id}
                    onClick={() => changeSelectedRole(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedRole.id === r.id
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Past Sessions Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Interview Sessions</h3>
            {candidatePastSessions.length === 0 ? (
              <p className="text-xs text-slate-400">No previous sessions completed yet. Launch your first adaptive interview session to generate an evaluation report.</p>
            ) : (
              <div className="space-y-2.5">
                {candidatePastSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setCurrentView("REPORT")}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{session.roleApplied}</div>
                      <div className="text-[11px] text-slate-400">{session.interviewDate} • Score: <strong className="text-emerald-400">{session.compositeScore}%</strong></div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
