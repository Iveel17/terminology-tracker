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
    <div className="flex flex-wrap items-center gap-2 py-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search terms, definitions, examples…"
          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
        />
      </div>

      {/* Subject filter */}
      <select
        value={subject}
        onChange={(e) => setFilters((f) => ({ ...f, subject: e.target.value }))}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition text-gray-700"
      >
        <option value="">All Subjects</option>
        {subjects.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Week filter */}
      <select
        value={week}
        onChange={(e) => setFilters((f) => ({ ...f, week: e.target.value }))}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition text-gray-700"
      >
        <option value="">All Weeks</option>
        {weeks.map((w) => (
          <option key={w} value={w}>Week {w}</option>
        ))}
      </select>

      {/* Active badge + clear */}
      {activeCount > 0 && (
        <button
          onClick={clear}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-100 transition"
        >
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
            {activeCount}
          </span>
          Clear filters
        </button>
      )}
    </div>
  )
}
