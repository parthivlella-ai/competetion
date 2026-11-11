import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AVAILABLE_ROLES, QUESTION_CATALOG } from '../data/rolesAndQuestions';
import { GeminiService } from '../services/geminiService';
import { ResumeParser } from '../services/resumeParser';
import { IntegrityTracker } from '../services/integrityService';

const AppContext = createContext(null);

// Initial Mock Candidate Pipeline for Recruiter View
const INITIAL_CANDIDATE_PIPELINE = [
  {
    id: "cand_elena",
    name: "Elena Vance",
    email: "elena.vance@example.com",
    roleApplied: "Android Developer",
    status: "Shortlisted",
    compositeScore: 88,
    interviewDate: "2026-11-10",
    skillsDemonstrated: 4,
    skillsTotal: 5,
    integrityStatus: "Clean",
    integrityFlagsCount: 0,
    recruiterNotes: "Exceptional mastery in Jetpack Compose and unidirectional state flow. Clear architectural reasoning.",
    recommendation: "Strong Hire",
    evaluations: [
      {
        questionText: "How do you structure unidirectional data flow in Jetpack Compose, and what mechanisms prevent unnecessary recompositions?",
        targetCompetency: "Jetpack Compose & Declarative UI",
        score: 92,
        assessmentLevel: "Intermediate",
        supportingEvidence: "Evidence identified: \"State hoisting with immutable data structures and remember/derivedStateOf guards.\"",
        missingPoints: "Could explore baseline profile generation for pre-JIT compilation.",
        uncertaintyLevel: "Low",
        relevance: "High",
        completeness: "Complete",
        skillStatusResult: "DEMONSTRATED"
      },
      {
        questionText: "Compare CoroutineScope, supervisorScope, and CoroutineExceptionHandler. What happens when a child coroutine encounters an unhandled exception?",
        targetCompetency: "Kotlin Coroutines & Flow",
        score: 86,
        assessmentLevel: "Advanced",
        supportingEvidence: "Evidence identified: \"SupervisorJob isolates child failure without cancelling peer jobs.\"",
        missingPoints: "Could elaborate on non-cancellable context during cleanup.",
        uncertaintyLevel: "Low",
        relevance: "High",
        completeness: "Complete",
        skillStatusResult: "DEMONSTRATED"
      },
      {
        questionText: "How would you design an offline-first mobile sync engine with Room, handling conflict resolution, optimistic UI updates, and unstable connectivity?",
        targetCompetency: "Offline Architecture & Room DB",
        score: 90,
        assessmentLevel: "Advanced",
        supportingEvidence: "Evidence identified: \"Single source of truth with Room Flow emissions and idempotent sync queues.\"",
        missingPoints: "Lacked discussion of schema migration strategies.",
        uncertaintyLevel: "Low",
        relevance: "High",
        completeness: "Complete",
        skillStatusResult: "DEMONSTRATED"
      },
      {
        questionText: "Walk me through how you detect, isolate, and fix severe memory leaks and frame drops in a production Android app.",
        targetCompetency: "Android Performance & Memory Leaks",
        score: 84,
        assessmentLevel: "Expert",
        supportingEvidence: "Evidence identified: \"Used LeakCanary and Perfetto traces to pinpoint static view references and jank.\"",
        missingPoints: "Could mention custom allocator tracking.",
        uncertaintyLevel: "Medium",
        relevance: "High",
        completeness: "Complete",
        skillStatusResult: "DEMONSTRATED"
      }
    ],
    competencies: [
      { name: "Jetpack Compose & Declarative UI", status: "DEMONSTRATED", score: 92 },
      { name: "Kotlin Coroutines & Flow", status: "DEMONSTRATED", score: 86 },
      { name: "Offline Architecture & Room DB", status: "DEMONSTRATED", score: 90 },
      { name: "Android Performance & Memory Leaks", status: "DEMONSTRATED", score: 84 },
      { name: "App Architecture & Modularization", status: "CLAIMED_UNVALIDATED", score: 65 }
    ]
  },
  {
    id: "cand_alex",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    roleApplied: "Cloud Backend Engineer",
    status: "Under Review",
    compositeScore: 78,
    interviewDate: "2026-11-09",
    skillsDemonstrated: 3,
    skillsTotal: 5,
    integrityStatus: "Audit Required",
    integrityFlagsCount: 2,
    recruiterNotes: "Solid distributed systems concepts; 1 paste anomaly recorded during gRPC question requires verification.",
    recommendation: "Advance with Follow-up",
    evaluations: [
      {
        questionText: "What are the core trade-offs between REST and gRPC for internal microservice communication?",
        targetCompetency: "RESTful APIs & gRPC Architecture",
        score: 82,
        assessmentLevel: "Intermediate",
        supportingEvidence: "Evidence identified: \"Protobuf binary serialization and multiplexed HTTP/2 streams.\"",
        missingPoints: "Omitted browser client compatibility nuances.",
        uncertaintyLevel: "Low",
        relevance: "High",
        completeness: "Complete",
        skillStatusResult: "DEMONSTRATED"
      },
      {
        questionText: "How do you prevent cache breakdown (stampede) and cache penetration in high-throughput distributed systems using Redis?",
        targetCompetency: "Distributed Caching (Redis/Memcached)",
        score: 75,
        assessmentLevel: "Advanced",
        supportingEvidence: "Evidence identified: \"Distributed mutex locks and bloom filters for non-existent keys.\"",
        missingPoints: "Missed probabilistic early expiration (XFetch).",
        uncertaintyLevel: "Medium",
        relevance: "High",
        completeness: "Partial",
        skillStatusResult: "DEMONSTRATED"
      }
    ],
    competencies: [
      { name: "Distributed Systems & Concurrency", status: "CLAIMED_UNVALIDATED", score: 68 },
      { name: "RESTful APIs & gRPC Architecture", status: "DEMONSTRATED", score: 82 },
      { name: "Database Indexing & Query Tuning", status: "DEMONSTRATED", score: 80 },
      { name: "Distributed Caching (Redis/Memcached)", status: "DEMONSTRATED", score: 75 },
      { name: "System Resilience & Circuit Breakers", status: "NOT_DEMONSTRATED", score: 45 }
    ]
  },
  {
    id: "cand_sam",
    name: "Samantha Wu",
    email: "samantha.wu@example.com",
    roleApplied: "Web Developer",
    status: "Offered",
    compositeScore: 94,
    interviewDate: "2026-11-08",
    skillsDemonstrated: 5,
    skillsTotal: 5,
    integrityStatus: "Clean",
    integrityFlagsCount: 0,
    recruiterNotes: "Top 1% candidate for Frontend Staff Engineer. In-depth understanding of React Fiber, INP optimization, and TypeScript mapped types.",
    recommendation: "Strong Hire",
    evaluations: [],
    competencies: [
      { name: "TypeScript & Modern JavaScript", status: "DEMONSTRATED", score: 96 },
      { name: "React State Management & Component Lifecycle", status: "DEMONSTRATED", score: 95 },
      { name: "Web Performance & Core Web Vitals", status: "DEMONSTRATED", score: 92 },
      { name: "REST & GraphQL Integration", status: "DEMONSTRATED", score: 90 },
      { name: "Responsive Design & Accessibility (a11y)", status: "DEMONSTRATED", score: 98 }
    ]
  }
];

export const AppProvider = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState("HOME"); // HOME, DASHBOARD, RESUME, STUDIO, REPORT, RECRUITER, ROLES

  // Roles & User Persona
  const [userRole, setUserRole] = useState("CANDIDATE"); // CANDIDATE or RECRUITER
  const [activeCandidate, setActiveCandidate] = useState({
    name: "Elena Vance",
    email: "elena.vance@example.com",
    targetRole: "Android Developer"
  });

  // Selected Target Job Role
  const [selectedRole, setSelectedRole] = useState(AVAILABLE_ROLES[0]);
  const [customJobDescription, setCustomJobDescription] = useState(AVAILABLE_ROLES[0].sampleJobDescription);

  // Resume State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(
    "Senior Android Engineer with 5+ years of experience building scalable mobile apps. Deeply proficient in Kotlin, Jetpack Compose, Coroutines, StateFlow, Room Database, and offline sync. Hands-on experience isolating memory leaks with LeakCanary and Profiler."
  );
  const [extractedCompetencies, setExtractedCompetencies] = useState(
    ResumeParser.extractAndNormalizeCompetencies("Android Developer", AVAILABLE_ROLES[0].sampleJobDescription, "Senior Android Engineer with 5+ years of experience building scalable mobile apps. Deeply proficient in Kotlin, Jetpack Compose, Coroutines, StateFlow, Room Database, and offline sync.")
  );

  // Active Interview Session State
  const [sessionStatus, setSessionStatus] = useState("IDLE"); // IDLE, ACTIVE, EVALUATING, FINISHED
  const [interviewMode, setInterviewMode] = useState("FORMAL"); // PRACTICE or FORMAL
  const [questionIndex, setQuestionIndex] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [remainingSeconds, setRemainingSeconds] = useState(900); // 15 mins
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentAdaptiveReason, setCurrentAdaptiveReason] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [questionHistory, setQuestionHistory] = useState([]);
  const [evaluatedAnswers, setEvaluatedAnswers] = useState([]);
  const [activeSessionReport, setActiveSessionReport] = useState(null);

  // Integrity & Security
  const [integrityEvents, setIntegrityEvents] = useState([]);
  const integrityTrackerRef = useRef(null);

  // Recruiter Database / Pipeline
  const [candidatesPipeline, setCandidatesPipeline] = useState(() => {
    const saved = localStorage.getItem("RANKUP_PIPELINE");
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_PIPELINE;
  });

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDeploymentGuideOpen, setIsDeploymentGuideOpen] = useState(false);
  const [practiceFeedbackModal, setPracticeFeedbackModal] = useState(null);

  // Save pipeline on update
  useEffect(() => {
    localStorage.setItem("RANKUP_PIPELINE", JSON.stringify(candidatesPipeline));
  }, [candidatesPipeline]);

  // Sync role competencies when selected role changes
  const changeSelectedRole = (role) => {
    setSelectedRole(role);
    setCustomJobDescription(role.sampleJobDescription);
    const comps = ResumeParser.extractAndNormalizeCompetencies(role.title, role.sampleJobDescription, resumeText);
    setExtractedCompetencies(comps);
  };

  // Start new interview session
  const startInterview = async (mode = "FORMAL") => {
    setInterviewMode(mode);
    setSessionStatus("ACTIVE");
    setQuestionIndex(1);
    setRemainingSeconds(mode === "PRACTICE" ? 1200 : 900);
    setQuestionHistory([]);
    setEvaluatedAnswers([]);
    setCurrentAnswer("");
    setIntegrityEvents([]);

    // Initialize Integrity Tracker
    if (integrityTrackerRef.current) {
      integrityTrackerRef.current.stop();
    }
    integrityTrackerRef.current = new IntegrityTracker((event) => {
      setIntegrityEvents(prev => [...prev, event]);
    });
    integrityTrackerRef.current.start();

    // Select initial question
    const firstCompetency = extractedCompetencies[0]?.name || selectedRole.keyCompetencies[0];
    const { question, adaptiveReason } = await GeminiService.generateAdaptiveQuestion({
      roleTitle: selectedRole.title,
      jobDescription: customJobDescription,
      resumeSnippet: resumeText,
      questionIndex: 1,
      totalQuestions: totalQuestions,
      targetCompetency: firstCompetency,
      difficulty: "INTERMEDIATE",
      previousHistory: [],
      remainingTimeSeconds: 900
    });

    setCurrentQuestion(question);
    setCurrentAdaptiveReason(adaptiveReason);
    setCurrentView("STUDIO");
  };

  // Submit current answer and progress
  const submitAnswer = async () => {
    if (!currentQuestion) return;

    setSessionStatus("EVALUATING");

    // Evaluate answer with Gemini AI or Deterministic Fallback Engine
    const evaluation = await GeminiService.evaluateAnswer({
      questionId: currentQuestion.id || `q_${questionIndex}`,
      questionText: currentQuestion.questionText,
      targetCompetency: currentQuestion.targetCompetency,
      answer: currentAnswer,
      difficulty: currentQuestion.difficulty,
      expectedKeywords: currentQuestion.keywordsExpected || []
    });

    const updatedEvaluatedAnswers = [...evaluatedAnswers, evaluation];
    setEvaluatedAnswers(updatedEvaluatedAnswers);

    const historyItem = {
      orderIndex: questionIndex,
      questionText: currentQuestion.questionText,
      targetCompetency: currentQuestion.targetCompetency,
      difficulty: currentQuestion.difficulty,
      candidateAnswer: currentAnswer,
      score: evaluation.score,
      evaluation
    };
    const updatedHistory = [...questionHistory, historyItem];
    setQuestionHistory(updatedHistory);

    // Update competency status
    setExtractedCompetencies(prev => prev.map(comp => {
      if (comp.name.toLowerCase() === currentQuestion.targetCompetency.toLowerCase()) {
        return {
          ...comp,
          status: evaluation.skillStatusResult,
          score: evaluation.score
        };
      }
      return comp;
    }));

    // If in Practice Mode, show instant modal before continuing
    if (interviewMode === "PRACTICE") {
      setPracticeFeedbackModal(evaluation);
    }

    // Check if interview completed
    if (questionIndex >= totalQuestions) {
      completeInterview(updatedEvaluatedAnswers, updatedHistory);
      return;
    }

    // Adaptively generate next question
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setCurrentAnswer("");

    // Determine target competency for next turn
    const testedCompetencyNames = new Set(updatedHistory.map(h => h.targetCompetency));
    const nextCompObj = extractedCompetencies.find(c => !testedCompetencyNames.has(c.name)) || extractedCompetencies[nextIndex % extractedCompetencies.length];
    const nextTargetCompetency = nextCompObj?.name || selectedRole.keyCompetencies[nextIndex % selectedRole.keyCompetencies.length];

    const avgScore = Math.round(updatedHistory.reduce((acc, curr) => acc + curr.score, 0) / updatedHistory.length);
    let nextDifficulty = "INTERMEDIATE";
    if (avgScore >= 85) nextDifficulty = "EXPERT";
    else if (avgScore >= 70) nextDifficulty = "ADVANCED";
    else if (avgScore < 55) nextDifficulty = "FOUNDATIONAL";

    const { question: nextQ, adaptiveReason: nextReason } = await GeminiService.generateAdaptiveQuestion({
      roleTitle: selectedRole.title,
      jobDescription: customJobDescription,
      resumeSnippet: resumeText,
      questionIndex: nextIndex,
      totalQuestions: totalQuestions,
      targetCompetency: nextTargetCompetency,
      difficulty: nextDifficulty,
      previousHistory: updatedHistory,
      remainingTimeSeconds: remainingSeconds
    });

    setCurrentQuestion(nextQ);
    setCurrentAdaptiveReason(nextReason);
    setSessionStatus("ACTIVE");
  };

  // Complete interview & synthesize final report
  const completeInterview = (finalEvaluations = evaluatedAnswers, finalHistory = questionHistory) => {
    if (integrityTrackerRef.current) {
      integrityTrackerRef.current.stop();
    }

    const scores = finalEvaluations.map(e => e.score);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const demonstratedCount = finalEvaluations.filter(e => e.skillStatusResult === "DEMONSTRATED").length;

    const report = {
      id: `report_${Date.now()}`,
      candidateName: activeCandidate.name,
      candidateEmail: activeCandidate.email,
      roleTitle: selectedRole.title,
      department: selectedRole.department,
      completedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      compositeScore: avgScore,
      skillsDemonstrated: demonstratedCount,
      skillsTotal: totalQuestions,
      mode: interviewMode,
      evaluations: finalEvaluations,
      history: finalHistory,
      competencies: extractedCompetencies,
      integrityEvents: integrityTrackerRef.current ? integrityTrackerRef.current.getEvents() : integrityEvents,
      recommendation: avgScore >= 85 ? "Strong Hire" : (avgScore >= 70 ? "Advance to Team Interview" : (avgScore >= 55 ? "Technical Re-Assessment Required" : "Does Not Meet Bar")),
      recruiterNotes: avgScore >= 80 
        ? "Candidate demonstrated actionable technical mastery and direct trade-off reasoning across key competencies."
        : "Candidate showed fundamental familiarity but had gaps under production edge cases."
    };

    setActiveSessionReport(report);
    setSessionStatus("FINISHED");

    // Add to candidate pipeline for recruiters
    const pipelineEntry = {
      id: `cand_${Date.now()}`,
      name: activeCandidate.name,
      email: activeCandidate.email,
      roleApplied: selectedRole.title,
      status: avgScore >= 80 ? "Shortlisted" : (avgScore >= 65 ? "Under Review" : "Pass"),
      compositeScore: avgScore,
      interviewDate: report.completedDate,
      skillsDemonstrated: demonstratedCount,
      skillsTotal: totalQuestions,
      integrityStatus: report.integrityEvents.length > 1 ? "Audit Required" : "Clean",
      integrityFlagsCount: report.integrityEvents.length,
      recruiterNotes: report.recruiterNotes,
      recommendation: report.recommendation,
      evaluations: finalEvaluations,
      competencies: extractedCompetencies
    };

    setCandidatesPipeline(prev => [pipelineEntry, ...prev.filter(c => c.email !== activeCandidate.email)]);
    setCurrentView("REPORT");
  };

  const endInterviewEarly = () => {
    completeInterview();
  };

  return (
    <AppContext.Provider
      value={{
        // Navigation
        currentView,
        setCurrentView,

        // Persona & Roles
        userRole,
        setUserRole,
        activeCandidate,
        setActiveCandidate,
        selectedRole,
        changeSelectedRole,
        customJobDescription,
        setCustomJobDescription,

        // Resume & Skills
        resumeFile,
        setResumeFile,
        resumeText,
        setResumeText,
        extractedCompetencies,
        setExtractedCompetencies,

        // Interview Studio
        sessionStatus,
        setSessionStatus,
        interviewMode,
        setInterviewMode,
        questionIndex,
        totalQuestions,
        setTotalQuestions,
        remainingSeconds,
        setRemainingSeconds,
        currentQuestion,
        currentAdaptiveReason,
        currentAnswer,
        setCurrentAnswer,
        questionHistory,
        evaluatedAnswers,
        activeSessionReport,
        setActiveSessionReport,
        startInterview,
        submitAnswer,
        endInterviewEarly,

        // Integrity
        integrityEvents,
        integrityTracker: integrityTrackerRef.current,

        // Pipeline
        candidatesPipeline,
        setCandidatesPipeline,

        // Modals
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isDeploymentGuideOpen,
        setIsDeploymentGuideOpen,
        practiceFeedbackModal,
        setPracticeFeedbackModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

