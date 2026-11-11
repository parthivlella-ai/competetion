import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResumeParser } from '../../services/resumeParser';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  Briefcase,
  Layers,
  Info
} from 'lucide-react';

export const ResumeSetupView = () => {
  const {
    selectedRole,
    customJobDescription,
    setCustomJobDescription,
    resumeText,
    setResumeText,
    extractedCompetencies,
    setExtractedCompetencies,
    startInterview,
    setCurrentView
  } = useApp();

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileSizeKb, setFileSizeKb] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [newSkillName, setNewSkillName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError("");
    setUploadedFileName(file.name);

    const result = await ResumeParser.parseFile(file, selectedRole.title, customJobDescription);
    setIsParsing(false);

    if (!result.success) {
      setParseError(result.error);
      return;
    }

    setFileSizeKb(result.fileSizeKb);
    setResumeText(result.text);
    setExtractedCompetencies(result.extractedSkills);
  };

  const handleManualReExtract = () => {
    const skills = ResumeParser.extractAndNormalizeCompetencies(selectedRole.title, customJobDescription, resumeText);
    setExtractedCompetencies(skills);
  };

  const handleAddCompetency = () => {
    if (!newSkillName.trim()) return;
    const newComp = {
      id: `comp_custom_${Date.now()}`,
      name: newSkillName.trim(),
      category: "Engineering Competency",
      importance: "CORE",
      evidenceCriteria: `Assesses practical engineering proficiency in ${newSkillName.trim()}.`,
      isClaimedOnResume: resumeText.toLowerCase().includes(newSkillName.trim().toLowerCase()),
      status: "CLAIMED_UNVALIDATED"
    };
    setExtractedCompetencies(prev => [...prev, newComp]);
    setNewSkillName("");
  };

  const handleRemoveCompetency = (id) => {
    setExtractedCompetencies(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Resume & Competency Intake</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Calibrate Your Interview Profile
          </h1>
          <p className="text-sm text-slate-400">
            Targeting: <strong className="text-white">{selectedRole.title}</strong> • Upload your resume to extract claims and map to job requirements.
          </p>
        </div>

        <button
          onClick={() => startInterview("FORMAL")}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Interview With This Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Upload Zone & Resume Text */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: File Upload & Direct Text (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              <span>Upload Document (PDF, DOCX, TXT, MD)</span>
            </h2>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-900/40 hover:bg-slate-900/70 group">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                {isParsing ? "Parsing document..." : "Click to browse or drop resume file"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX (Word), TXT, and Markdown up to 10 MB
              </p>
            </label>

            {/* Parse Error Alert */}
            {parseError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{parseError}</span>
              </div>
            )}

            {/* File Info Pill */}
            {uploadedFileName && !parseError && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200">{uploadedFileName}</span>
                  <span className="text-slate-500 font-mono">({fileSizeKb} KB)</span>
                </div>
                <span className="text-emerald-400 font-medium">Parsed successfully</span>
              </div>
            )}

            {/* Resume Textarea */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Resume Plain Text & Claims</span>
                <span>{resumeText.length} characters</span>
              </div>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste or edit resume text here..."
                className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
              <button
                onClick={handleManualReExtract}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 pt-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Re-extract competencies from text</span>
              </button>
            </div>
          </div>

          {/* Job Description Spec Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Job Description & Role Requirements</span>
            </h3>
            <textarea
              rows={4}
              value={customJobDescription}
              onChange={(e) => setCustomJobDescription(e.target.value)}
              placeholder="Paste job description requirements..."
              className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Right: Normalized Competency Table (6 cols) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Normalized Competency Map</h2>
              <p className="text-xs text-slate-400">Claims detected on resume vs required baseline</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-300 font-semibold">
              {extractedCompetencies.length} Competencies
            </span>
          </div>

          {/* Add custom competency */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCompetency()}
              placeholder="Add custom skill (e.g. Distributed Tracing)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddCompetency}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Competencies List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {extractedCompetencies.map((comp) => (
              <div
                key={comp.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 group hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{comp.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      comp.importance === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400"
                        : "bg-indigo-500/10 text-indigo-400"
                    }`}>
                      {comp.importance}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{comp.evidenceCriteria}</p>
                  <div className="pt-1 flex items-center gap-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      comp.isClaimedOnResume 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {comp.isClaimedOnResume ? "✓ Claimed on Resume" : "Unclaimed on Resume"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCompetency(comp.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                  title="Remove competency"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Guidance Info */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              RankUP enforces analytical rigor: Claimed competencies from your resume will not be marked as <strong>DEMONSTRATED</strong> until validated by candidate answers during the live adaptive interview.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

