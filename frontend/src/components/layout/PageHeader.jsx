import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start justify-between mb-8"
    >
      <div>
        <h1 className="font-display font-bold text-2xl tracking-tight text-[#e8e8f0] mb-1.5">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  )
}
