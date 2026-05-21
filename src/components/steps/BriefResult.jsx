export default function BriefResult({ data }) {
  return (
    <div className="space-y-4">
      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-brand-700 mb-1">Executive Summary</h4>
        <p className="text-sm text-slate-700">{data.executiveSummary}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-2">Candidate Persona</h4>
        <p className="text-sm text-slate-600">{data.candidatePersona}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-2">Key Hiring Criteria</h4>
        <ul className="space-y-1">
          {data.keyHiringCriteria?.map((c, i) => (
            <li key={i} className="text-sm text-slate-600 flex gap-2">
              <span className="text-brand-500 font-bold">{i + 1}.</span> {c}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-2">Interview Process</h4>
        <div className="space-y-2">
          {data.interviewProcess?.map((stage, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {stage.stage}
                  <span className="font-normal text-slate-500"> — {stage.duration}</span>
                </p>
                <p className="text-xs text-slate-500">{stage.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500">Time to Hire</p>
          <p className="text-sm font-medium text-slate-700">{data.timeToHireTarget}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500">Compensation</p>
          <p className="text-sm font-medium text-slate-700">{data.compensationContext}</p>
        </div>
      </div>
    </div>
  )
}