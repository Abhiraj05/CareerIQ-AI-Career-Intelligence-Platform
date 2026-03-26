import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './components/layout/DashboardLayout'
import OverviewPage from './pages/dashboard/OverviewPage'
import RoadmapPage from './pages/dashboard/RoadmapPage'
import InterviewPage from './pages/dashboard/InterviewPage'
import ResumePage from './pages/dashboard/ResumePage'
import AptitudePage from './pages/dashboard/AptitudePage'
import ProgressPage from './pages/dashboard/ProgressPage'
import SettingsPage from './pages/dashboard/SettingsPage'
import PricingPage from './pages/dashboard/PricingPage'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="aptitude" element={<AptitudePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="pricing" element={<PricingPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}