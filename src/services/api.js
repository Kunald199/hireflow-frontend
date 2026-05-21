const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function post(endpoint, body) {
  const response = await fetch(`${API_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Something went wrong')
  }

  const data = await response.json()
  return data.data
}

export const hireflowAPI = {
  analyzeJD: (jobDescription) =>
    post('analyze-jd', { jobDescription }),

  generateScorecard: (analysis) =>
    post('generate-scorecard', {
      jobTitle: analysis.jobTitle,
      mustHaveSkills: analysis.mustHaveSkills,
      niceToHaveSkills: analysis.niceToHaveSkills,
      seniorityLevel: analysis.seniorityLevel
    }),

  generateOutreach: (analysis, candidateName, candidateBackground, companyName) =>
    post('generate-outreach', {
      jobTitle: analysis.jobTitle,
      candidateName,
      candidateBackground,
      companyName,
      tone: 'professional but warm'
    }),

  generateQuestions: (analysis) =>
    post('generate-questions', {
      jobTitle: analysis.jobTitle,
      mustHaveSkills: analysis.mustHaveSkills,
      seniorityLevel: analysis.seniorityLevel,
      keyResponsibilities: analysis.keyResponsibilities
    }),

  generateBrief: (analysis, scorecard) =>
    post('generate-brief', { jobTitle: analysis.jobTitle, analysis, scorecard }),

  parseResume: (resumeText) =>
  post('parse-resume', { resumeText }),

    parseResumePDF: (pdfBase64) =>
  post('parse-resume-pdf', { pdfBase64 }),

    scoreCandidate: (scorecard, candidateBackground, candidateName) =>
  post('score-candidate', { scorecard, candidateBackground, candidateName }),
}

export const historyAPI = {
  saveRun: (runData) =>
    post('runs', runData),

  getRuns: async () => {
    const response = await fetch(`${API_URL}/api/runs`)
    if (!response.ok) throw new Error('Failed to fetch runs')
    const data = await response.json()
    return data.data
  },

  getRunById: async (id) => {
    const response = await fetch(`${API_URL}/api/runs/${id}`)
    if (!response.ok) throw new Error('Failed to fetch run')
    const data = await response.json()
    return data.data
  },

  deleteRun: async (id) => {
    const response = await fetch(`${API_URL}/api/runs/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete run')
    return response.json()
  }
}