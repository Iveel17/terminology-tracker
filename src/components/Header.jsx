import { useRef } from 'react'

export default function Header({ count, onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200 mb-2">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Terminology Tracker</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {count === 0 ? 'No terms yet' : `${count} term${count !== 1 ? 's' : ''}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="text-sm font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          ↓ Export
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-sm font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
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
            const replace = window.confirm(
              'Replace all existing terms?\n\nOK = Replace\nCancel = Merge (keep existing + add new)'
            )
            onImport(file, replace ? 'replace' : 'merge')
            e.target.value = ''
          }}
        />
      </div>
    </header>
  )
}
