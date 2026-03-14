import { useRef, useEffect, useState, useCallback } from 'react'

const CANVAS_W = 600
const CANVAS_H = 280

export default function SketchCanvas({ entryId, sketchData, updateTerm }) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const [color, setColor] = useState('#1a1a1a')
  const [eraser, setEraser] = useState(false)

  // Load existing sketch on mount
  useEffect(() => {
    if (!sketchData) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.src = sketchData
  }, []) // intentionally only on mount

  const saveSketch = useCallback(() => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
    updateTerm(entryId, { sketchData: dataUrl }, 300)
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
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = eraser ? '#ffffff' : color
    ctx.lineWidth = eraser ? 18 : 2.5
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
    saveSketch()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    updateTerm(entryId, { sketchData: null })
  }

  return (
    <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 bg-gray-50">
        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <span>Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => { setColor(e.target.value); setEraser(false) }}
            className="w-6 h-6 rounded cursor-pointer border-0 p-0"
          />
        </label>
        <button
          onClick={() => setEraser((v) => !v)}
          className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
            eraser
              ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Eraser
        </button>
        <button
          onClick={clearCanvas}
          className="px-2 py-1 rounded text-xs font-medium border border-gray-200 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          Clear
        </button>
        <span className="ml-auto text-xs text-gray-400">Draw to sketch a concept</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block w-full touch-none cursor-crosshair"
        style={{ background: '#fff' }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  )
}
