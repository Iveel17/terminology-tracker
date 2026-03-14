import { useRef } from 'react'

export default function Header({ count, onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Glossary</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define and manage subject terminology, definitions, and examples.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-600 mr-1">{count} {count === 1 ? 'term' : 'terms'}</span>
          <button
            onClick={onExport}
            className="text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5 border border-white/10 rounded-lg hover:border-white/25 transition-colors"
          >
            ↓ Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5 border border-white/10 rounded-lg hover:border-white/25 transition-colors"
          >
            ↑ Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const replace = window.confirm('Replace all existing terms?\nOK = Replace  |  Cancel = Merge')
              onImport(file, replace ? 'replace' : 'merge')
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </div>
  )
}
