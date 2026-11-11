import { AdaptiveEngine } from './adaptiveEngine';

const PRIMARY_MODEL = "gemini-2.0-flash";
const FALLBACK_MODEL = "gemini-1.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export const GeminiService = {
  getStoredApiKey() {
    return localStorage.getItem("GEMINI_API_KEY") || import.meta.env.VITE_GEMINI_API_KEY || "";
  },

  setApiKey(key) {
    if (key) {
      localStorage.setItem("GEMINI_API_KEY", key.trim());
    } else {
      localStorage.removeItem("GEMINI_API_KEY");
    }
  },

  isConfigured() {
    const key = this.getStoredApiKey();
    return Boolean(key && key.length > 20 && !key.includes("your_api_key"));
  },

  getStatusDescription() {
    if (this.isConfigured()) {
      return {
        status: "LIVE_AI",
        label: "Live AI • Gemini 2.0 Flash",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      };
    }
    return {
      status: "OFFLINE_FALLBACK",
      label: "Rule-Based Engine (Deterministic Fallback)",
      badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
    };
  },

  async callGeminiApi(model, prompt, apiKey) {
    const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No text output received in Gemini response.");
    }

    // Clean JSON markdown fences if present
    const cleaned = candidateText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
    return JSON.parse(cleaned);
  },

  async generateAdaptiveQuestion({
    roleTitle,
    jobDescription,
    resumeSnippet,
    questionIndex = 1,
    totalQuestions = 5,
    targetCompetency,
    difficulty = "INTERMEDIATE",
    previousHistory = [],
    remainingTimeSeconds = 900
  }) {
    if (!this.isConfigured()) {
      return AdaptiveEngine.selectAdaptiveQuestion({
        roleTitle,
        questionIndex,
        totalQuestions,
        previousScores: previousHistory.map(h => h.score),
        resumeText: resumeSnippet,
        testedCompetencies: new Set(previousHistory.map(h => h.targetCompetency)),
        testedQuestionTexts: new Set(previousHistory.map(h => h.questionText)),
        remainingTimeSeconds
      });
    }

    const apiKey = this.getStoredApiKey();
    const historySummary = previousHistory.length === 0
      ? "No previous questions asked yet."
      : previousHistory.map(h => `- Q${h.orderIndex} [${h.targetCompetency}] (Score: ${h.score}%): Answered "${(h.candidateAnswer || "").slice(0, 100)}..."`).join("\n");

    const prompt = `You are RankUP, an expert technical interviewer conducting an adaptive competency assessment for the role '${roleTitle}'.
Generate Question #${questionIndex} of ${totalQuestions}.

Target Competency: ${targetCompetency}
Target Difficulty Level: ${difficulty}
Remaining Interview Time: ${Math.round(remainingTimeSeconds / 60)} minutes

Candidate Resume Context:
${resumeSnippet || `Standard technical applicant for ${roleTitle}`}

Target Job Description:
${jobDescription || `Standard engineering standards for ${roleTitle}`}

Interview Question History:
${historySummary}

Already Asked Questions (DO NOT REPEAT OR PARAPHRASE):
${previousHistory.map(h => "- " + h.questionText).join("\n")}

Instructions:
1. Formulate a realistic, scenario-based technical question focused squarely on '${targetCompetency}'.
2. Calibrate difficulty to '${difficulty}'. (For Advanced/Expert: probe distributed failures, race conditions, memory pressure, or scale trade-offs. For Foundational/Intermediate: probe mechanics, lifecycle, and syntax).
3. Provide an 'adaptiveReason' explaining why this question and difficulty were selected based on candidate's answers and resume claims.
4. List 4-7 expected technical concepts/keywords that an accurate answer must contain.

Return JSON matching this schema:
{
  "questionText": "Question string here",
  "adaptiveReason": "[Live AI • Gemini 2.0] Rationale for question and difficulty selection",
  "targetCompetency": "${targetCompetency}",
  "difficulty": "${difficulty}",
  "keywordsExpected": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "rationaleTemplate": "Why this question substantiates competency"
}`;

    try {
      const parsed = await this.callGeminiApi(PRIMARY_MODEL, prompt, apiKey);
      return {
        question: {
          id: `gemini_q_${Date.now()}`,
          questionText: parsed.questionText,
          targetCompetency: parsed.targetCompetency || targetCompetency,
          difficulty: parsed.difficulty || difficulty,
          keywordsExpected: parsed.keywordsExpected || ["architecture", "trade-offs", "performance"],
          rationaleTemplate: parsed.rationaleTemplate || `Validates practical proficiency in ${targetCompetency}.`
        },
        adaptiveReason: parsed.adaptiveReason || `[Live AI • Gemini] Dynamic question calibrated for ${targetCompetency} at ${difficulty} tier.`
      };
    } catch (err) {
      console.warn("Primary Gemini model failed, trying fallback model or local engine:", err);
      try {
        const parsedFallback = await this.callGeminiApi(FALLBACK_MODEL, prompt, apiKey);
        return {
          question: {
            id: `gemini_q_fallback_${Date.now()}`,
            questionText: parsedFallback.questionText,
            targetCompetency: parsedFallback.targetCompetency || targetCompetency,
            difficulty: parsedFallback.difficulty || difficulty,
            keywordsExpected: parsedFallback.keywordsExpected || ["architecture", "trade-offs", "performance"],
            rationaleTemplate: parsedFallback.rationaleTemplate || `Validates practical proficiency in ${targetCompetency}.`
          },
          adaptiveReason: parsedFallback.adaptiveReason || `[Live AI • Gemini 1.5] Calibrated for ${targetCompetency}.`
        };
      } catch (fallbackErr) {
        console.warn("Gemini API calls failed completely. Falling back to local AdaptiveEngine:", fallbackErr);
        return AdaptiveEngine.selectAdaptiveQuestion({
          roleTitle,
          questionIndex,
          totalQuestions,
          previousScores: previousHistory.map(h => h.score),
          resumeText: resumeSnippet,
          testedCompetencies: new Set(previousHistory.map(h => h.targetCompetency)),
          testedQuestionTexts: new Set(previousHistory.map(h => h.questionText)),
          remainingTimeSeconds
        });
      }
    }
  },

  async evaluateAnswer({
    questionId = "",
    questionText,
    targetCompetency,
    answer,
    difficulty = "INTERMEDIATE",
    expectedKeywords = []
  }) {
    const trimmed = (answer || "").trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

    // Fast-paths for zero / minimal input
    if (wordCount === 0 || wordCount < 5 || !this.isConfigured()) {
      return AdaptiveEngine.evaluateAnswer({
        questionId,
        questionText,
        targetCompetency,
        answer,
        difficulty,
        expectedKeywords
      });
    }

    const apiKey = this.getStoredApiKey();
    const prompt = `You are RankUP, an objective, evidence-based technical career-intelligence evaluator.
Assess the candidate's interview answer with high analytical rigor.

Question Asked:
"${questionText}"

Target Competency:
"${targetCompetency}" (Difficulty tier: ${difficulty})

Expected Technical Criteria & Concepts:
${expectedKeywords.join(", ")}

Candidate's Answer:
"${trimmed}"

Evaluation Criteria:
1. Relevance: "High" (directly addresses question), "Moderate" (tangential), or "Irrelevant" (off-topic).
2. Completeness: "Complete" (covers mechanics & nuances), "Partial" (covers surface only), or "Deficient" (major concepts missed).
3. Score: 0 to 100 based on technical accuracy, practical mechanics, and trade-offs.
   - If Relevance is "Irrelevant", score MUST NOT exceed 25.
   - 80-100: Exceptional accuracy, handles failure modes and architecture.
   - 60-79: Solid baseline comprehension, covers primary mechanisms.
   - 40-59: High-level or vague understanding without mechanics.
   - 0-39: Incorrect, evasive, or unsubstantiated.
4. Supporting Evidence: Direct quote or exact technical phrase from candidate's answer verifying competence. If irrelevant/evasive, state "No verifiable evidence present". NEVER FABRICATE EVIDENCE.
5. Missing Concepts: Concrete technical details or trade-offs the candidate omitted.
6. Uncertainty: "Low" (clear evidence), "Medium" (ambiguous depth), "High" (vague generalizations or evasive).
7. Skill Status: "DEMONSTRATED" (score >= 75), "CLAIMED_UNVALIDATED" (score 55-74), "NOT_DEMONSTRATED" (score < 55).
8. Explanation: 1-2 constructive sentences summarizing the evaluation.

Return ONLY a JSON object with this exact structure:
{
  "score": 82,
  "correctness": "Detailed technical analysis of accuracy",
  "relevance": "High",
  "completeness": "Complete",
  "supportingEvidence": "Direct quote from answer",
  "missingPoints": "Concrete missing concepts or trade-offs",
  "uncertaintyLevel": "Low",
  "uncertaintyReason": "Reason for uncertainty classification",
  "assessmentLevel": "${difficulty}",
  "explanation": "Constructive takeaway summary",
  "skillStatusResult": "DEMONSTRATED"
}`;

    try {
      const parsed = await this.callGeminiApi(PRIMARY_MODEL, prompt, apiKey);
      return {
        questionId,
        targetCompetency,
        score: Math.max(0, Math.min(100, parsed.score ?? 70)),
        correctness: parsed.correctness || `Evaluated by Gemini AI for ${targetCompetency}.`,
        relevance: parsed.relevance || "High",
        completeness: parsed.completeness || "Complete",
        supportingEvidence: parsed.supportingEvidence || `Identified evidence in candidate answer.`,
        missingPoints: parsed.missingPoints || "Could expand further on production resilience.",
        uncertaintyLevel: parsed.uncertaintyLevel || "Low",
        uncertaintyReason: parsed.uncertaintyReason || "Evaluated based on depth and terminology.",
        assessmentLevel: difficulty,
        explanation: parsed.explanation || `Evaluated response for ${targetCompetency}.`,
        skillStatusResult: parsed.skillStatusResult || (parsed.score >= 75 ? "DEMONSTRATED" : "CLAIMED_UNVALIDATED")
      };
    } catch (err) {
      console.warn("Live Gemini evaluation failed, falling back to local engine:", err);
      return AdaptiveEngine.evaluateAnswer({
        questionId,
        questionText,
        targetCompetency,
        answer,
        difficulty,
        expectedKeywords
      });
    }
  }
};

