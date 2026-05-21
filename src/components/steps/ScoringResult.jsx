export default function ScoringResult({ data }) {
  const passed = data.totalWeightedScore >= data.minimumPassScore

  const recommendationColors = {
    'Strong Yes': 'bg-green-100 text-green-700 border-green-200',
    'Yes': 'bg-blue-100 text-blue-700 border-blue-200',
    'Maybe': 'bg-amber-100 text-amber-700 border-amber-200',
    'No': 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="space-y-4">
      {/* Score header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{data.candidateName}</h3>
          <p className="text-xs text-slate-500">AI Candidate Assessment</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>
            {data.totalWeightedScore}%
          </div>
          <div className="text-xs text-slate-500">
            Min pass: {data.minimumPassScore}%
          </div>
        </div>
      </div>

      {/* Pass/Fail + Recommendation */}
      <div className="flex gap-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {passed ? '✅ Passed' : '❌ Did Not Pass'}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
          recommendationColors[data.recommendation] || 'bg-slate-100 text-slate-600'
        }`}>
          {data.recommendation}
        </span>
      </div>

      {/* Score bar */}
      <div className="w-full bg-slate-100 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-400'}`}
          style={{ width: `${Math.min(data.totalWeightedScore, 100)}%` }}
        />
      </div>

      {/* Summary */}
      <div className="bg-slate-50 rounded-lg p-4">
        <p className="text-sm text-slate-700">{data.summary}</p>
      </div>

      {/* Category breakdown */}
      {data.categoryScores?.map((cat, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-slate-700">{cat.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{cat.weight}% weight</span>
              <span className="text-sm font-bold text-brand-600">{cat.categoryScore}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {cat.criteria?.map((c, j) => (
              <div key={j} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  c.score >= 4 ? 'bg-green-100 text-green-700' :
                  c.score >= 3 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {c.score}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{c.skill}</span>
                    {c.required && <span className="text-xs text-red-400">required</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{c.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-700 mb-2">💪 Strengths</h4>
          <ul className="space-y-1">
            {data.strengths?.map((s, i) => (
              <li key={i} className="text-xs text-green-600">• {s}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-700 mb-2">⚠️ Gaps</h4>
          <ul className="space-y-1">
            {data.gaps?.map((g, i) => (
              <li key={i} className="text-xs text-red-600">• {g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}