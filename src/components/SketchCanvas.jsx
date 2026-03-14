import { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_W = 900
const CANVAS_H = 300

export default function SketchCanvas({ entryId, sketchData, updateTerm }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const [color, setColor] = useState('#00e5cc')
  const [eraser, setEraser] = useState(false)
  const [eraserPos, setEraserPos] = useState(null)

  // Fill white background on mount, then draw sketch on top
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // Always fill white first
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (sketchData) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = sketchData
    }
  }, []) // only on mount

  const saveSketch = useCallback(() => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    updateTerm(entryId, { sketchData: dataUrl }, 400)
  }, [entryId, updateTerm])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const src = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    }
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawing.current = true
    lastPos.current = getPos(e, canvasRef.current)
  }

  const draw = (e) => {
    e.preventDefault()
    const pos = getPos(e, canvasRef.current)
    // Update eraser visual position
    if (eraser) {
      const rect = canvasRef.current.getBoundingClientRect()
      const src = e.touches ? e.touches[0] : e
      setEraserPos({ x: src.clientX - rect.left, y: src.clientY - rect.top })
    }
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    if (eraser) {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 22
    } else {
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
    lastPos.current = pos
  }

  const endDraw = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    drawing.current = false
    lastPos.current = null
    setEraserPos(null)
    saveSketch()
  }

  const handleMouseLeave = (e) => {
    setEraserPos(null)
    endDraw(e)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    updateTerm(entryId, { sketchData: null })
  }

  const COLORS = ['#00e5cc', '#ff4444', '#f5a623', '#7b61ff', '#1a1a1a']

  return (
    <div className="sketch-wrap">
      {/* Toolbar */}
      <div className="sketch-toolbar">
        <div className="color-swatches">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setEraser(false) }}
              className={`swatch ${color === c && !eraser ? 'swatch-active' : ''}`}
              style={{ background: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={e => { setColor(e.target.value); setEraser(false) }}
            className="color-picker"
            title="Custom color"
          />
        </div>

        <button
          onClick={() => setEraser(v => !v)}
          className={`sketch-tool-btn ${eraser ? 'tool-active' : ''}`}
        >
          ◻ Eraser
        </button>

        <button onClick={clearCanvas} className="sketch-tool-btn clear-btn">
          Clear All
        </button>

        <span className="sketch-hint">Draw to illustrate a concept</span>
      </div>

      {/* Canvas container — relative so eraser cursor can overlay */}
      <div className="canvas-container" style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="sketch-canvas"
          style={{ cursor: eraser ? 'none' : 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={handleMouseLeave}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Eraser cursor visual */}
        {eraser && eraserPos && (
          <div
            className="eraser-cursor"
            style={{
              left: eraserPos.x,
              top: eraserPos.y,
            }}
          />
        )}
      </div>
    </div>
  )
}