import { useState } from 'react'

const TABS = ['Screening', 'Technical', 'Behavioral', 'Culture']

export default function QuestionsResult({ data }) {
  const [activeTab, setActiveTab] = useState('Screening')

  const questionMap = {
    Screening: data.screeningQuestions,
    Technical: data.technicalQuestions,
    Behavioral: data.behavioralQuestions,
    Culture: data.cultureQuestions
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {questionMap[activeTab]?.map((q, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4">
            <p className="font-medium text-slate-700 text-sm">{q.question}</p>
            {q.purpose && (
              <p className="text-xs text-slate-500 mt-1">
                <strong>Purpose:</strong> {q.purpose}
              </p>
            )}
            {q.competency && (
              <p className="text-xs text-slate-500 mt-1">
                <strong>Competency:</strong> {q.competency}
              </p>
            )}
            {q.difficulty && (
              <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                q.difficulty === 'Hard' ? 'bg-red-100 text-red-600' :
                q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                {q.difficulty}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}