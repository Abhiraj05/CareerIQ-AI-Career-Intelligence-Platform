import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SKILLS_DATA, APTITUDE_HISTORY, ACTIVITY_LOG } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import ScoreRing from '../../components/ui/ScoreRing'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const statusColor = (s) => (s === 'Completed' || s === 'Done' ? '#38e2c7' : '#fbbf24')

export default function ProgressPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t) }, [])

  const maxBar = Math.max(...APTITUDE_HISTORY.map((d) => d.score))

  return (
    <div>
      <PageHeader title="Progress Tracker" subtitle="Track your performance across all career readiness dimensions." />

      {/* Score Rings */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-3 gap-5 mb-6"
      >
        {[
          { score: 68, label: 'Roadmap Progress', color: '#7c6dfa' },
          { score: 74, label: 'Interview Readiness', color: '#38e2c7' },
          { score: 82, label: 'Aptitude Average', color: '#f97aad' },
        ].map((r) => (
          <motion.div key={r.label} variants={item}>
            <Card className="flex items-center justify-center py-8">
              <ScoreRing score={r.score} size={120} label={r.label} color={r.color} />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Skills + Chart */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Skill Bars */}
        <Card delay={0.2} padding="p-6">
          <h3 className="font-display font-bold text-base mb-6">Skill Proficiency</h3>
          <div className="flex flex-col gap-5">
            {SKILLS_DATA.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-2 text-xs">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted">{s.pct}%</span>
                </div>
                <ProgressBar pct={mounted ? s.pct : 0} color={s.color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Bar Chart */}
        <Card delay={0.3} padding="p-6">
          <h3 className="font-display font-bold text-base mb-6">Aptitude Performance Trend</h3>
          <div className="flex items-end gap-2 h-40">
            {APTITUDE_HISTORY.map((d, i) => {
              const isLast = i === APTITUDE_HISTORY.length - 1
              return (
                <div key={d.month} className="flex flex-col items-center gap-1.5 flex-1">
                  <motion.div
                    className="w-full rounded-t-lg"
                    style={{
                      background: isLast
                        ? 'linear-gradient(180deg, #7c6dfa, #5a4fcf)'
                        : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${isLast ? '#7c6dfa' : 'rgba(255,255,255,0.07)'}`,
                      borderBottom: 'none',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: mounted ? `${(d.score / maxBar) * 120}px` : 0 }}
                    transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: i * 0.08 }}
                  />
                  <span className="text-[10px] text-muted">{d.month}</span>
                  <span className={`text-[10px] font-semibold ${isLast ? 'text-accent' : 'text-muted'}`}>{d.score}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card delay={0.4} padding="p-6">
        <h3 className="font-display font-bold text-base mb-5">Activity Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Activity', 'Category', 'Score', 'Date', 'Status'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_LOG.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium">{row.activity}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-surface2 border border-white/[0.07] rounded-md px-2.5 py-1 text-xs">{row.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-muted text-xs">{row.score}</td>
                  <td className="py-3.5 px-4 text-muted text-xs">{row.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold" style={{ color: statusColor(row.status) }}>
                      {row.status === 'Completed' || row.status === 'Done' ? '✓ ' : '◐ '}{row.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}