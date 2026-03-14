import { useRef } from 'react'

export default function Header({ count, onExport, onImport }) {
  const fileRef = useRef(null)

  return (
    <div className="header-wrap">
      <div className="header-top">
        <div>
          <h1 className="header-title">Glossary</h1>
          <p className="header-sub">Define and manage subject terminology, definitions, and examples.</p>
        </div>
        <div className="header-actions">
          <span className="header-count">{count} {count === 1 ? 'term' : 'terms'}</span>
          <button onClick={onExport} className="header-btn">↓ Export</button>
          <button onClick={() => fileRef.current?.click()} className="header-btn">↑ Import</button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
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