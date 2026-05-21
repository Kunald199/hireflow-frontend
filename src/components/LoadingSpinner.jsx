export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  )
}