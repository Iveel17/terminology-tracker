import { useCallback, useState } from 'react'
import SketchCanvas from './SketchCanvas'

// Reliable controlled input for single-line fields (subject, term, week)
function InlineInput({ id, field, value, updateTerm, placeholder, className = '' }) {
  const [local, setLocal] = useState(value || '')

  const handleChange = (e) => setLocal(e.target.value)

  const commit = () => {
    const trimmed = local.trim()
    if (trimmed !== (value || '').trim()) {
      updateTerm(id, { [field]: trimmed })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur()
  }

  return (
    <input
      type="text"
      value={local}
      onChange={handleChange}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`inline-input ${className}`}
    />
  )
}

// Multiline contentEditable — only used for definition & example in expanded panel
function MultilineEditable({ id, field, value, updateTerm, placeholder, className = '' }) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={e => {
        const text = e.currentTarget.innerText.trim()
        if (text !== (value || '').trim()) updateTerm(id, { [field]: text })
      }}
      data-placeholder={placeholder}
      className={`editable-cell multiline ${className}`}
      ref={el => {
        if (el && !el.dataset.init) {
          el.innerText = value || ''
          el.dataset.init = '1'
        }
      }}
    />
  )
}

export default function TermRow({ entry, updateTerm, deleteTerm }) {
  const { id, term, subject, week, definition, example, sketchData, sketchOpen } = entry
  const [expanded, setExpanded] = useState(false)
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
    <>
      {/* Main table row */}
      <tr className={`term-row ${expanded ? 'row-expanded' : ''}`}>

        {/* Subject */}
        <td className="cell cell-subject">
          <InlineInput
            id={id} field="subject" value={subject} updateTerm={updateTerm}
            placeholder="Subject" className="input-subject"
          />
        </td>

        {/* Term */}
        <td className="cell cell-term">
          <InlineInput
            id={id} field="term" value={term} updateTerm={updateTerm}
            placeholder="Term" className="input-term"
          />
        </td>

        {/* Definition truncated — read-only preview */}
        <td className="cell cell-def">
          <span className="truncate-text def-font">
            {definition || <span className="placeholder-text">Definition…</span>}
          </span>
        </td>

        {/* Example truncated — read-only preview */}
        <td className="cell cell-ex">
          <span className="truncate-text">
            {example || <span className="placeholder-text">Example…</span>}
          </span>
        </td>

        {/* Week */}
        <td className="cell cell-week">
          <span className="week-badge">
            W<InlineInput
              id={id} field="week" value={String(week || '')} updateTerm={updateTerm}
              placeholder="—" className="input-week"
            />
          </span>
        </td>

        {/* Actions */}
        <td className="cell cell-actions">
          <div className="actions-group">
            <button
              onClick={() => setExpanded(v => !v)}
              className={`action-btn expand-btn ${expanded ? 'active' : ''}`}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '▲' : '▼'}
            </button>
            <button
              onClick={handleDelete}
              className={`action-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
              title={confirmDelete ? 'Click again to confirm delete' : 'Delete'}
            >
              {confirmDelete ? '✕!' : '✕'}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded row */}
      {expanded && (
        <tr className="expanded-row">
          <td colSpan={6}>
            <div className="expanded-content">

              {/* Full definition */}
              <div className="expand-section">
                <div className="expand-label">DEFINITION</div>
                <div className="expand-editable">
                  <MultilineEditable
                    id={id} field="definition" value={definition} updateTerm={updateTerm}
                    placeholder="Write a full definition…" className="def-font"
                  />
                </div>
              </div>

              {/* Full example */}
              <div className="expand-section">
                <div className="expand-label">EXAMPLE</div>
                <div className="expand-editable">
                  <MultilineEditable
                    id={id} field="example" value={example} updateTerm={updateTerm}
                    placeholder="Write a full example…"
                  />
                </div>
              </div>

              {/* Sketch toggle */}
              <div className="sketch-toggle-row">
                <button onClick={toggleSketch} className={`sketch-btn ${sketchOpen ? 'open' : ''}`}>
                  ✏ {sketchOpen ? 'Hide Drawing' : 'Add Drawing'}
                  {sketchData && !sketchOpen && <span className="sketch-dot" />}
                </button>
              </div>

              {sketchOpen && (
                <SketchCanvas entryId={id} sketchData={sketchData} updateTerm={updateTerm} />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}