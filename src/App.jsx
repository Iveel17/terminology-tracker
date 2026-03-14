import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTerminology } from './hooks/useTerminology'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import TermRow from './components/TermRow'

export default function App() {
  const { entries, addTerm, updateTerm, deleteTerm, exportJSON, importJSON } = useTerminology()
  const [filters, setFilters] = useState({ search: '', subject: '', week: '' })
  const [newId, setNewId] = useState(null)

  const filtered = useMemo(() => {
    const { search, subject, week } = filters
    const q = search.toLowerCase()
    return entries.filter((e) => {
      if (subject && e.subject !== subject) return false
      if (week && String(e.week) !== week) return false
      if (q && ![e.term, e.definition, e.example].some((f) => f?.toLowerCase().includes(q))) return false
      return true
    })
  }, [entries, filters])

  const handleAddTerm = () => {
    setFilters({ search: '', subject: '', week: '' })
    const id = addTerm()
    setNewId(id)
  }

  useEffect(() => {
    if (!newId) return
    const el = document.getElementById(`term-${newId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const editable = el.querySelector('[contenteditable]')
      if (editable) editable.focus()
    }
    setNewId(null)
  }, [newId, entries])

  return (
    <div className="app-root">
      <div className="app-inner">
        <Header count={entries.length} onExport={exportJSON} onImport={importJSON} />
        <FilterBar entries={entries} filters={filters} setFilters={setFilters} />

        <div className="table-wrap">
          {/* Table header bar with Add Term button */}
          <div className="table-toolbar">
            <span className="table-toolbar-label">Terms</span>
            <button className="add-term-btn" onClick={handleAddTerm}>
              <span className="add-plus">+</span> Add Term
            </button>
          </div>

          <table className="gloss-table">
            <thead>
              <tr className="table-head-row">
                <th className="th th-subject">Subject</th>
                <th className="th th-term">Terminology</th>
                <th className="th th-def">Definition</th>
                <th className="th th-ex">Example</th>
                <th className="th th-week">Week</th>
                <th className="th th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {entries.length === 0
                      ? 'No terms yet — click "+ Add Term" to get started.'
                      : 'No terms match your filters.'}
                  </td>
                </tr>
              )}
              {filtered.map((entry) => (
                <TermRow
                  key={entry.id}
                  entry={entry}
                  updateTerm={updateTerm}
                  deleteTerm={deleteTerm}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}