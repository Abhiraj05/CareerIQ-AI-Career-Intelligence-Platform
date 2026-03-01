const variants = {
  Easy: 'text-accent2  bg-accent2/10  border-accent2/30',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Hard: 'text-accent3  bg-accent3/10  border-accent3/30',
  default: 'text-muted    bg-white/5     border-white/10',
}

export default function Badge({ label, variant }) {
  const cls = variants[variant] || variants[label] || variants.default
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}
