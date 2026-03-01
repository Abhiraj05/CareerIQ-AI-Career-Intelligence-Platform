import { motion } from 'framer-motion'

export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-4 h-4 border', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-2' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <motion.div
        className={`${sizes[size]} border-white/10 border-t-accent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      {text && <p className="text-sm text-muted">{text}</p>}
    </div>
  )
}
