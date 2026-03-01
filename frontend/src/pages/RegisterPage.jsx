import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.access)
        navigate('/dashboard')
      } else {
        alert('Registration failed: ' + (data.detail || 'Check details'))
      }
    } catch (err) {
      console.warn('Backend not available, proceeding with mock registration')
      localStorage.setItem('token', 'mock-token')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-accent2/8 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <Link to="/" className="font-display font-extrabold text-2xl gradient-text">CareerIQ</Link>
          <h2 className="font-display font-bold text-2xl mt-5 mb-2">Create your account</h2>
          <p className="text-muted text-sm">Start your AI-powered career journey today</p>
        </div>

        <div className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput label="Full Name" type="text" placeholder="Alex Johnson" value={form.name} onChange={set('name')} required />
            <FormInput label="Email Address" type="email" placeholder="alex@example.com" value={form.email} onChange={set('email')} required />
            <FormInput label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            <FormInput label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} required />

            <Button type="submit" loading={loading} className="w-full justify-center py-3.5 mt-1">
              {!loading && 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-muted text-sm hover:text-[#e8e8f0] transition-colors">← Back to home</Link>
        </div>
      </motion.div>
    </div>
  )
}
