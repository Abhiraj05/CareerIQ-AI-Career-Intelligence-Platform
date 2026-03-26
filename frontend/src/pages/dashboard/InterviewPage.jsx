import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageHeader from "../../components/layout/PageHeader"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import FormInput, { FormSelect } from "../../components/ui/FormInput"
import TagInput from "../../components/ui/TagInput"
import Badge from "../../components/ui/Badge"
import Icon from "../../components/ui/Icon"
import Loader from "../../components/ui/Loader"
import HistoryDrawer from "../../components/ui/HistoryDrawer"
import axios from "axios"

const COMPANY_TYPES = ["Startup", "Mid-size", "FAANG", "Fortune 500", "Consulting Firm"]
const EXP_LEVELS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"]
const api = axios.create({ baseURL: "http://127.0.0.1:8000/api" })
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })

export default function InterviewPage() {
  const [form, setForm] = useState({ target_role: "Senior Frontend Developer", company: "FAANG", experience_level: "3-5 years" })
  const [stack, setStack] = useState(["React", "TypeScript", "Node.js"])
  const [loading, setLoading] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [generated, setGenerated] = useState(false)
  const [activeQ, setActiveQ] = useState(null)
  const [interviewQuestions, setInterviewQuestions] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [reviewed, setReviewed] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyItems, setHistoryItems] = useState([])
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const res = await api.get("/interview/get_latest/", authHeader())
        if (res.data.session_id && res.data.interview_questions?.length) {
          setSessionId(res.data.session_id)
          setInterviewQuestions(res.data.interview_questions)
          setReviewed(res.data.reviewed_questions || [])
          setForm(f => ({ ...f, target_role: res.data.target_role || f.target_role, company: res.data.company || f.company, experience_level: res.data.experience_level || f.experience_level }))
          setStack(res.data.tech_stack || [])
          setGenerated(true)
        }
      } catch (e) { console.log(e) }
      finally { setLoadingExisting(false) }
    }
    loadLatest()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await api.get("/interview/history/", authHeader())
      setHistoryItems(res.data.history || [])
    } catch(e) { console.log(e) }
    setHistoryOpen(true)
  }

  const loadSession = async (item) => {
    try {
      const res = await api.get(`/interview/session/${item.id}/`, authHeader())
      setSessionId(res.data.session_id)
      setInterviewQuestions(res.data.interview_questions || [])
      setReviewed(res.data.reviewed_questions || [])
      setForm(f => ({ ...f, target_role: res.data.target_role, company: res.data.company, experience_level: res.data.experience_level }))
      setStack(res.data.tech_stack || [])
      setGenerated(true)
    } catch(e) { console.log(e) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setGenerated(false)
      setLoading(true)
      const res = await api.post("/interview/generate_qns/", { ...form, tech_stack: stack }, authHeader())
      setInterviewQuestions(res.data.interview_questions || [])
      setSessionId(res.data.session_id)
      setReviewed([])
      setGenerated(true)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
      alert("Failed to generate questions.")
    }
  }

  const toggleReviewed = async (idx) => {
    const next = reviewed.includes(idx) ? reviewed.filter(i => i !== idx) : [...reviewed, idx]
    setReviewed(next)
    try {
      await api.post("/interview/mark_reviewed/", { session_id: sessionId, question_index: idx }, authHeader())
    } catch(e) { console.error(e) }
  }

  const reviewedPct = interviewQuestions.length > 0 ? Math.round((reviewed.length / interviewQuestions.length) * 100) : 0

  if (loadingExisting) return <div className="flex items-center justify-center h-64"><Loader text="Loading your interview session..." /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <PageHeader title="Interview Prep" subtitle="Generate a tailored interview plan based on your target role and company." />
        <button
          onClick={loadHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] text-sm text-muted hover:text-white transition-all"
        >
          <Icon name="menu" size={14} /> History
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="p-7" className="mb-7">
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            <FormInput label="Target Role" placeholder="Senior Frontend Developer" value={form.target_role} onChange={set("target_role")} />
            <FormSelect label="Company Type" options={COMPANY_TYPES} value={form.company} onChange={set("company")} />
            <FormSelect label="Experience" options={EXP_LEVELS} value={form.experience_level} onChange={set("experience_level")} />
          </div>
          <div className="mb-6">
            <label className="text-xs font-medium text-muted uppercase tracking-wider block mb-2">
              Tech Stack <span className="text-accent normal-case">· press Enter to add</span>
            </label>
            <TagInput tags={stack} setTags={setStack} placeholder="Add technology..." />
          </div>
          <Button type="submit"><Icon name="bolt" size={15} /> Generate Interview Plan</Button>
        </Card>
      </form>

      {loading && <Loader text="Building your personalized question bank..." />}

      <AnimatePresence>
        {generated && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <h2 className="font-display font-bold text-xl">Question Bank — {form.target_role}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">
                  Reviewed: <span className="text-accent font-bold">{reviewedPct}%</span> ({reviewed.length}/{interviewQuestions.length})
                </span>
                {["Easy", "Medium", "Hard"].map((l) => <Badge key={l} label={l} variant={l} />)}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {interviewQuestions.map((q, i) => {
                const isReviewed = reviewed.includes(i)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`bg-surface border rounded-xl overflow-hidden transition-colors duration-300 ${isReviewed ? 'border-accent2/30' : 'border-white/[0.07] hover:border-accent/30'}`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveQ(activeQ === i ? null : i)}
                      className="flex items-start gap-3 w-full p-5 text-left hover:bg-surface2 transition-colors"
                    >
                      <Badge label={q.level} variant={q.level} />
                      <span className="text-xs text-muted bg-surface2 border border-white/[0.07] rounded-md px-2 py-1 whitespace-nowrap mt-0.5">{q.category}</span>
                      <span className={`text-sm flex-1 leading-relaxed mt-0.5 ${isReviewed ? 'line-through text-muted' : ''}`}>{q.q}</span>
                      {isReviewed && <span className="text-xs text-accent2 font-medium mt-0.5 whitespace-nowrap">✓ Reviewed</span>}
                      <motion.div animate={{ rotate: activeQ === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="mt-1 flex-shrink-0">
                        <Icon name="chevron" size={15} className="text-muted" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeQ === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-surface2 border-t border-white/[0.07] px-5 py-4">
                            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Model Answer</p>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">{q.ans}</p>
                            <button
                              onClick={() => toggleReviewed(i)}
                              className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all ${
                                isReviewed
                                  ? 'bg-accent2/10 border-accent2/30 text-accent2 hover:bg-accent2/20'
                                  : 'bg-white/[0.04] border-white/[0.1] text-muted hover:border-accent/50 hover:text-white'
                              }`}
                            >
                              {isReviewed ? '✓ Marked as Reviewed' : 'Mark as Reviewed'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Interview History"
        items={historyItems}
        onSelect={loadSession}
        renderItem={(item) => (
          <div>
            <p className="font-semibold text-sm text-white mb-1">{item.target_role}</p>
            <p className="text-xs text-muted">{item.company} · {item.experience_level}</p>
            <p className="text-xs text-muted mt-1">{item.created_at}</p>
          </div>
        )}
      />
    </div>
  )
}
