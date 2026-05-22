# HireFlow Frontend

React frontend for HireFlow — an AI-powered recruiting assistant that automates the entire hiring workflow from job description to candidate evaluation.

---

## What It Does

Paste a job description, upload a candidate resume, and HireFlow runs a 6-step AI pipeline:

- Extracts and structures the job requirements
- Builds a weighted candidate scorecard
- AI-scores the candidate against the scorecard
- Generates tailored interview questions
- Writes personalized LinkedIn and email outreach
- Produces a hiring manager brief

Results are saved to a database and can be retrieved anytime from history.

---

## Tech Stack

| Tool                 | Purpose                |
| -------------------- | ---------------------- |
| React + Vite         | Frontend framework     |
| Tailwind CSS v3      | Styling                |
| Supabase             | Database (via backend) |
| Groq + Llama 3.3 70b | AI (via backend)       |

---

## Project Structure

src/
├── App.jsx → Main app, all state and logic
├── services/
│ └── api.js → All backend communication
└── components/
├── LoadingSpinner.jsx
├── ErrorMessage.jsx
├── StepBadge.jsx
├── ResumeUpload.jsx
└── steps/
├── AnalysisResult.jsx
├── ScorecardResult.jsx
├── ScoringResult.jsx
├── QuestionsResult.jsx
├── OutreachResult.jsx
└── BriefResult.jsx

---

## Local Setup

### Prerequisites

- Node.js 18+
- [HireFlow Backend](https://github.com/YOUR_USERNAME/hireflow-backend) running on port 3001

### Install

```bash
git clone https://github.com/YOUR_USERNAME/hireflow-frontend
cd hireflow-frontend
npm install
```

### Environment Variables

Create `.env`:

VITE_API_URL=http://localhost:3001

### Run

```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## Architecture

**`api.js` is the only file that knows the backend exists.**
Every component talks to `api.js`, never directly to the backend. If the backend URL changes, one file changes.

**`App.jsx` owns all state and logic.**
Every piece of data, every function, every decision lives here. Child components only receive props and display data — they have no logic of their own.

**Step components are pure display.**
`AnalysisResult`, `ScorecardResult` etc. receive data as props and render it. They don't fetch, don't store, don't decide anything.

**`ResumeUpload` manages its own UI state.**
Loading, error, drag state are internal to the component. When parsing succeeds it calls `onParsed()` — a function passed down from App.jsx — to update the global state.

---

## Key Features

**Resume Parser**
Upload a PDF resume → backend extracts text with pdfjs-dist → Groq structures the data → candidate fields auto-fill instantly.

**AI Pipeline**
6 sequential AI calls where each step's output feeds the next. The scorecard generated from the JD is the same scorecard used to score the candidate.

**Save & History**
Results saved to Supabase with candidate name, company, and date. Click any saved run to restore the full pipeline output.

---

## Related

- [HireFlow Backend](https://github.com/Kunald199/hireflow-backend)
