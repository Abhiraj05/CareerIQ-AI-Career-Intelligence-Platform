import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { SKILLS_DATA, RECENT_ACTIVITY } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import Icon from '../../components/ui/Icon'
import Button from '../../components/ui/Button'

const STATS = [
  { label: 'Roadmap Progress', value: '68%', delta: '+12% this week', icon: 'map', color: '#7c6dfa' },
  { label: 'Interview Readiness', value: '74/100', delta: '+8 since last', icon: 'chat', color: '#38e2c7' },
  { label: 'Resume Score', value: '74/100', delta: 'Updated 2 days ago', icon: 'file', color: '#f97aad' },
  { label: 'Aptitude Average', value: '82%', delta: 'Top 15%', icon: 'trophy', color: '#fbbf24' },
]

const QUICK_ACTIONS = [
  { label: 'Generate Roadmap', to: '/dashboard/roadmap', color: '#7c6dfa' },
  { label: 'Mock Interview', to: '/dashboard/interview', color: '#38e2c7' },
  { label: 'Upload Resume', to: '/dashboard/resume', color: '#f97aad' },
  { label: 'Aptitude Test', to: '/dashboard/aptitude', color: '#fbbf24' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function OverviewPage() {
  const { user } = useApp()
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'User'} 👋`}
        subtitle="Here's a snapshot of your career readiness today."
      />

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6"
      >
        {STATS.map((s) => (
          <motion.div key={s.label} variants={item}>
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 hover:border-accent/30 transition-colors duration-300 hover:-translate-y-0.5 transition-transform">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                style={{ background: `${s.color}18`, borderColor: `${s.color}30`, color: s.color }}
              >
                <Icon name={s.icon} size={18} />
              </div>
              <p className="font-display font-bold text-3xl mb-1">{s.value}</p>
              <p className="text-muted text-xs mb-2">{s.label}</p>
              <p className="text-xs font-semibold" style={{ color: s.color }}>{s.delta}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Skill Snapshot */}
        <Card delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-base">Skill Snapshot</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/progress')}>View All</Button>
          </div>
          <div className="flex flex-col gap-4">
            {SKILLS_DATA.slice(0, 4).map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-2 text-xs">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted">{s.pct}%</span>
                </div>
                <ProgressBar pct={s.pct} color={s.color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card delay={0.3}>
          <h3 className="font-display font-bold text-base mb-5">Recent Activity</h3>
          <div className="flex flex-col divide-y divide-white/[0.05]">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm leading-snug">{a.action}</p>
                  <p className="text-xs text-muted mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card delay={0.4}>
        <h3 className="font-display font-bold text-base mb-5">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map(({ label, to, color }) => (
            <motion.button
              key={label}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              onClick={() => navigate(to)}
              className="px-5 py-2.5 rounded-xl text-sm font-display font-semibold border cursor-pointer transition-all duration-200"
              style={{ background: `${color}10`, borderColor: `${color}25`, color }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  )
}