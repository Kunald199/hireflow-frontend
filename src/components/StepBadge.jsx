export default function StepBadge({ number, label, status }) {
  const styles = {
    complete: 'bg-green-100 text-green-700 border-green-200',
    active: 'bg-brand-100 text-brand-700 border-brand-200 animate-pulse',
    pending: 'bg-slate-100 text-slate-400 border-slate-200'
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${styles[status]}`}>
      <span className="w-4 h-4 rounded-full flex items-center justify-center bg-current bg-opacity-20 text-xs">
        {status === 'complete' ? '✓' : number}
      </span>
      {label}
    </div>
  )
}