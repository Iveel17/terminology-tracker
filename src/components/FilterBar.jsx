import { useMemo } from 'react'

export default function FilterBar({ entries, filters, setFilters }) {
  const { search, subject, week } = filters

  const subjects = useMemo(() => {
    const s = new Set(entries.map((e) => e.subject).filter(Boolean))
    return [...s].sort()
  }, [entries])

  const weeks = useMemo(() => {
    const w = new Set(entries.map((e) => String(e.week)).filter(Boolean))
    return [...w].sort((a, b) => Number(a) - Number(b))
  }, [entries])

  const activeCount = [search, subject, week].filter(Boolean).length
  const clear = () => setFilters({ search: '', subject: '', week: '' })

  return (
    <div className="filter-bar">
      <div className="filter-search">
        <span className="filter-search-icon">⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search terms, definitions, examples…"
          className="filter-input"
        />
      </div>

      <select
        value={subject}
        onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
        className="filter-select"
      >
        <option value="">All Subjects</option>
        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={week}
        onChange={(e) => setFilters((f) => ({ ...f, week: e.target.value }))}
        className="filter-select"
      >
        <option value="">All Weeks</option>
        {weeks.map((w) => <option key={w} value={w}>Week {w}</option>)}
      </select>

      {activeCount > 0 && (
        <button onClick={clear} className="filter-clear">
          <span className="filter-clear-badge">{activeCount}</span>
          Clear filters
        </button>
      )}
    </div>
  )
}