import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useApp } from '../../context/AppContext'
import { SKILLS_DATA, RECENT_ACTIVITY } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import Icon from '../../components/ui/Icon'
import Button from '../../components/ui/Button'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
})

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
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/progress/summary/', authHeader())
        setData(res.data)
      } catch (err) {
        console.error('Overview data fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const stats = [
    { label: 'Roadmap Progress', value: `${data?.roadmap_progress || 0}%`, delta: '+12% this week', icon: 'map', color: '#7c6dfa' },
    { label: 'Interview Readiness', value: `${data?.interview_readiness || 0}/100`, delta: '+8 since last', icon: 'chat', color: '#38e2c7' },
    { label: 'Resume Score', value: `${data?.resume_score || 0}/100`, delta: 'Updated recently', icon: 'file', color: '#f97aad' },
    { label: 'Aptitude Average', value: `${data?.aptitude_average || 0}%`, delta: 'Personal Best', icon: 'trophy', color: '#fbbf24' },
  ]

  const skills = [
    ...(data?.skill_proficiency?.technical || []),
    ...(data?.skill_proficiency?.roles || []),
    ...(data?.skill_proficiency?.aptitude || [])
  ]

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0] || 'User'} 👋`}
        subtitle="Here's a snapshot of your career readiness today."
      />

      {}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6"
      >
        {stats.map((s) => (
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

      {}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {}
        <Card delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-base">Skill Snapshot</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/progress')}>View All</Button>
          </div>
          <div className="flex flex-col gap-4">
            {skills.slice(0, 4).map((s) => (
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

        {}
        <Card delay={0.3}>
          <div className="flex items-center gap-2 mb-5">
            <h3 className="font-display font-bold text-base">AI Learning Insights</h3>
            <div className="px-2 py-0.5 rounded text-[10px] bg-accent/10 text-accent font-bold uppercase tracking-wider">Beta</div>
          </div>
          <div className="flex flex-col gap-4">
            {(data?.insights || []).map((insight, i) => (
              <div key={i} className="bg-white/5 border border-white/[0.03] rounded-2xl p-4 flex gap-4 items-start hover:border-white/10 transition-colors">
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${insight.color}15`, color: insight.color }}>
                  <Icon name={insight.icon} size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">{insight.tag}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {}
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
