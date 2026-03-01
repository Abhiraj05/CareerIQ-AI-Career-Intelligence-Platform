import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  const [roadmapProgress, setRoadmapProgress] = useState({})
  const [aptitudeScores, setAptitudeScores] = useState([])

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      // For development without backend: if no token or fetch fails, use a mock user
      if (!token) {
        setUser({
          name: 'Demo User',
          email: 'demo@careeriq.ai',
          plan: 'Pro',
          avatar: null
        })
        setUserLoading(false)
        return
      }

      try {
        const res = await fetch('/api/auth/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Invalid token')
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.warn('Backend not available, using mock user')
        setUser({
          name: 'Demo User',
          email: 'demo@careeriq.ai',
          plan: 'Pro',
          avatar: null
        })
      } finally {
        setUserLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    setUser,
    userLoading,
    logout,
    roadmapProgress,
    setRoadmapProgress,
    aptitudeScores,
    setAptitudeScores,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}