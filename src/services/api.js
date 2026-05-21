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
    post('generate-brief', { jobTitle: analysis.jobTitle, analysis, scorecard })
}