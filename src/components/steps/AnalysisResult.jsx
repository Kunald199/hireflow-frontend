export default function AnalysisResult({ data }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-2xl font-bold text-slate-800">{data.jobTitle}</span>
        <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-medium">
          {data.seniorityLevel}
        </span>
        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-sm">
          {data.department}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkillList title="Must Have" skills={data.mustHaveSkills} color="red" />
        <SkillList title="Nice to Have" skills={data.niceToHaveSkills} color="blue" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-600 mb-2">Key Responsibilities</h4>
        <ul className="space-y-1">
          {data.keyResponsibilities?.map((r, i) => (
            <li key={i} className="text-sm text-slate-600 flex gap-2">
              <span className="text-brand-500">→</span> {r}
            </li>
          ))}
        </ul>
      </div>

      {data.redFlags?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-amber-700 mb-1">⚠️ Red Flags</h4>
          {data.redFlags.map((flag, i) => (
            <p key={i} className="text-sm text-amber-600">{flag}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function SkillList({ title, skills, color }) {
  const colors = {
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700'
  }
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-600 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {skills?.map((skill, i) => (
          <span key={i} className={`px-2 py-1 rounded text-xs font-medium ${colors[color]}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}