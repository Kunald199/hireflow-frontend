import { useState } from 'react'
import { hireflowAPI } from '../services/api'
import LoadingSpinner from './LoadingSpinner'

export default function ResumeUpload({ onParsed }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      if (file.type === 'application/pdf') {
        // Convert PDF to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result.split(',')[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const result = await hireflowAPI.parseResumePDF(base64)
        onParsed(result)
      } else {
        // Plain text file
        const text = await file.text()
        const result = await hireflowAPI.parseResume(text)
        onParsed(result)
      }
    } catch (err) {
      setError('Failed to parse resume. Try a different file.')
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-200 hover:border-brand-300'
        }`}
      >
        {loading ? (
          <LoadingSpinner message="Parsing resume..." />
        ) : (
          <>
            <p className="text-2xl mb-2">📄</p>
            <p className="text-sm font-medium text-slate-600">
              Drop resume here or{' '}
              <label className="text-brand-600 cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </label>
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF or TXT files</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}