import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import FormInput from '../../components/ui/FormInput'
import Toggle from '../../components/ui/Toggle'
import Icon from '../../components/ui/Icon'

const PREFS = [
  { key: 'emailNotifs', label: 'Email Notifications', desc: 'Get updates on progress and AI recommendations' },
  { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Receive a weekly summary of your learning activity' },
  { key: 'darkMode', label: 'Dark Mode', desc: 'Use the dark color theme (recommended)' },
  { key: 'aiSuggestions', label: 'AI Suggestions', desc: 'Get personalized tips from the AI engine' },
]

export default function SettingsPage() {
  const { user } = useApp()
  const [profile, setProfile] = useState({ ...user })
  const [prefs, setPrefs] = useState({ emailNotifs: true, weeklyReport: true, darkMode: true, aiSuggestions: true })
  const [saved, setSaved] = useState(false)

  const setP = (k) => (e) => setProfile({ ...profile, [k]: e.target.value })
  const togglePref = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, preferences, and account settings." />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card padding="p-7" delay={0.1}>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xl font-bold flex-shrink-0 overflow-hidden">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || '?')}
            </div>
            <div>
              <p className="font-display font-bold text-lg">{profile.name}</p>
              <p className="text-muted text-sm">{profile.email}</p>
              <button className="text-xs text-accent mt-1 hover:underline cursor-pointer">Change Avatar</button>
            </div>
          </div>

          <h3 className="font-display font-bold text-base mb-5">Profile Information</h3>
          <div className="flex flex-col gap-4">
            <FormInput label="Full Name" value={profile.name} onChange={setP('name')} />
            <FormInput label="Email Address" value={profile.email} onChange={setP('email')} type="email" />
            <FormInput label="Current Role" value={profile.role} onChange={setP('role')} />
            <FormInput label="Company" value={profile.company} onChange={setP('company')} />

            <motion.div animate={saved ? { scale: [1, 1.02, 1] } : {}}>
              <Button onClick={handleSave} className="w-full justify-center">
                {saved ? <><Icon name="check" size={15} /> Saved!</> : 'Save Changes'}
              </Button>
            </motion.div>
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          {/* Preferences */}
          <Card padding="p-7" delay={0.2}>
            <h3 className="font-display font-bold text-base mb-6">Preferences</h3>
            <div className="flex flex-col gap-5">
              {PREFS.map(({ key, label, desc }) => (
                <Toggle
                  key={key}
                  on={prefs[key]}
                  onClick={() => togglePref(key)}
                  label={label}
                  description={desc}
                />
              ))}
            </div>
          </Card>

          {/* Subscription */}
          <Card padding="p-6" delay={0.3}>
            <h3 className="font-display font-bold text-base mb-4">Subscription</h3>
            <div className="bg-accent/8 border border-accent/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">Free Plan</span>
                <span className="text-xs text-accent bg-accent/15 px-2.5 py-1 rounded-full font-semibold">Current</span>
              </div>
              <p className="text-muted text-xs">5 roadmaps/month · 20 interview questions · Basic analytics</p>
            </div>
            <Button className="w-full justify-center">
              Upgrade to Pro — $19/mo
            </Button>
          </Card>

          {/* Danger Zone */}
          <Card padding="p-6" delay={0.4}>
            <h3 className="font-display font-bold text-base mb-4 text-accent3">Danger Zone</h3>
            <div className="flex gap-3">
              <button className="text-xs font-medium text-muted border border-accent3/20 px-4 py-2 rounded-lg hover:border-accent3/50 transition-colors cursor-pointer">
                Export Data
              </button>
              <button className="text-xs font-medium text-accent3 border border-accent3/30 px-4 py-2 rounded-lg hover:bg-accent3/5 transition-colors cursor-pointer">
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// git push test