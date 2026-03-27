import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SKILLS_DATA, APTITUDE_HISTORY, ACTIVITY_LOG } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import ScoreRing from '../../components/ui/ScoreRing'
import axios from 'axios'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const statusColor = (s) => (s === 'Completed' || s === 'Done' ? '#38e2c7' : '#fbbf24')

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
})

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false)
  const [scores, setScores] = useState({
    roadmap_progress: 0,
    aptitude_average: 0,
    interview_readiness: 0,
    skill_proficiency: [],
    performance_trend: [],
    activity_log: []
  })
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])


  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/summary/', authHeader())
        setScores({
          roadmap_progress: res.data.roadmap_progress ?? 0,
          aptitude_average: res.data.aptitude_average ?? 0,
          interview_readiness: res.data.interview_readiness ?? 0,
          skill_proficiency: res.data.skill_proficiency ?? [],
          performance_trend: res.data.performance_trend ?? [],
          activity_log: res.data.activity_log ?? []
        })
      } catch (err) {
        console.error('Failed to fetch progress summary:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const [activeTab, setActiveTab] = useState('aptitude')

  const getIcon = (name, type) => {
    const n = name.toLowerCase()
    if (type === 'aptitude') {
      if (n.includes('logical')) return '🧠'
      if (n.includes('quant')) return '📐'
      if (n.includes('tech')) return '⚙️'
      if (n.includes('verbal')) return '🗣️'
      return '📊'
    }
    if (type === 'technical') {
      if (n.includes('react')) return '⚛️'
      if (n.includes('python')) return '🐍'
      if (n.includes('java')) return '☕'
      if (n.includes('node')) return '🚀'
      return '💻'
    }
    return '🎯'
  }

  const rings = [
    { score: scores.roadmap_progress, label: 'Roadmap Progress', color: '#7c6dfa' },
    { score: scores.interview_readiness, label: 'Interview Readiness', color: '#38e2c7' },
    { score: scores.aptitude_average, label: 'Aptitude Average', color: '#f97aad' },
  ]

  const maxBar = scores.performance_trend.length > 0 
    ? Math.max(...scores.performance_trend.map((d) => d.score), 10) 
    : 100

  return (
    <div className="space-y-8 pb-10">
      <PageHeader title="Performance Analytics" subtitle="A comprehensive overview of your career readiness and technical growth." />

      {}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {rings.map((r) => (
          <motion.div key={r.label} variants={item}>
            <Card className="relative group overflow-hidden border-white/[0.05] hover:border-accent/30 transition-all duration-500" padding="p-6">
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={r.score} size={84} color={r.color} label="" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-1">{r.label}</h4>
                  <div className="h-1 w-12 rounded-full mb-2" style={{ backgroundColor: r.color }} />
                  <p className="text-[10px] text-muted/60 font-medium">Updated just now</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {}
        <Card delay={0.2} padding="p-0" className="lg:col-span-7 bg-surface/40 backdrop-blur-md border border-white/[0.05]">
          <div className="p-7 border-b border-white/[0.05] flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Proficiency Matrix</h3>
              <p className="text-xs text-muted mt-1">Detailed breakdown of your strengths across domains.</p>
            </div>
            <div className="flex bg-surface2/40 p-1 rounded-full border border-white/[0.05]">
              {[
                { id: 'aptitude', label: 'Aptitude' },
                { id: 'technical', label: 'Technical' },
                { id: 'roles', label: 'Roadmap' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all ${
                    activeTab === t.id 
                    ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                    : 'text-muted hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {scores.skill_proficiency[activeTab]?.length > 0 ? (
                scores.skill_proficiency[activeTab].map((s, idx) => (
                  <motion.div
                    key={s.name + idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-surface2/30 border border-white/[0.03] rounded-xl p-4 hover:bg-surface2/50 hover:border-white/[0.1] transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-8 h-8 rounded-lg bg-surface3/50 flex items-center justify-center text-lg">
                        {getIcon(s.name, activeTab)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-display font-bold text-white">{s.pct}%</div>
                        <div className="text-[10px] text-muted uppercase font-bold tracking-tighter">Mastery</div>
                      </div>
                    </div>
                    <h5 className="text-[13px] font-medium text-[#e8e8f0] mb-3 truncate">{s.name}</h5>
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 text-muted/40">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-sm italic font-medium">No {activeTab} insights available yet.</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {}
        <Card delay={0.3} padding="p-7" className="lg:col-span-5 bg-surface/40 backdrop-blur-md border border-white/[0.05]">
          <h3 className="font-display font-bold text-lg text-white mb-2">Growth Velocity</h3>
          <p className="text-xs text-muted mb-8">Performance trajectory over the last 6 months.</p>
          
          <div className="flex items-end gap-3 h-56 px-2">
            {scores.performance_trend.length > 0 ? (
              scores.performance_trend.map((d, i) => {
                const isLast = i === scores.performance_trend.length - 1
                return (
                  <div key={i} className="flex flex-col items-center gap-4 flex-1 h-full justify-end group transition-all duration-300">
                    <div className="relative w-full flex flex-col items-center">
                      <motion.div
                        className="w-full max-w-[32px] rounded-t-lg relative overflow-hidden group/bar"
                        style={{
                          background: isLast ? 'linear-gradient(180deg, #7c6dfa, #fbbf24)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isLast ? '#7c6dfa' : 'rgba(255,255,255,0.08)'}`,
                          borderBottom: 'none',
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: mounted ? `${(d.score / maxBar) * 160}px` : 4 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                      </motion.div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`text-[10px] font-bold tracking-widest ${isLast ? 'text-accent' : 'text-muted'}`}>{d.month}</span>
                      <span className={`text-[9px] font-bold transition-opacity ${isLast ? 'text-accent' : 'text-muted'}`}>{d.score}%</span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted/30 italic text-sm">Waiting for more data points...</div>
            )}
          </div>
        </Card>
      </div>

      {}
      <Card delay={0.4} padding="p-7" className="bg-surface/40 backdrop-blur-md border border-white/[0.05]">
        <h3 className="font-display font-bold text-lg text-white mb-6">Activity Timeline</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-left">
                <th className="py-4 px-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Activity</th>
                <th className="py-4 px-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Result</th>
                <th className="py-4 px-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.activity_log.length > 0 ? (
                scores.activity_log.map((row, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent/40 shadow-[0_0_8px_rgba(124,109,250,0.3)]" />
                        <span className="font-medium text-white/90">{row.action}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-display font-bold text-accent">{row.score || '—'}</span>
                    </td>
                    <td className="py-4 px-4 text-muted/60 text-xs font-medium">
                      {row.time}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-20 text-muted/40 font-medium italic">
                    Your history is currently empty. Start a session to see your progress feed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
