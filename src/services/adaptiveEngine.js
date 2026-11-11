import { AVAILABLE_ROLES, QUESTION_CATALOG } from '../data/rolesAndQuestions';

export const AdaptiveEngine = {
  getQuestionsForRole(roleTitle) {
    const directMatch = QUESTION_CATALOG[roleTitle];
    if (directMatch) return directMatch;

    for (const [key, questions] of Object.entries(QUESTION_CATALOG)) {
      if (roleTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(roleTitle.toLowerCase())) {
        return questions;
      }
    }
    return QUESTION_CATALOG["Android Developer"];
  },

  selectAdaptiveQuestion({
    roleTitle,
    questionIndex = 1,
    totalQuestions = 5,
    previousScores = [],
    resumeText = "",
    testedCompetencies = new Set(),
    testedQuestionTexts = new Set(),
    remainingTimeSeconds = 900
  }) {
    const pool = this.getQuestionsForRole(roleTitle);
    const avgPreviousScore = previousScores.length === 0 ? 75 : Math.round(previousScores.reduce((a, b) => a + b, 0) / previousScores.length);

    // Filter out already asked questions
    const nonDuplicatePool = pool.filter(q => !testedQuestionTexts.has(q.questionText));
    const effectivePool = nonDuplicatePool.length > 0 ? nonDuplicatePool : pool;

    // Prioritize unassessed competencies
    const unassessed = effectivePool.filter(q => !testedCompetencies.has(q.targetCompetency));
    const candidateQuestions = unassessed.length > 0 ? unassessed : effectivePool;

    // Difficulty adjustment based on trajectory
    let selected;
    if (avgPreviousScore >= 85) {
      selected = candidateQuestions.find(q => q.difficulty === "EXPERT" || q.difficulty === "ADVANCED") || candidateQuestions[0];
    } else if (avgPreviousScore <= 60) {
      selected = candidateQuestions.find(q => q.difficulty === "INTERMEDIATE" || q.difficulty === "FOUNDATIONAL") || candidateQuestions[0];
    } else {
      selected = candidateQuestions[0];
    }

    // Generate analytical rationale
    const firstKeyword = selected.targetCompetency.split(" ")[0].toLowerCase();
    const resumeClaimed = resumeText.toLowerCase().includes(firstKeyword);

    let reason;
    if (questionIndex === 1) {
      reason = `Initial baseline calibration: systematically evaluating core competency '${selected.targetCompetency}' from role requirements.`;
    } else if (avgPreviousScore >= 85 && resumeClaimed) {
      reason = `Adapted difficulty to ${selected.difficulty} based on high mastery in previous turns (${avgPreviousScore}% avg); stress-testing resume claim under scaling constraints.`;
    } else if (avgPreviousScore >= 85) {
      reason = `Elevated to ${selected.difficulty} tier to probe candidate's technical boundary under production failure constraints.`;
    } else if (avgPreviousScore <= 60) {
      reason = `Calibrated to ${selected.difficulty} tier to test fundamental comprehension in '${selected.targetCompetency}' following uncertain responses.`;
    } else {
      reason = `Systematically assessing competency '${selected.targetCompetency}' to ensure balanced rubric coverage.`;
    }

    return {
      question: selected,
      adaptiveReason: reason
    };
  },

  evaluateAnswer({
    questionText,
    targetCompetency,
    answer,
    difficulty = "INTERMEDIATE",
    expectedKeywords = [],
    questionId = ""
  }) {
    const trimmedAnswer = (answer || "").trim();
    const words = trimmedAnswer.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // 1. Completely empty
    if (wordCount === 0) {
      return {
        questionId,
        targetCompetency,
        score: 0,
        correctness: "No response was submitted by candidate.",
        relevance: "Irrelevant",
        completeness: "Deficient",
        supportingEvidence: "No answer provided.",
        missingPoints: `Expected explanation of ${targetCompetency} including core principles, mechanics, and trade-offs.`,
        uncertaintyLevel: "High",
        uncertaintyReason: "Cannot assess competency without candidate response.",
        assessmentLevel: difficulty,
        explanation: "An empty answer indicates unassessed competency.",
        skillStatusResult: "NOT_DEMONSTRATED"
      };
    }

    // 2. Trivially brief (under 5 words)
    if (wordCount < 5) {
      return {
        questionId,
        targetCompetency,
        score: 25,
        correctness: "Answer was too brief to demonstrate actionable competency.",
        relevance: "Moderate",
        completeness: "Deficient",
        supportingEvidence: `Minimal response provided: "${trimmedAnswer.slice(0, 50)}"`,
        missingPoints: `Expected detailed explanation of architecture, trade-offs, and implementation approach for ${targetCompetency}.`,
        uncertaintyLevel: "High",
        uncertaintyReason: "Candidate provided insufficient detail for evidence-based assessment.",
        assessmentLevel: difficulty,
        explanation: "Brief superficial phrases do not substantiate technical capability.",
        skillStatusResult: "NOT_DEMONSTRATED"
      };
    }

    const lowerAnswer = trimmedAnswer.toLowerCase();
    const matchedKeywords = expectedKeywords.filter(kw => {
      const lkw = kw.toLowerCase();
      return lowerAnswer.includes(lkw) ||
        (lkw.endsWith("ing") && lowerAnswer.includes(lkw.slice(0, -3))) ||
        (lkw.endsWith("tion") && lowerAnswer.includes(lkw.slice(0, -4))) ||
        (lkw.endsWith("s") && lowerAnswer.includes(lkw.slice(0, -1)));
    });

    // 3. Irrelevant
    const targetTerms = targetCompetency.toLowerCase().split(/[&/ ]/).filter(w => w.length > 3);
    const hasAnyCompetencyTerm = targetTerms.some(t => lowerAnswer.includes(t));

    if (matchedKeywords.length === 0 && !hasAnyCompetencyTerm && wordCount >= 6) {
      return {
        questionId,
        targetCompetency,
        score: 15,
        correctness: "Answer is irrelevant to the technical question and competency.",
        relevance: "Irrelevant",
        completeness: "Deficient",
        supportingEvidence: "No relevant technical evidence present in response.",
        missingPoints: `Expected discussion of ${targetCompetency} with key concepts: ${expectedKeywords.slice(0, 4).join(", ")}.`,
        uncertaintyLevel: "High",
        uncertaintyReason: "Candidate response diverged completely from the technical question.",
        assessmentLevel: difficulty,
        explanation: "Off-topic responses cannot be credited toward technical competence.",
        skillStatusResult: "NOT_DEMONSTRATED"
      };
    }

    const matchRatio = expectedKeywords.length > 0 ? (matchedKeywords.length / expectedKeywords.length) : 0.5;
    let baseScore = Math.round(matchRatio * 55) + 35;
    if (wordCount > 35) baseScore += 8;
    if (wordCount > 70) baseScore += 5;
    const finalScore = Math.max(35, Math.min(96, baseScore));

    // Extract evidence sentence
    const sentences = trimmedAnswer.split(/[.!?]\s+/);
    const evidenceSnippet = sentences.find(s => 
      matchedKeywords.some(kw => s.toLowerCase().includes(kw.toLowerCase()))
    ) || sentences[0] || trimmedAnswer.slice(0, 120);

    const uncertaintyLevel = finalScore >= 75 && wordCount >= 20 ? "Low" : (finalScore >= 55 ? "Medium" : "High");
    const uncertaintyReason = uncertaintyLevel === "Low"
      ? "Clear explanation with specific technical terminology and direct reasoning."
      : (uncertaintyLevel === "Medium"
        ? "Candidate touched on correct principles, but lacked depth in failure modes or performance nuances."
        : "High variance in answer quality; does not adequately substantiate technical claim.");

    const skillStatusResult = finalScore >= 75 ? "DEMONSTRATED" : (finalScore >= 55 ? "CLAIMED_UNVALIDATED" : "NOT_DEMONSTRATED");
    const relevance = (matchedKeywords.length >= 2 || hasAnyCompetencyTerm) ? "High" : "Moderate";
    const completeness = finalScore >= 80 ? "Complete" : (finalScore >= 60 ? "Partial" : "Deficient");

    const correctness = finalScore >= 85
      ? `Strong technical accuracy. Effectively addressed core principles and practical mechanics of ${targetCompetency}.`
      : (finalScore >= 70
        ? `Adequate baseline comprehension. Covered primary concepts of ${targetCompetency} with sensible reasoning.`
        : `Incomplete explanation. Demonstrated superficial awareness but missed critical implementation aspects.`);

    const missingUnmatched = expectedKeywords.filter(k => !matchedKeywords.includes(k));
    const missingPoints = finalScore >= 85
      ? "Could additionally discuss edge cases under extreme concurrency, scaling limits, or production monitoring."
      : (finalScore >= 70
        ? `Lacked concrete discussion of: ${missingUnmatched.slice(0, 3).join(", ") || "failure recovery nuances"}.`
        : `Failed to address core requirements: ${expectedKeywords.slice(0, 3).join(", ")}.`);

    return {
      questionId,
      targetCompetency,
      score: finalScore,
      correctness,
      relevance,
      completeness,
      supportingEvidence: `Evidence identified: "${evidenceSnippet.trim()}"`,
      missingPoints,
      uncertaintyLevel,
      uncertaintyReason,
      assessmentLevel: difficulty,
      explanation: `Evaluated response for ${targetCompetency} against role rubric criteria.`,
      skillStatusResult
    };
  }
};

