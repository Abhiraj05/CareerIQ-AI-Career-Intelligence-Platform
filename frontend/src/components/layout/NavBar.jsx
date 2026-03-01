import { useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../ui/Icon'
import { useApp } from '../../context/AppContext'

export default function Navbar({ onMenuToggle }) {
  const { user } = useApp()
  const [search, setSearch] = useState('')

  return (
    <header className="h-16 bg-surface border-b border-white/[0.07] flex items-center px-7 gap-4 justify-between flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-muted hover:text-[#e8e8f0] transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Search */}
        <div className="flex items-center gap-3 bg-surface2 border border-white/[0.07] rounded-xl px-4 py-2.5 w-64 focus-within:border-accent/40 transition-colors duration-300">
          <Icon name="search" size={14} className="text-muted flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            className="bg-transparent border-none outline-none text-[#e8e8f0] text-sm placeholder:text-muted w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative text-muted hover:text-[#e8e8f0] transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <Icon name="bell" size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent3 border-2 border-surface" />
        </motion.button>

        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold cursor-pointer overflow-hidden"
        >
          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || '?')}
        </motion.div>
      </div>
    </header>
  )
}
