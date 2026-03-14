import { useRef, useCallback } from 'react'

export function useEditableField(id, field, updateTerm) {
  const ref = useRef(null)

  const handleBlur = useCallback(() => {
    const text = ref.current?.innerText?.trim() ?? ''
    updateTerm(id, { [field]: text })
  }, [id, field, updateTerm])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      ref.current?.blur()
    }
  }, [])

  return { ref, onBlur: handleBlur, onKeyDown: handleKeyDown }
}
