import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../ui/Icon'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
  { to: '/dashboard/roadmap', label: 'Generate Roadmap', icon: 'map' },
  { to: '/dashboard/interview', label: 'Interview Prep', icon: 'chat' },
  { to: '/dashboard/resume', label: 'Resume Analyzer', icon: 'file' },
  { to: '/dashboard/aptitude', label: 'Aptitude Practice', icon: 'brain' },
  { to: '/dashboard/progress', label: 'Progress Tracker', icon: 'chart' },
  { to: '/dashboard/settings', label: 'Settings', icon: 'gear' },
]

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 68 },
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user } = useApp()

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 flex flex-col bg-surface border-r border-white/[0.07] overflow-hidden z-50"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 mb-2">
        <div className="w-9 h-9 min-w-[36px] rounded-[10px] bg-gradient-to-br from-accent to-violet-400 flex items-center justify-center text-base flex-shrink-0">
          ⚡
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-display font-extrabold text-lg tracking-tight whitespace-nowrap gradient-text"
            >
              CareerIQ
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : ''}`
            }
          >
            <Icon name={item.icon} size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.07] p-3 mt-2">
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || '?')}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-semibold leading-tight whitespace-nowrap">{user?.name || 'Loading...'}</p>
                <p className="text-xs text-muted whitespace-nowrap">{user?.plan || 'Free'} Plan</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
