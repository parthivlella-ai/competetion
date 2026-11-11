import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ROLES } from '../../data/rolesAndQuestions';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  SlidersHorizontal,
  Layers,
  Sparkles,
  Award,
  Shield,
  X
} from 'lucide-react';

export const RecruiterPipelineView = () => {
  const { 
    candidatesPipeline, 
    setCandidatesPipeline, 
    setActiveSessionReport, 
    setCurrentView 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minScore, setMinScore] = useState(0);

  // Multi-candidate comparison state
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Filter candidates
  const filteredCandidates = candidatesPipeline.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.roleApplied.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || c.roleApplied === roleFilter;
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesScore = c.compositeScore >= minScore;
    return matchesSearch && matchesRole && matchesStatus && matchesScore;
  });

  const toggleSelectForComparison = (candidateId) => {
    if (selectedForComparison.includes(candidateId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== candidateId));
    } else {
      if (selectedForComparison.length >= 3) {
        alert("You can compare up to 3 candidates simultaneously.");
        return;
      }
      setSelectedForComparison(prev => [...prev, candidateId]);
    }
  };

  const handleInspectCandidate = (candidate) => {
    setActiveSessionReport({
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      roleTitle: candidate.roleApplied,
      interviewDate: candidate.interviewDate,
      compositeScore: candidate.compositeScore,
      skillsDemonstrated: candidate.skillsDemonstrated,
      skillsTotal: candidate.skillsTotal,
      recommendation: candidate.recommendation,
      recruiterNotes: candidate.recruiterNotes,
      evaluations: candidate.evaluations || [],
      competencies: candidate.competencies || [],
      integrityEvents: candidate.integrityFlagsCount > 0 ? [
        { title: "Window Blur Event", severity: "MEDIUM", description: "Audit trail record during live session." }
      ] : []
    });
    setCurrentView("REPORT");
  };

  const comparedCandidates = candidatesPipeline.filter(c => selectedForComparison.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Recruiter Command Center</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Candidate Pipeline & Intelligence
          </h1>
          <p className="text-sm text-slate-400">
            Compare candidate rubrics, inspect verbatim evidence quotes, and audit anti-cheat logs.
          </p>
        </div>

        {selectedForComparison.length >= 2 && (
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 self-start"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Selected ({selectedForComparison.length})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, email, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Roles</option>
            {AVAILABLE_ROLES.map(r => (
              <option key={r.id} value={r.title}>{r.title}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Under Review">Under Review</option>
            <option value="Offered">Offered</option>
            <option value="Pass">Pass</option>
          </select>
        </div>

        {/* Min Score Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Min Score:</span>
          <span className="text-xs font-mono font-bold text-purple-400">{minScore}%</span>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-24 accent-purple-500"
          />
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-10">Compare</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Target Role</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Demonstrated</th>
                <th className="py-3.5 px-4">Integrity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCandidates.map((c) => {
                const isSelected = selectedForComparison.includes(c.id);

                return (
                  <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectForComparison(c.id)}
                        className="rounded accent-purple-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {c.roleApplied}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-mono font-extrabold text-sm ${
                        c.compositeScore >= 80 ? "text-emerald-400" : (c.compositeScore >= 65 ? "text-amber-400" : "text-rose-400")
                      }`}>
                        {c.compositeScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {c.skillsDemonstrated} / {c.skillsTotal} verified
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        c.integrityStatus === "Clean"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {c.integrityStatus === "Clean" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{c.integrityStatus}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        c.status === "Shortlisted" || c.status === "Offered"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : c.status === "Under Review"
                          ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleInspectCandidate(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Candidate Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl glass-panel-elevated rounded-2xl p-6 md:p-8 bg-slate-900 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Side-by-Side Candidate Comparison</h3>
                <p className="text-xs text-slate-400">Direct rubric comparison of {comparedCandidates.length} evaluated applicants</p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparedCandidates.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white">{c.name}</h4>
                    <span className="text-xs text-slate-400">{c.roleApplied}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Composite Score</span>
                    <span className="text-xl font-mono font-extrabold text-emerald-400">{c.compositeScore}%</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Recommendation:</span>
                      <strong className="text-white">{c.recommendation}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Integrity Audit:</span>
                      <strong className={c.integrityStatus === "Clean" ? "text-emerald-400" : "text-amber-400"}>
                        {c.integrityStatus}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Verified Skills:</span>
                      <strong className="text-white">{c.skillsDemonstrated} of {c.skillsTotal}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Recruiter Evaluation:</span>
                    <p className="text-xs text-slate-300 italic">"{c.recruiterNotes}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

