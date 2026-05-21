import { useState } from 'react'
import { hireflowAPI } from './services/api'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import StepBadge from './components/StepBadge'
import AnalysisResult from './components/steps/AnalysisResult'
import ScorecardResult from './components/steps/ScorecardResult'
import OutreachResult from './components/steps/OutreachResult'
import QuestionsResult from './components/steps/QuestionsResult'
import BriefResult from './components/steps/BriefResult'

const STEPS = [
  { key: 'analysis', label: 'JD Analysis' },
  { key: 'scorecard', label: 'Scorecard' },
  { key: 'questions', label: 'Questions' },
  { key: 'outreach', label: 'Outreach' },
  { key: 'brief', label: 'Hiring Brief' }
]

export default function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [candidateBackground, setCandidateBackground] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [results, setResults] = useState({})
  const [activeStep, setActiveStep] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [hasRun, setHasRun] = useState(false)

  function getStepStatus(key) {
    if (results[key]) return 'complete'
    if (loading === key) return 'active'
    return 'pending'
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

      // Step 3 — Questions
      setLoading('questions')
      const questions = await hireflowAPI.generateQuestions(analysis)
      setResults(r => ({ ...r, questions }))

      // Step 4 — Outreach (only if candidate info provided)
      if (candidateBackground.trim()) {
        setLoading('outreach')
        const outreach = await hireflowAPI.generateOutreach(
          analysis, candidateName, candidateBackground, companyName
        )
        setResults(r => ({ ...r, outreach }))
      }

      // Step 5 — Brief
      setLoading('brief')
      const brief = await hireflowAPI.generateBrief(analysis, scorecard)
      setResults(r => ({ ...r, brief }))

      setLoading(null)

    } catch (err) {
      setError(err.message)
      setLoading(null)
    }
  }

  const resultComponents = {
    analysis: results.analysis && <AnalysisResult data={results.analysis} />,
    scorecard: results.scorecard && <ScorecardResult data={results.scorecard} />,
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
            <h1 className="text-xl font-bold text-slate-800">
              🎯 HireFlow
            </h1>
            <p className="text-xs text-slate-500">AI Recruiting Assistant</p>
          </div>
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
              Candidate Info <span className="font-normal text-slate-400">(optional — for outreach)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              placeholder="Brief candidate background e.g. 4 years React at Stripe, open source contributor..."
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
            {/* Step tabs */}
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

            {/* Active result */}
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
      </main>
    </div>
  )
}