import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ProgressBar({ pct, color = '#7c6dfa', animated = true, height = 'h-1.5' }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (animated) {
      const t = setTimeout(() => setWidth(pct), 200)
      return () => clearTimeout(t)
    } else {
      setWidth(pct)
    }
  }, [pct, animated])

  return (
    <div className={`bg-surface2 rounded-full ${height} overflow-hidden w-full`}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      />
    </div>
  )
}
