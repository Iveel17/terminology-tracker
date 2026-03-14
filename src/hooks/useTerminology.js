import { useState, useCallback } from 'react'

const STORAGE_KEY = 'terminology_entries'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

let debounceTimers = {}

export function useTerminology() {
  const [entries, setEntries] = useState(load)

  const persist = useCallback((next) => {
    setEntries(next)
    save(next)
  }, [])

  const addTerm = useCallback(() => {
    const newEntry = {
      id: crypto.randomUUID(),
      term: '',
      subject: '',
      week: '',
      definition: '',
      example: '',
      sketchData: null,
      sketchOpen: false,
      createdAt: new Date().toISOString(),
    }
    persist((prev) => [newEntry, ...prev])
    return newEntry.id
  }, [persist])

  const updateTerm = useCallback((id, patch, debounceMs = 0) => {
    if (debounceMs > 0) {
      clearTimeout(debounceTimers[id])
      debounceTimers[id] = setTimeout(() => {
        setEntries((prev) => {
          const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
          save(next)
          return next
        })
      }, debounceMs)
    } else {
      setEntries((prev) => {
        const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
        save(next)
        return next
      })
    }
  }, [])

  const deleteTerm = useCallback((id) => {
    persist((prev) => prev.filter((e) => e.id !== id))
  }, [persist])

  const exportJSON = useCallback(() => {
    const data = JSON.stringify(load(), null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terminology_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const importJSON = useCallback((file, mode = 'merge') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        if (!Array.isArray(imported)) throw new Error('Invalid format')
        if (mode === 'replace') {
          persist(imported)
        } else {
          setEntries((prev) => {
            const existingIds = new Set(prev.map((x) => x.id))
            const merged = [...imported.filter((x) => !existingIds.has(x.id)), ...prev]
            save(merged)
            return merged
          })
        }
      } catch {
        alert('Import failed — file may be corrupted or wrong format.')
      }
    }
    reader.readAsText(file)
  }, [persist])

  return { entries, addTerm, updateTerm, deleteTerm, exportJSON, importJSON }
}
