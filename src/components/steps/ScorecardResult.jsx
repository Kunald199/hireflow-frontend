export default function ScorecardResult({ data }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Candidate Scorecard</h3>
        <span className="text-sm text-slate-500">
          Min pass score: <strong>{data.minimumPassScore}%</strong>
        </span>
      </div>

      {data.categories?.map((cat, i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-slate-700">{cat.name}</h4>
            <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">
              {cat.weight}% weight
            </span>
          </div>
          <div className="space-y-2">
            {cat.criteria?.map((c, j) => (
              <div key={j} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.required ? 'bg-red-400' : 'bg-slate-300'}`} />
                  <span className="font-medium text-slate-700">{c.skill}</span>
                  {c.required && <span className="text-xs text-red-500">required</span>}
                </div>
                {c.scoringGuide && (
                  <p className="text-slate-500 text-xs mt-1 ml-4">{c.scoringGuide}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}