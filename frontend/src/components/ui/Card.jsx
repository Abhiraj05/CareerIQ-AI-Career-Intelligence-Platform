import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, padding = 'p-6', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -2, boxShadow: '0 0 30px rgba(124,109,250,0.15)' } : {}}
      className={`
        bg-surface border border-white/[0.07] rounded-2xl
        transition-colors duration-300
        ${hover ? 'hover:border-accent/40 cursor-pointer' : ''}
        ${padding} ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
