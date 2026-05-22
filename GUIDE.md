# HireFlow Frontend — Build Guide

A complete record of how this frontend was built, every decision made, and why.

---

## Tech Stack

| Tool            | Reason                              |
| --------------- | ----------------------------------- |
| React + Vite    | Industry standard, fast HMR         |
| Tailwind CSS v3 | Utility-first, no context switching |
| ES Modules      | Modern JS standard                  |

---

## Phase 1 — Setup

### Why Vite over Create React App?

CRA is deprecated. Vite is the current industry standard — faster dev server, faster builds, better HMR.

### Why Tailwind v3 not v4?

Tailwind v4 removed the `init` command and changed configuration significantly. v3 is stable, widely used, and has better documentation for learning.

### Environment variables

`VITE_API_URL` points to the backend. Vite exposes variables prefixed with `VITE_` to the browser via `import.meta.env`. Never hardcode URLs.

---

## Phase 2 — Architecture

### Why api.js is the only file that talks to the backend

All fetch calls live in one place. If the backend URL changes, one file changes. If an endpoint changes, one file changes. This is called the **repository pattern** — components never know where data comes from.

### Why App.jsx owns all state

React state flows down, never up. Putting all state in the top-level component means every piece of data is in one place, easy to debug, easy to reason about. Child components receive data via props and call functions via props.

### Why step components have no logic

`AnalysisResult`, `ScorecardResult` etc. are pure display components. They receive data and render it. Nothing else. This is the **single responsibility principle** — if the display needs to change, you edit the display file. If the data logic needs to change, you edit App.jsx.

### Pipeline chain

Each step's output feeds the next step's input:

analyzeJD(jobDescription)
→ analysis
→ generateScorecard(analysis)
→ scorecard
→ scoreCandidate(scorecard, candidateBackground)

This is why the candidate score is accurate — it uses the same scorecard generated from the actual JD, not a generic rubric.

---

## Phase 3 — Resume Upload

### Why ResumeUpload has its own state

`loading`, `error`, `dragOver` are purely visual — App.jsx doesn't need to know about them. Only the parsed result matters globally. Components own their UI state, App.jsx owns the data state.

### PDF → base64 pattern

Browser `FileReader` converts the PDF to base64. Backend converts base64 back to buffer. This is the standard pattern for sending binary files over JSON REST APIs.

### Auto-fill on parse

When resume parses successfully, `handleResumeParsed()` sets `candidateName`, `candidateBackground`, and `companyName` state. React re-renders the inputs with the values — recruiter doesn't type anything.

---

## Phase 4 — History

### useRef for scroll

`useRef` creates a reference to the history panel DOM element. `scrollIntoView({ behavior: 'smooth' })` scrolls to it. This is the correct React pattern for imperative DOM operations — not state, not effects, just a direct reference.

### Auto-refresh after save

After saving, `historyAPI.getRuns()` is called immediately and `setHistory()` updates the list. The panel opens automatically. No manual refresh needed — instant feedback.

---

## Bugs Hit & Fixed

| Bug                                | Cause                                      | Fix                                           |
| ---------------------------------- | ------------------------------------------ | --------------------------------------------- |
| Tailwind init failed               | Tailwind v4 removed init command           | Installed Tailwind v3 specifically            |
| Duplicate import error             | Copied import line twice                   | Removed duplicate                             |
| History not showing candidate name | `getPipelineRuns` missing column in select | Added `candidate_name` to select              |
| Save not updating history          | No refresh after save                      | Added getRuns() call after successful save    |
| Scroll not working                 | ref not attached to correct div            | Added `ref={historyRef}` to history panel div |
