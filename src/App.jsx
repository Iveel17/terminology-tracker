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
    // Clear filters so new entry is visible at top
    setFilters({ search: '', subject: '', week: '' })
    const id = addTerm()
    setNewId(id)
  }

  // Scroll to newly added entry
  useEffect(() => {
    if (!newId) return
    const el = document.getElementById(`term-${newId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Focus the term field
      const firstEditable = el.querySelector('[contenteditable]')
      if (firstEditable) firstEditable.focus()
    }
    setNewId(null)
  }, [newId, entries])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <Header
          count={entries.length}
          onExport={exportJSON}
          onImport={importJSON}
        />
        <FilterBar
          entries={entries}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Add Term button */}
        <div className="my-3">
          <button
            onClick={handleAddTerm}
            className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            <span className="text-lg leading-none">+</span> Add Term
          </button>
        </div>

        {/* Entry list */}
        <div className="flex flex-col gap-3 mt-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              {entries.length === 0
                ? 'No terms yet — click "+ Add Term" to get started.'
                : 'No terms match your filters.'}
            </div>
          )}
          {filtered.map((entry) => (
            <div key={entry.id} id={`term-${entry.id}`}>
              <TermRow
                entry={entry}
                updateTerm={updateTerm}
                deleteTerm={deleteTerm}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
