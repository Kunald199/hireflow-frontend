import { useState } from 'react'

export default function OutreachResult({ data }) {
  const [copied, setCopied] = useState(null)

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <OutreachCard
        title="LinkedIn DM"
        icon="💼"
        content={data.linkedinDM?.message}
        subject={data.linkedinDM?.subject}
        onCopy={() => copy(data.linkedinDM?.message, 'linkedin')}
        copied={copied === 'linkedin'}
      />
      <OutreachCard
        title="Email"
        icon="📧"
        content={data.email?.body}
        subject={data.email?.subject}
        onCopy={() => copy(data.email?.body, 'email')}
        copied={copied === 'email'}
      />
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-600 mb-2">
          🎯 Personalization Hooks
        </h4>
        <ul className="space-y-1">
          {data.personalizedHooks?.map((hook, i) => (
            <li key={i} className="text-sm text-slate-600 flex gap-2">
              <span className="text-brand-500">•</span> {hook}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function OutreachCard({ title, icon, content, subject, onCopy, copied }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-slate-700">{icon} {title}</h4>
        <button
          onClick={onCopy}
          className="text-xs text-brand-600 hover:text-brand-800 font-medium"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      {subject && (
        <p className="text-xs text-slate-500 mb-2">
          <strong>Subject:</strong> {subject}
        </p>
      )}
      <p className="text-sm text-slate-600 whitespace-pre-wrap">{content}</p>
    </div>
  )
}