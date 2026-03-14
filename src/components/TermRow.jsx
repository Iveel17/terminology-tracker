import { useRef, useEffect, useCallback, useState } from 'react'
import { useEditableField } from '../hooks/useEditableField'
import SketchCanvas from './SketchCanvas'

function EditableSpan({ id, field, value, updateTerm, placeholder, className = '', multiline = false }) {
  const { ref, onBlur, onKeyDown } = useEditableField(id, field, updateTerm)

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value || ''
    }
  }, [value]) // sync external changes

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={onBlur}
      onKeyDown={multiline ? undefined : onKeyDown}
      data-placeholder={placeholder}
      className={`focus:bg-indigo-50 rounded px-0.5 cursor-text ${className}`}
      style={{ display: 'inline-block', minWidth: '2rem' }}
    />
  )
}

export default function TermRow({ entry, updateTerm, deleteTerm }) {
  const { id, term, subject, week, definition, example, sketchData, sketchOpen } = entry
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleSketch = useCallback(() => {
    updateTerm(id, { sketchOpen: !sketchOpen })
  }, [id, sketchOpen, updateTerm])

  const handleDelete = () => {
    if (confirmDelete) {
      deleteTerm(id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row: term + pills + delete */}
      <div className="flex items-start gap-2 flex-wrap">
        <h3 className="text-lg font-bold text-gray-900 flex-1 min-w-0">
          <EditableSpan
            id={id} field="term" value={term} updateTerm={updateTerm}
            placeholder="Term name" className="text-lg font-bold"
          />
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
          {/* Subject pill */}
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2 py-0.5">
            <EditableSpan
              id={id} field="subject" value={subject} updateTerm={updateTerm}
              placeholder="Subject" className="text-xs"
            />
          </span>
          {/* Week badge */}
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
            W<EditableSpan
              id={id} field="week" value={String(week || '')} updateTerm={updateTerm}
              placeholder="0" className="text-xs"
            />
          </span>
          {/* Delete */}
          <button
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to confirm' : 'Delete term'}
            className={`ml-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
              confirmDelete
                ? 'bg-red-500 text-white border-red-500'
                : 'text-gray-400 border-transparent hover:text-red-500 hover:border-red-200 hover:bg-red-50'
            }`}
          >
            {confirmDelete ? '✕ confirm' : '✕'}
          </button>
        </div>
      </div>

      {/* Definition */}
      <div className="mt-2 text-sm text-gray-700">
        <span className="font-medium text-gray-500 text-xs uppercase tracking-wide mr-1">Def</span>
        <EditableSpan
          id={id} field="definition" value={definition} updateTerm={updateTerm}
          placeholder="Write a definition…" multiline className="text-sm text-gray-700"
        />
      </div>

      {/* Example */}
      <div className="mt-1 text-sm italic text-gray-500">
        <span className="font-medium text-gray-400 text-xs uppercase tracking-wide not-italic mr-1">Ex</span>
        <EditableSpan
          id={id} field="example" value={example} updateTerm={updateTerm}
          placeholder="Write an example…" multiline className="text-sm italic text-gray-500"
        />
      </div>

      {/* Draw toggle */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={toggleSketch}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            sketchOpen
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
          }`}
        >
          ✏️ Draw
          {sketchData && !sketchOpen && (
            <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" title="Has sketch" />
          )}
        </button>
      </div>

      {/* Canvas */}
      {sketchOpen && (
        <SketchCanvas
          entryId={id}
          sketchData={sketchData}
          updateTerm={updateTerm}
        />
      )}
    </div>
  )
}
