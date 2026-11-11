import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Printer, 
  Share2, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  User,
  Layers,
  FileText
} from 'lucide-react';

export const AssessmentReportView = () => {
  const { 
    activeSessionReport, 
    candidatesPipeline, 
    setCurrentView,
    startInterview
  } = useApp();

  // If no session just finished, use the first candidate in the pipeline as preview
  const report = activeSessionReport || candidatesPipeline[0];
  const [expandedQuestion, setExpandedQuestion] = useState(0);
  const [recruiterNotes, setRecruiterNotes] = useState(report?.recruiterNotes || "");
  const [hiringDecision, setHiringDecision] = useState(report?.recommendation || "Strong Hire");

  useEffect(() => {
    if (report && report.compositeScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [report]);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Award className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Evaluation Report Found</h2>
        <p className="text-sm text-slate-400">Complete an interview session to generate a comprehensive assessment report.</p>
        <button
          onClick={() => startInterview("FORMAL")}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
        >
          Launch Interview
        </button>
      </div>
    );
  }

  const score = report.compositeScore || 85;
  const evaluations = report.evaluations || [];
  const competencies = report.competencies || [];
  const integrityEvents = report.integrityEvents || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => setCurrentView("DASHBOARD")}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export / Print PDF</span>
          </button>
          <button
            onClick={() => startInterview("FORMAL")}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retake Calibration</span>
          </button>
        </div>
      </div>

      {/* Hero Executive Score Banner */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Candidate Bio (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Technical Evaluation Report</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">{report.interviewDate || report.completedDate || "2026-11-10"}</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {report.candidateName || report.name || "Elena Vance"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Role Assessed: <strong className="text-white">{report.roleTitle || report.roleApplied}</strong>
              </p>
            </div>

            {/* Recommendation Tag */}
            <div className="flex items-center gap-3 pt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                score >= 80 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : score >= 65
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
              }`}>
                {score >= 80 && <CheckCircle2 className="w-3.5 h-3.5" />}
                {score < 80 && score >= 65 && <AlertCircle className="w-3.5 h-3.5" />}
                {score < 65 && <XCircle className="w-3.5 h-3.5" />}
                <span>{report.recommendation || (score >= 80 ? "Strong Hire" : "Review Required")}</span>
              </span>

              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                Top {score >= 85 ? "5%" : score >= 75 ? "15%" : "35%"} Percentile
              </span>
            </div>
          </div>

          {/* Big Score Gauge (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Composite Technical Score</span>
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={score >= 80 ? "stroke-emerald-400" : (score >= 65 ? "stroke-amber-400" : "stroke-rose-400")}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
                <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span>{report.skillsDemonstrated || 4} Verified</span>
              <span>•</span>
              <span>{report.skillsTotal || 5} Assessed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Competency Breakdown & Anti-Cheat Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Competency Status List (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Competency Validation Rubric</h2>
            <p className="text-xs text-slate-400">Claims substantiated by verbatim quotes during live questioning</p>
          </div>

          <div className="space-y-3">
            {competencies.map((comp, idx) => {
              const isDemonstrated = comp.status === "DEMONSTRATED";
              const isClaimed = comp.status === "CLAIMED_UNVALIDATED";

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-white block">{comp.name}</span>
                    <p className="text-xs text-slate-400 max-w-md">{comp.evidenceCriteria || "Demonstrated required engineering principles."}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 flex items-center gap-1.5 ${
                    isDemonstrated
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : isClaimed
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {isDemonstrated && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {isClaimed && <AlertCircle className="w-3 h-3 text-amber-400" />}
                    <span>{comp.status?.replace(/_/g, ' ') || "DEMONSTRATED"}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Anti-Cheat & Integrity Timeline (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Integrity & Anti-Cheat Audit</h2>
              <p className="text-xs text-slate-400">Timeline of focus shifts, typing velocity, & clipboard events</p>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              integrityEvents.length === 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}>
              {integrityEvents.length === 0 ? "100% Clean Audit" : `${integrityEvents.length} Anomaly Events`}
            </span>
          </div>

          {integrityEvents.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-slate-200">Zero Integrity Anomalies</p>
              <p className="text-[11px] text-slate-400">No tab switching, backgrounding, or unnatural paste bursts detected during the session.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {integrityEvents.map((evt, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-300">{evt.title || evt.eventType}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{evt.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{evt.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recruiter Review & Decision Action */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">Recruiter Review Panel</span>
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 block font-medium">Hiring Recommendation:</label>
              <select
                value={hiringDecision}
                onChange={(e) => setHiringDecision(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Strong Hire">Strong Hire</option>
                <option value="Advance to Team Interview">Advance to Team Interview</option>
                <option value="Technical Re-Assessment Required">Technical Re-Assessment Required</option>
                <option value="Does Not Meet Bar">Does Not Meet Bar</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 block font-medium">Private Recruiter Notes:</label>
              <textarea
                rows={3}
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add confidential evaluation notes for hiring panel..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question-by-Question Verbatim Evidence Drilldown */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Question-by-Question Evidence Audit</h2>
          <p className="text-xs text-slate-400">Verbatim quotations extracted from candidate responses and evaluated against rubric</p>
        </div>

        <div className="space-y-4">
          {evaluations.map((evalItem, idx) => {
            const isExpanded = expandedQuestion === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-400">Q{idx + 1}</span>
                      <span className="text-xs font-semibold text-slate-300">{evalItem.targetCompetency}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {evalItem.assessmentLevel || "Intermediate"}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{evalItem.questionText}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 pl-3">
                    <span className={`text-sm font-mono font-extrabold ${
                      evalItem.score >= 80 ? "text-emerald-400" : (evalItem.score >= 60 ? "text-amber-400" : "text-rose-400")
                    }`}>
                      {evalItem.score}%
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                    {/* Supporting Evidence Quoted */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Extracted Verbatim Evidence</span>
                      <p className="text-slate-200 font-mono leading-relaxed">{evalItem.supportingEvidence}</p>
                    </div>

                    {/* Missing points */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">Missing Technical Concepts & Trade-offs</span>
                      <p className="text-amber-300/90 leading-relaxed">{evalItem.missingPoints}</p>
                    </div>

                    {/* Uncertainty & Accuracy */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400">
                      <div>
                        <strong className="text-slate-300 block mb-0.5">Uncertainty Classification:</strong>
                        <span>{evalItem.uncertaintyLevel} — {evalItem.uncertaintyReason}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300 block mb-0.5">Technical Accuracy:</strong>
                        <span>{evalItem.correctness}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

