# RankUP AI — Adaptive Career Intelligence & Technical Interview Studio

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-AI-8E75FF?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Netlify%20%7C%20Cloudflare-10B981)](#-recommended-deployment-platforms)

> Production-grade web application for **RankUP**, an adaptive technical interview and career-intelligence platform. Designed from the native Kotlin architecture of [parthivlella-ai/Ai-interview-intelligence-app](https://github.com/parthivlella-ai/Ai-interview-intelligence-app).

---

## 🌟 Executive Overview

Traditional technical interviews rely on static questionnaires or multiple-choice questions, which candidates can easily memorize or game. **RankUP AI** solves this by establishing a **real-time adaptive calibration loop**:

1. **Dynamic Difficulty Scaling:** Candidate responses are evaluated on technical accuracy, practical mechanics, and trade-offs. High performers are dynamically elevated to **Expert** difficulty tiers (probing memory leaks, race conditions, and distributed failure modes), while struggling candidates are calibrated to fundamental mechanics.
2. **Zero-Hallucination Evidence Rubrics:** Rather than giving black-box scores, the evaluator extracts verbatim quotes from the candidate's speech/text to substantiate each score. Unsubstantiated claims remain categorized as **Claimed (Unvalidated)**.
3. **Live AI + Offline Fallback:** Fully integrated with Google's latest **`gemini-2.0-flash`** model (with `gemini-1.5-flash` secondary fallback) alongside a deterministic rule-based evaluator that runs completely offline with zero API key requirement.
4. **Interactive Studio with Speech & Proctoring:** Features Web Speech API transcription, live camera preview, focus-lost monitoring, paste anomaly detection, and burst velocity auditing.
5. **Recruiter Intelligence Command Center:** Multi-candidate comparison matrix, candidate pipeline filtering, anti-cheat timeline audits, and private hiring recommendation notes.

---

## 🎨 Editorial Design System

- **Background Canvas:** Midnight Navy (`#080C16`, `#0B0F19`)
- **Elevated Surfaces:** Deep Indigo & Slate (`#1E293B`, `#0F172A`)
- **Primary Brand Accents:** Electric Violet (`#7C3AED`, `#8565FF`) & Azure Blue (`#2563EB`)
- **Performance & Evidence Badges:** Mint Emerald / Teal (`#10B981`, `#48D9C1`)
- **Typography:** Plus Jakarta Sans (Headings), Inter (Metrics & Tables), JetBrains Mono (Code & Criteria)

---

## 🚀 Recommended Deployment Platforms

This web application is built as a lightning-fast, high-performance Single Page Application (SPA). Because it connects directly to Gemini's client API and runs reactive state in the browser, **it does not require a backend server or database to run in production**.

### Platform Comparison Matrix

| Platform | Recommended For | Free Tier | Deploy Time | Custom Domains & SSL |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel** *(Top Pick)* | Best overall for Vite + React | Generous (100GB band.) | ~30s | Free Automatic SSL |
| **Netlify** | Fast alternative with drag & drop | 100GB/mo free | ~45s | Free Automatic SSL |
| **Cloudflare Pages** | Enterprise edge speed, 0 latency | Unlimited bandwidth | ~35s | Free Automatic SSL |
| **GitHub Pages** | Built directly into GitHub | Unlimited public repos | ~60s | Supported via Actions |

---

### 1. Deploying to Vercel (Top Recommendation)

Vercel provides native zero-config deployment for Vite applications.

1. Push this repository to GitHub.
2. Visit [vercel.com](https://vercel.com/) and click **"Add New Project"**.
3. Import this repository (`stitch-adaptive-interview-intelligence-ui`).
4. Vercel automatically detects the build configuration:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. *(Optional)* Add Environment Variable:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
6. Click **Deploy**. Your application is live globally in ~30 seconds!

---

### 2. Deploying to Netlify

1. Visit [app.netlify.com](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
2. Select GitHub and pick this repository.
3. Configuration:
   - **Build Command:** `npm run build`
   - **Publish directory:** `dist`
4. Netlify automatically respects the included `public/_redirects` file for client-side SPA routing (`/* /index.html 200`).
5. Click **"Deploy site"**.

---

### 3. Deploying to Cloudflare Pages

1. Go to the **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages**.
2. Connect your GitHub repository.
3. Select Framework preset: **`Vite`**.
4. Build command: `npm run build`, Output directory: `dist`.
5. Click **Save and Deploy**. Enjoy zero bandwidth limits on 300+ edge locations!

---

## 💻 Local Development Setup

### Prerequisites
- Node.js `v18.0.0` or higher (Tested on Node `v24.x`)
- npm `v9.x` or higher

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build Production Bundle

```bash
npm run build
```

This compiles optimized, gzipped assets into the `dist/` directory ready for any web server.

---

## 🔑 Environment Variables & Gemini AI Setup

RankUP is engineered to work **100% out-of-the-box** without any configuration:
- When no API key is present, it uses the built-in deterministic **`AdaptiveEngine`** matching the Android platform's test suite.
- To enable real-time Gemini 2.0 Flash AI generation:
  1. Click the **"Live AI"** button in the navbar, paste your key, and click **"Save & Activate"**.
  2. Or create a `.env` file in the root folder:
     ```env
     VITE_GEMINI_API_KEY=AIzaSy...
     ```

---

## 🏛️ Application Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx               # Navigation, role switcher, AI engine status
│   │   └── Footer.jsx               # Platform footer & repo citations
│   ├── modals/
│   │   ├── ApiKeyModal.jsx          # Live Gemini key configuration & test tool
│   │   └── DeploymentGuideModal.jsx # In-app platform deployment guide
│   └── views/
│       ├── HomeView.jsx             # Hero landing, feature breakdown, role picker
│       ├── CandidateDashboardView.jsx# Competency matrix, prep stats, recent sessions
│       ├── ResumeSetupView.jsx      # PDF/DOCX/TXT/MD document intake & parsing
│       ├── InterviewStudioView.jsx  # Live adaptive studio, speech-to-text, webcam
│       ├── AssessmentReportView.jsx # Evaluation report, score gauge, evidence drilldown
│       ├── RecruiterPipelineView.jsx# Candidate pipeline, side-by-side comparison
│       └── JobSpecsView.jsx         # 8 Technical role specs, questions & rubrics
├── context/
│   └── AppContext.jsx               # Reactive global state, session lifecycle
├── data/
│   └── rolesAndQuestions.js         # Domain models, roles, question catalog
└── services/
    ├── adaptiveEngine.js            # Deterministic question branching & evaluation
    ├── geminiService.js             # Gemini 2.0 Flash API client with fallbacks
    ├── resumeParser.js              # Client-side PDF & DOCX XML resume parser
    └── integrityService.js          # Anti-cheat focus loss & paste burst tracker
```

---

## 🔗 Related Repositories

- **Android Native Platform:** [parthivlella-ai/Ai-interview-intelligence-app](https://github.com/parthivlella-ai/Ai-interview-intelligence-app)
- **Web UI & Studio Platform:** [ankemcharan5/stitch-adaptive-interview-intelligence-ui](https://github.com/ankemcharan5/stitch-adaptive-interview-intelligence-ui)

