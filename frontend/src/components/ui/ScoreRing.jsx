import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ScoreRing({ score, max = 100, size = 120, label, color = '#7c6dfa' }) {
  const r = size / 2 - 10
  const circ = 2 * Math.PI * r
  const [offset, setOffset] = useState(circ)

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / max) * circ), 300)
    return () => clearTimeout(t)
  }, [score, max, circ])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display font-bold leading-none"
            style={{ fontSize: size * 0.22 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-muted" style={{ fontSize: size * 0.1 }}>/{max}</span>
        </div>
      </div>
      {label && <span className="text-xs text-muted text-center">{label}</span>}
    </div>
  )
}
