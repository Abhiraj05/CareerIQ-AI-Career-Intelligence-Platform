import { motion } from 'framer-motion'

export default function Toggle({ on, onClick, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-[#e8e8f0]">{label}</p>}
          {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`relative w-11 h-6 rounded-full border cursor-pointer transition-colors duration-300 flex-shrink-0 ${on ? 'bg-accent border-accent/60' : 'bg-surface2 border-white/[0.07]'
          }`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: on ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
