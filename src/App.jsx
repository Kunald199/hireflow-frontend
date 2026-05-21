import { useState } from 'react'
import { hireflowAPI, historyAPI } from './services/api'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import StepBadge from './components/StepBadge'
import ResumeUpload from './components/ResumeUpload'
import AnalysisResult from './components/steps/AnalysisResult'
import ScorecardResult from './components/steps/ScorecardResult'
import OutreachResult from './components/steps/OutreachResult'
import QuestionsResult from './components/steps/QuestionsResult'
import BriefResult from './components/steps/BriefResult'
import ScoringResult from './components/steps/ScoringResult'

const STEPS = [
  { key: 'analysis', label: 'JD Analysis' },
  { key: 'scorecard', label: 'Scorecard' },
  { key: 'scoring', label: 'Candidate Score' },
  { key: 'questions', label: 'Questions' },
  { key: 'outreach', label: 'Outreach' },
  { key: 'brief', label: 'Hiring Brief' }
]

export default function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [candidateBackground, setCandidateBackground] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [resumeParsed, setResumeParsed] = useState(null)

  const [results, setResults] = useState({})
  const [activeStep, setActiveStep] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)

  function getStepStatus(key) {
    if (results[key]) return 'complete'
    if (loading === key) return 'active'
    return 'pending'
  }

function handleResumeParsed(parsed) {
  setResumeParsed(parsed)
  setCandidateName(parsed.name || '')
  setCandidateBackground(parsed.background || '')
  if (parsed.currentCompany && !companyName) {
    setCompanyName(parsed.currentCompany)
  }
}

  async function runPipeline() {
    if (!jobDescription.trim()) return
    setError(null)
    setResults({})
    setHasRun(true)

    try {
      // Step 1 — Analyze JD
      setLoading('analysis')
      const analysis = await hireflowAPI.analyzeJD(jobDescription)
      setResults(r => ({ ...r, analysis }))
      setActiveStep('analysis')

      // Step 2 — Scorecard
      setLoading('scorecard')
      const scorecard = await hireflowAPI.generateScorecard(analysis)
      setResults(r => ({ ...r, scorecard }))

      // Step 3 — AI Candidate Scoring (only if candidate info provided)
      if (candidateBackground.trim()) {
        setLoading('scoring')
        const scoring = await hireflowAPI.scoreCandidate(
          scorecard, candidateBackground, candidateName
        )
        setResults(r => ({ ...r, scoring }))
        setActiveStep('scoring')
      }

      // Step 4 — Questions
      setLoading('questions')
      const questions = await hireflowAPI.generateQuestions(analysis)
      setResults(r => ({ ...r, questions }))

      // Step 5 — Outreach (only if candidate info provided)
      if (candidateBackground.trim()) {
        setLoading('outreach')
        const outreach = await hireflowAPI.generateOutreach(
          analysis, candidateName, candidateBackground, companyName
        )
        setResults(r => ({ ...r, outreach }))
      }

      // Step 6 — Brief
      setLoading('brief')
      const brief = await hireflowAPI.generateBrief(analysis, scorecard)
      setResults(r => ({ ...r, brief }))

      setLoading(null)

    } catch (err) {
      setError(err.message)
      setLoading(null)
    }
  }

  async function saveCurrentRun() {
    if (!results.analysis) return
    setSaving(true)
    try {
      await historyAPI.saveRun({
        jobTitle: results.analysis.jobTitle,
        companyName,
        jobDescription,
        analysis: results.analysis,
        scorecard: results.scorecard,
        questions: results.questions,
        outreach: results.outreach,
        brief: results.brief
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Failed to save run: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  async function loadHistory() {
    setLoadingHistory(true)
    setShowHistory(true)
    try {
      const runs = await historyAPI.getRuns()
      setHistory(runs)
    } catch (err) {
      setError('Failed to load history')
    } finally {
      setLoadingHistory(false)
    }
  }

  async function loadRun(id) {
    setShowHistory(false)
    setError(null)
    setHasRun(true)
    setResults({})
    setActiveStep(null)
    setLoading('analysis')

    try {
      const run = await historyAPI.getRunById(id)
      setResults({
        analysis: run.analysis,
        scorecard: run.scorecard,
        questions: run.questions,
        outreach: run.outreach,
        brief: run.brief
      })
      setJobDescription(run.job_description)
      setCompanyName(run.company_name || '')
      setActiveStep('analysis')
      setLoading(null)
    } catch (err) {
      setError('Failed to load run: ' + err.message)
      setLoading(null)
    }
  }

  async function handleDeleteRun(id) {
    await historyAPI.deleteRun(id)
    setHistory(h => h.filter(r => r.id !== id))
  }

  const resultComponents = {
    analysis: results.analysis && <AnalysisResult data={results.analysis} />,
    scorecard: results.scorecard && <ScorecardResult data={results.scorecard} />,
    scoring: results.scoring && <ScoringResult data={results.scoring} />,
    questions: results.questions && <QuestionsResult data={results.questions} />,
    outreach: results.outreach && <OutreachResult data={results.outreach} />,
    brief: results.brief && <BriefResult data={results.brief} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">🎯 HireFlow</h1>
            <p className="text-xs text-slate-500">AI Recruiting Assistant</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              className="text-sm text-slate-600 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              📋 History
            </button>
            {hasRun && (
              <div className="flex gap-2 flex-wrap">
                {STEPS.map((step, i) => (
                  <StepBadge
                    key={step.key}
                    number={i + 1}
                    label={step.label}
                    status={getStepStatus(step.key)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-800">Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-40 text-sm border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">
              Candidate Resume <span className="font-normal text-slate-400">(optional — for scoring & outreach)</span>
            </h3>

            <ResumeUpload onParsed={handleResumeParsed} />

            {resumeParsed && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 mb-1">✅ Resume Parsed</p>
                <p className="text-sm text-green-800 font-medium">{resumeParsed.name}</p>
                <p className="text-xs text-green-600">{resumeParsed.currentTitle} at {resumeParsed.currentCompany}</p>
                <p className="text-xs text-green-600 mt-1">{resumeParsed.yearsOfExperience} years experience · {resumeParsed.skills?.slice(0, 4).join(', ')}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <input
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                placeholder="Candidate name"
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Your company name"
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <textarea
              value={candidateBackground}
              onChange={e => setCandidateBackground(e.target.value)}
              placeholder="Candidate background auto-fills from resume, or type manually..."
              className="w-full h-20 text-sm border border-slate-200 rounded-lg p-3 resize-none mt-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            onClick={runPipeline}
            disabled={!jobDescription.trim() || loading !== null}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Running Pipeline...' : '🚀 Run HireFlow Pipeline'}
          </button>
        </div>

        {/* Error */}
        {error && <ErrorMessage message={error} onRetry={runPipeline} />}

        {/* Loading */}
        {loading && (
          <LoadingSpinner message={`Running ${STEPS.find(s => s.key === loading)?.label}...`} />
        )}

        {/* Results */}
        {hasRun && !loading && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {STEPS.filter(s => results[s.key]).map(step => (
                <button
                  key={step.key}
                  onClick={() => setActiveStep(step.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeStep === step.key
                      ? 'bg-brand-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {activeStep && resultComponents[activeStep] && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">
                  {STEPS.find(s => s.key === activeStep)?.label}
                </h3>
                {resultComponents[activeStep]}
              </div>
            )}
          </div>
        )}

        {/* Save button */}
        {results.analysis && !loading && (
          <div className="flex justify-end">
            <button
              onClick={saveCurrentRun}
              disabled={saving || saved}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : saved ? '✓ Saved!' : '💾 Save Run'}
            </button>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800">📋 Saved Runs</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                Close
              </button>
            </div>

            {loadingHistory && <LoadingSpinner message="Loading history..." />}

            {!loadingHistory && history.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-8">
                No saved runs yet. Run the pipeline and hit Save.
              </p>
            )}

            {!loadingHistory && history.length > 0 && (
              <div className="space-y-2">
                {history.map(run => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50"
                  >
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => loadRun(run.id)}
                    >
                      <p className="text-sm font-medium text-brand-600 hover:underline">
                        {run.job_title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {run.company_name && `${run.company_name} · `}
                        {new Date(run.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteRun(run.id)}
                      className="text-xs text-red-400 hover:text-red-600 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}