import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useApp } from '../../context/AppContext'

const SEARCH_OPTIONS = [
  { label: 'Overview Dashboard', path: '/dashboard', icon: 'home', category: 'General', desc: 'Main dashboard with career snapshot' },
  { label: 'Create New Roadmap', path: '/dashboard/roadmap', icon: 'map', category: 'Learning', desc: 'Generate a new AI-powered career path' },
  { label: 'Current Roadmap', path: '/dashboard/roadmap', icon: 'check', category: 'Active', desc: 'Continue your existing learning journey' },
  { label: 'Start Mock Interview', path: '/dashboard/interview', icon: 'chat', category: 'Career', desc: 'Professional AI interview practice' },
  { label: 'Interview History', path: '/dashboard/interview', icon: 'menu', category: 'Career', desc: 'Review your past interview performances' },
  { label: 'Analyze Resume', path: '/dashboard/resume', icon: 'file', category: 'Career', desc: 'Get an ATS score and elite feedback' },
  { label: 'Quantitative Aptitude', path: '/dashboard/aptitude', icon: 'target', category: 'Practice', desc: 'Math and logic-based problem solving' },
  { label: 'Logical Reasoning', path: '/dashboard/aptitude', icon: 'brain', category: 'Practice', desc: 'Improve your analytical thinking' },
  { label: 'Performance Analytics', path: '/dashboard/progress', icon: 'trophy', category: 'Insights', desc: 'Track your growth and skill matrix' },
  { label: 'Activity Timeline', path: '/dashboard/progress', icon: 'map', category: 'Insights', desc: 'Full history of your platform actions' },
  { label: 'Profile Settings', path: '/dashboard/settings', icon: 'menu', category: 'Settings', desc: 'Manage your account and preferences' },
]

export default function Navbar({ onMenuToggle }) {
  const { user } = useApp()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const inputRef = useRef(null)


  const results = search 
    ? SEARCH_OPTIONS.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase()) || 
        opt.category.toLowerCase().includes(search.toLowerCase()) ||
        opt.desc.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : []


  useEffect(() => {
    const handleDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleDown)
    return () => window.removeEventListener('keydown', handleDown)
  }, [])


  useEffect(() => {
     const clickOut = (e) => {
        if (!e.target.closest('.notif-zone')) setShowNotifs(false)
        if (!e.target.closest('.user-zone')) setShowUserMenu(false)
     }
     window.addEventListener('click', clickOut)
     return () => window.removeEventListener('click', clickOut)
  }, [])

  const { logout } = useApp()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-surface border-b border-white/[0.07] flex items-center px-7 gap-4 justify-between flex-shrink-0 relative">
      {}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-muted hover:text-[#e8e8f0] transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <Icon name="menu" size={20} />
        </button>

        {}
        <div className="relative">
          <div className="flex items-center gap-3 bg-surface2 border border-white/[0.07] rounded-xl px-4 py-2.5 w-[320px] focus-within:w-[400px] focus-within:border-accent/40 focus-within:bg-surface/50 transition-all duration-500 ease-in-out">
            <Icon name="search" size={14} className="text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search features, tools, or analytics..."
              className="bg-transparent border-none outline-none text-[#e8e8f0] text-sm placeholder:text-muted/60 w-full"
            />
            <div className="hidden sm:flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
              <span className="text-[10px] text-muted font-bold opacity-40">⌘</span>
              <span className="text-[10px] text-muted font-bold opacity-40">K</span>
            </div>
          </div>

          {}
          <AnimatePresence>
            {showDropdown && search.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 mt-3 w-[400px] bg-[#12121e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-[100] overflow-hidden"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-40 mb-1">
                  Search Results
                </div>
                {results.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {results.map((res) => (
                      <button
                        key={res.label + res.category}
                        onClick={() => {
                          navigate(res.path)
                          setSearch('')
                        }}
                        className="w-full flex items-center gap-4 p-3 hover:bg-white/[0.04] rounded-xl transition-all text-left group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-surface2 border border-white/[0.05] flex items-center justify-center text-muted group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                          <Icon name={res.icon} size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-semibold text-[#e8e8f0] truncate">{res.label}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/5 rounded-md text-muted/80">{res.category}</span>
                          </div>
                          <p className="text-[11px] text-muted/60 truncate leading-none">{res.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <div className="text-2xl mb-3 opacity-20">🔍</div>
                    <p className="text-xs text-muted font-medium italic">No matches found for "{search}"</p>
                  </div>
                )}
                
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-center gap-3">
                   <div className="flex items-center gap-1.5 text-[10px] text-muted/40">
                      <span className="px-1 py-0.5 bg-white/5 rounded border border-white/5 font-bold">↵</span>
                      <span>Navigate</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-[10px] text-muted/40">
                      <span className="px-1 py-0.5 bg-white/5 rounded border border-white/5 font-bold">ESC</span>
                      <span>Dismiss</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {}
      <div className="flex items-center gap-3">
        {}
        <div className="relative notif-zone">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifs(!showNotifs)}
            className={`text-muted hover:text-[#e8e8f0] transition-all p-2 rounded-lg relative ${showNotifs ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <Icon name="bell" size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent3 border-2 border-surface shadow-[0_0_8px_rgba(249,122,173,0.5)]" />
          </motion.button>

          {}
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-80 bg-[#12121e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 z-[100] overflow-hidden"
              >
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm">Notifications</h4>
                    <span className="px-1.5 py-0.5 rounded-md bg-accent3/20 text-accent3 text-[10px] font-bold">New</span>
                  </div>
                  <button className="text-[10px] text-muted hover:text-accent font-bold uppercase tracking-wider transition-colors">Mark all read</button>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { title: 'Goal Achieved! 🏆', text: 'You completed your logic reasoning targets for the week.', time: '2h ago', color: '#fbbf24', icon: 'trophy' },
                    { title: 'Elite Insights Ready', text: 'AI analysis suggests focusing on "System Design" next.', time: '5h ago', color: '#7c6dfa', icon: 'brain' },
                    { title: 'Resume Evaluated', text: 'Your recent upload reached a score of 74/100.', time: '1d ago', color: '#f97aad', icon: 'file' }
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05] transition-all cursor-pointer group/item">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover/item:scale-110" style={{ background: `${n.color}15`, color: n.color }}>
                        <Icon name={n.icon} size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[13px] font-semibold text-white/90 truncate">{n.title}</p>
                          <span className="text-[9px] text-muted/40 font-bold">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 py-2 text-[11px] font-bold text-muted hover:text-white transition-colors border-t border-white/[0.05] pt-4">
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {}
        <div className="relative user-zone">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold cursor-pointer overflow-hidden border border-white/[0.1] shadow-lg shadow-accent/10"
          >
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || '?')}
          </motion.div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-56 bg-[#12121e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-[100] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.05] mb-1">
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-muted truncate">{user?.email || 'm@example.com'}</p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/dashboard/settings')
                    setShowUserMenu(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.04] rounded-xl transition-all text-left group"
                >
                  <Icon name="menu" size={14} className="text-muted group-hover:text-accent" />
                  <span className="text-xs font-medium text-white/80">Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-all text-left group"
                >
                  <Icon name="bolt" size={14} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
