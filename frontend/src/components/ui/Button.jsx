import { motion } from 'framer-motion'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  loading = false,
}) {
  const base =
    variant === 'primary'
      ? 'bg-gradient-to-r from-accent to-violet-400 text-white font-display font-semibold'
      : 'bg-transparent text-[#e8e8f0] border border-white/[0.07] font-display font-medium hover:border-accent/60 hover:text-accent hover:bg-accent/5'

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { y: -1, filter: 'brightness(1.1)' } : {}}
      whileTap={!disabled && !loading ? { y: 0 } : {}}
      className={`
        inline-flex items-center justify-center gap-2.5 cursor-pointer
        transition-all duration-300 select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${base} ${sizes[size]} ${className}
        ${variant === 'primary' ? 'shadow-sm hover:shadow-accent-lg' : ''}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
      ) : null}
      {children}
    </motion.button>
  )
}