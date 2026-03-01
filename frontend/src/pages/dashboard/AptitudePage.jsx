import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APTITUDE_QUESTIONS } from '../../data/mockData'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import ScoreRing from '../../components/ui/ScoreRing'

const CATEGORIES = [
  { id: 'Quant', label: 'Quantitative', desc: 'Arithmetic, Percentages, Time & Work', color: '#fbbf24' },
  { id: 'Logical', label: 'Logical', desc: 'Patterns, Syllogisms, Sequences', color: '#7c6dfa' },
  { id: 'Verbal', label: 'Verbal', desc: 'Synonyms, Antonyms, Comprehension', color: '#38e2c7' },
]

export default function AptitudePage() {
  const [category, setCategory] = useState(null)
  const [started, setStarted] = useState(false)
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = category ? APTITUDE_QUESTIONS[category] : []
  const q = questions[qIdx]

  const startTest = () => {
    setStarted(true); setQIdx(0); setSelected(null)
    setSubmitted(false); setScore(0); setFinished(false)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === q.ans) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setFinished(true)
    }
  }

  const reset = () => { setStarted(false); setCategory(null); setFinished(false) }

  const optionClass = (i) => {
    if (!submitted) return `q-option${selected === i ? ' q-option-selected' : ''}`
    if (i === q.ans) return 'q-option q-option-correct'
    if (i === selected) return 'q-option q-option-wrong'
    return 'q-option opacity-40'
  }

  // ── Category Select Screen ──
  if (!started) return (
    <div>
      <PageHeader title="Aptitude Practice" subtitle="Test and sharpen your reasoning skills across key domains." />
      <div className="max-w-xl">
        <Card padding="p-7">
          <h3 className="font-display font-bold text-lg mb-5">Select Category</h3>
          <div className="flex flex-col gap-3 mb-7">
            {CATEGORIES.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ x: 4 }}
                onClick={() => setCategory(c.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${category === c.id ? 'border-current bg-opacity-10' : 'border-white/[0.07] hover:border-white/20'
                  }`}
                style={category === c.id ? { borderColor: c.color, background: `${c.color}10`, color: c.color } : {}}
              >
                <p className={`font-display font-semibold text-sm mb-1 ${category === c.id ? '' : 'text-[#e8e8f0]'}`}>{c.label}</p>
                <p className="text-xs text-muted">{c.desc}</p>
              </motion.div>
            ))}
          </div>
          <Button onClick={startTest} disabled={!category} className="w-full justify-center">
            Start Test — {category ? questions.length : 0} Questions
          </Button>
        </Card>
      </div>
    </div>
  )

  // ── Finished Screen ──
  if (finished) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-5xl mb-8"
        >🎉</motion.div>
        <ScoreRing score={Math.round((score / questions.length) * 100)} size={160} label="Final Score" />
        <h2 className="font-display font-bold text-2xl mt-8 mb-2">
          {score === questions.length ? 'Perfect Score!' : score >= questions.length / 2 ? 'Well Done!' : 'Keep Practicing!'}
        </h2>
        <p className="text-muted mb-8">
          You got {score} out of {questions.length} correct in {category} reasoning.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={startTest}>Try Again</Button>
          <Button variant="ghost" onClick={reset}>Change Category</Button>
        </div>
      </motion.div>
    </div>
  )

  // ── Quiz Screen ──
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title={`${category} Aptitude`} subtitle={null} />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">Question {qIdx + 1} of {questions.length}</span>
          <div className="w-32">
            <ProgressBar pct={((qIdx + 1) / questions.length) * 100} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={qIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card padding="p-7">
              <p className="text-base font-medium leading-relaxed mb-7">{q?.q}</p>

              <div className="flex flex-col gap-2.5 mb-7">
                {q?.opts.map((opt, i) => (
                  <motion.div
                    key={i}
                    whileHover={!submitted ? { x: 4 } : {}}
                    onClick={() => !submitted && setSelected(i)}
                    className={optionClass(i)}
                  >
                    <span className="text-muted font-bold text-xs mr-3">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </motion.div>
                ))}
              </div>

              {submitted ? (
                <div className="flex items-center gap-3">
                  <div className={`flex-1 p-3.5 rounded-xl text-sm border ${selected === q.ans
                      ? 'bg-accent2/10 border-accent2/30 text-accent2'
                      : 'bg-accent3/10 border-accent3/30 text-accent3'
                    }`}>
                    {selected === q.ans
                      ? '✓ Correct! Well done.'
                      : `✗ Incorrect. Correct answer: ${q.opts[q.ans]}`}
                  </div>
                  <Button onClick={handleNext}>
                    {qIdx < questions.length - 1 ? 'Next' : 'View Results'}
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSubmit} disabled={selected === null}>
                  Submit Answer
                </Button>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}