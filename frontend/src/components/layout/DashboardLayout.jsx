import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />

        <main className="flex-1 overflow-auto bg-bg px-8 py-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
