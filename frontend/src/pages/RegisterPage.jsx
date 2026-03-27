import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'
import axios from 'axios'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
      if(!form.name||!form.email||!form.password||!form.confirm_password) {
        alert("Please fill in all fields")}
      else if (form.password !== form.confirm_password) {
        alert("Passwords do not match")}
        else{setLoading(true)
    try {

      await axios.post('http://127.0.0.1:8000/api/auth/signup/', form);
      

      const loginRes = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);
      
      setForm({ name: '', email: '', password: '', confirm_password: '' })
      window.location.href = '/dashboard';
      alert("Account created and logged in!");
    } catch (err) {
      console.error("failed to signup", err);
      alert("failed to signup: " + (err.response?.data?.message || "Unknown error"));
    }
    setLoading(false);
  }
};

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
            <FormInput label=" Password" type="password" placeholder="••••••••" value={form.confirm_password} onChange={set('confirm_password')} required />

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
