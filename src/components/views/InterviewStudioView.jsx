import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Clock, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  HelpCircle,
  StopCircle,
  Activity,
  Layers,
  ChevronRight,
  BrainCircuit,
  X
} from 'lucide-react';

export const InterviewStudioView = () => {
  const {
    selectedRole,
    questionIndex,
    totalQuestions,
    remainingSeconds,
    setRemainingSeconds,
    currentQuestion,
    currentAdaptiveReason,
    currentAnswer,
    setCurrentAnswer,
    sessionStatus,
    interviewMode,
    submitAnswer,
    endInterviewEarly,
    integrityEvents,
    integrityTracker,
    practiceFeedbackModal,
    setPracticeFeedbackModal
  } = useApp();

  // Webcam State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Audio / Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const recognitionRef = useRef(null);

  // End Confirmation Modal
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Character & Word metrics
  const wordCount = currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = currentAnswer.length;

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer(prev => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError("Microphone permission was denied.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (sessionStatus !== "ACTIVE") return;
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          endInterviewEarly();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus]);

  // Format Timer string MM:SS
  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Webcam
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsCameraActive(false);
      if (integrityTracker) {
        integrityTracker.recordCameraInterruption("Candidate manually stopped camera stream.");
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch (e) {
        console.warn("Camera access denied or unavailable:", e);
      }
    }
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech-to-text recognition is not supported in this browser. Please type your answers directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError("");
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Speech error:", e);
      }
    }
  };

  // Paste Anomaly Listener
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && integrityTracker) {
      integrityTracker.recordPaste(pastedText.length);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case "FOUNDATIONAL": return "bg-slate-700/60 text-slate-300 border-slate-600";
      case "INTERMEDIATE": return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case "ADVANCED": return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "EXPERT": return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      default: return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
    }
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-spin" />
        <h2 className="text-xl font-bold text-white">Calibrating Interview Studio...</h2>
        <p className="text-sm text-slate-400">Synthesizing adaptive role criteria and baseline questions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">{selectedRole.title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                interviewMode === "PRACTICE" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
              }`}>
                {interviewMode} MODE
              </span>
            </div>
            <span className="text-xs text-slate-400">Turn {questionIndex} of {totalQuestions} • Calibrated by AI</span>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
            remainingSeconds < 180 ? "bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse" : "bg-slate-900 border-slate-800 text-slate-200"
          }`}>
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowEndConfirm(true)}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Proctoring & Active Integrity (4 cols) */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          {/* Webcam Box */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Candidate Proctor Feed</span>
              </div>
              <button
                onClick={toggleCamera}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isCameraActive ? "Disable Camera" : "Enable Camera"}
              </button>
            </div>

            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="text-center p-4 text-slate-500 space-y-2">
                  <VideoOff className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">Camera preview idle</p>
                  <button
                    onClick={toggleCamera}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg transition-colors font-medium"
                  >
                    Start Preview
                  </button>
                </div>
              )}

              {/* Live Proctor Pill */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm border border-slate-700 text-[10px] text-slate-300 font-mono flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
                <span>{isCameraActive ? "LIVE FEED" : "STANDBY"}</span>
              </div>
            </div>

            {/* Anti-cheat audit info */}
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Proctoring Security</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Window & Paste Auditing Active
              </span>
            </div>
          </div>

          {/* Target Competency & Expected Rubric */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Target Competency Breakdown</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{currentQuestion.targetCompetency}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentQuestion.rationaleTemplate}
              </p>
            </div>

            {/* Expected Core Concepts */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-slate-400 block">Evaluated Keyword Criteria:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentQuestion.keywordsExpected?.map((kw, i) => (
                  <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Question Card & Candidate Response Console (8 cols) */}
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          {/* Question Card */}
          <div className="glass-panel-elevated rounded-2xl p-6 md:p-8 space-y-5 bg-slate-900/90 border border-indigo-500/20">
            {/* Adaptive Rationale Banner */}
            {currentAdaptiveReason && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-start gap-2.5">
                <BrainCircuit className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <div>
                  <span className="font-semibold block text-indigo-200">Live AI Adaptive Reason</span>
                  <p className="text-indigo-300/90 leading-relaxed mt-0.5">{currentAdaptiveReason}</p>
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <span>Question #{questionIndex}</span>
                <span>•</span>
                <span>{currentQuestion.targetCompetency}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {currentQuestion.questionText}
              </h2>
            </div>
          </div>

          {/* Response Console */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Candidate Response</span>
                {isListening && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Transcribing live speech...</span>
                  </div>
                )}
              </div>

              {/* Dictation Action */}
              <button
                type="button"
                onClick={toggleListening}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isListening
                    ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isListening ? "Stop Dictation" : "Speak Answer"}</span>
              </button>
            </div>

            {speechError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                {speechError}
              </div>
            )}

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={9}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onPaste={handlePaste}
                placeholder="Type your structured technical answer or use the microphone to speak... Explain core mechanics, memory/concurrency constraints, failure modes, and practical trade-offs."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 leading-relaxed font-sans shadow-inner"
              />

              {/* Visual Waveform if listening */}
              {isListening && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1">
                  <span className="w-1 h-3 bg-indigo-400 animate-wave rounded-full" />
                  <span className="w-1 h-5 bg-indigo-400 animate-wave rounded-full delay-100" />
                  <span className="w-1 h-2 bg-indigo-400 animate-wave rounded-full delay-200" />
                  <span className="w-1 h-4 bg-indigo-400 animate-wave rounded-full delay-300" />
                </div>
              )}
            </div>

            {/* Metrics & Submission Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={sessionStatus === "EVALUATING" || !currentAnswer.trim()}
                  onClick={submitAnswer}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  {sessionStatus === "EVALUATING" ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Evaluating with Rubric...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer & Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Mode Instant Feedback Modal */}
      {practiceFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-panel-elevated rounded-2xl p-6 md:p-8 bg-slate-900 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Practice Mode Feedback</h3>
              </div>
              <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg ${
                practiceFeedbackModal.score >= 75 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                Score: {practiceFeedbackModal.score}%
              </span>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block text-[10px]">Technical Accuracy</span>
                <p className="text-slate-200 text-sm leading-relaxed">{practiceFeedbackModal.correctness}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400 uppercase tracking-wider block text-[10px]">Extracted Supporting Evidence</span>
                <p className="text-emerald-300 font-mono">{practiceFeedbackModal.supportingEvidence}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-amber-400 uppercase tracking-wider block text-[10px]">Missing Technical Nuances</span>
                <p className="text-amber-300">{practiceFeedbackModal.missingPoints}</p>
              </div>
            </div>

            <button
              onClick={() => setPracticeFeedbackModal(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
            >
              Continue to Next Question
            </button>
          </div>
        </div>
      )}

      {/* End Early Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md glass-panel-elevated rounded-2xl p-6 bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">End Interview Session Early?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizing the report now will evaluate all answers submitted up to Question #{questionIndex}. Remaining unasked questions will be marked as not assessed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEndConfirm(false);
                  endInterviewEarly();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all"
              >
                Synthesize Report Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
