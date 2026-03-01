import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TagInput({ tags, setTags, placeholder = 'Add tag and press Enter...' }) {
  const [input, setInput] = useState('')

  const addTag = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()])
      }
      setInput('')
    }
  }

  const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx))

  return (
    <div className="flex flex-wrap gap-2 items-center min-h-[48px] bg-surface2 border border-white/[0.07] rounded-xl px-3 py-2 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-all duration-300">
      <AnimatePresence>
        {tags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="tag"
            onClick={() => removeTag(i)}
          >
            {tag}
            <span className="opacity-50 text-sm leading-none">×</span>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={addTag}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none text-[#e8e8f0] text-sm placeholder:text-muted min-w-[140px] flex-1"
      />
    </div>
  )
}
