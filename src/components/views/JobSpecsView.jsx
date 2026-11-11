import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_ROLES, QUESTION_CATALOG } from '../../data/rolesAndQuestions';
import { 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Terminal, 
  Cpu, 
  Globe, 
  Coffee, 
  BarChart3, 
  Smartphone 
} from 'lucide-react';

export const JobSpecsView = () => {
  const { selectedRole, changeSelectedRole, setCurrentView, startInterview } = useApp();
  const [activeTabRole, setActiveTabRole] = useState(selectedRole.id);

  const activeRoleData = AVAILABLE_ROLES.find(r => r.id === activeTabRole) || AVAILABLE_ROLES[0];
  const questions = QUESTION_CATALOG[activeRoleData.title] || [];

  const handleSelectRole = (role) => {
    changeSelectedRole(role);
    setActiveTabRole(role.id);
  };

  const handleSelectAndStart = (role) => {
    changeSelectedRole(role);
    startInterview("FORMAL");
  };

  const getRoleIcon = (id) => {
    switch (id) {
      case "android_dev": return Smartphone;
      case "backend_dev": return Cpu;
      case "web_dev": return Globe;
      case "python_dev": return Terminal;
      case "java_dev": return Coffee;
      case "data_analyst": return BarChart3;
      case "ml_engineer": return Sparkles;
      default: return Briefcase;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Role & Rubric Library</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Standard Technical Calibration Specs
          </h1>
          <p className="text-sm text-slate-400">
            Explore normalized job descriptions, target competencies, and adaptive question pools.
          </p>
        </div>

        <button
          onClick={() => handleSelectAndStart(activeRoleData)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Calibrate for {activeRoleData.title}</span>
        </button>
      </div>

      {/* Role Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {AVAILABLE_ROLES.map(role => {
          const Icon = getRoleIcon(role.id);
          const isSelected = activeTabRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => handleSelectRole(role)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                isSelected
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
              <span>{role.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Role Overview & Competencies (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>{activeRoleData.department}</span>
              <span>•</span>
              <span>ID: {activeRoleData.id}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{activeRoleData.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{activeRoleData.description}</p>
          </div>

          {/* Sample Job Description */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Baseline Job Description</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeRoleData.sampleJobDescription}</p>
          </div>

          {/* Key Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Required Competencies ({activeRoleData.keyCompetencies.length})</h3>
            <div className="space-y-2">
              {activeRoleData.keyCompetencies.map((comp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-white">{comp}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-950">
                    {idx === 0 ? "CRITICAL" : (idx < 3 ? "HIGH" : "CORE")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Question Pool & Rubrics (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Adaptive Question Pool</h3>
            <p className="text-xs text-slate-400">Pre-seeded questions dynamically chosen based on candidate scores</p>
          </div>

          {questions.length === 0 ? (
            <p className="text-xs text-slate-400">Questions generated dynamically via Gemini 2.0 Flash for this role.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-300">{q.targetCompetency}</span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white leading-snug">{q.questionText}</p>
                  <p className="text-[11px] text-slate-400 italic">"{q.rationaleTemplate}"</p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {q.keywordsExpected?.map((kw, ki) => (
                      <span key={ki} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

