import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { Onboarding } from './pages/Onboarding'
import { useBlinkAuth } from '@blinkdotnew/react'
import { useEffect, useState } from 'react'
import { useStore } from './store/useStore'
import { blink } from './lib/blink'

// Placeholder for protected content
const DashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useBlinkAuth()
  const { profile, setProfile } = useStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      blink.db.users.get(user.id).then((p) => {
        if (p) setProfile(p as any)
        setChecking(false)
      })
    } else if (!isLoading) {
      setChecking(false)
    }
  }, [isAuthenticated, user, isLoading, setProfile])

  if (isLoading || checking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!isAuthenticated) return <Navigate to="/" />
  
  if (!profile) return <Navigate to="/onboarding" />

  return <Navigate to="/dashboard" />
}

import { Dashboard } from './pages/Dashboard'
import { FocusRoom } from './pages/FocusRoom'
import { Workspace } from './pages/Workspace'
import { Marketplace } from './pages/Marketplace'
import WalletPage from './pages/Wallet'
import { FoundersLanding } from './pages/FoundersLanding'
import { LearnersLanding } from './pages/LearnersLanding'
import { ExploreLanding } from './pages/ExploreLanding'
import { CustomCursor } from './components/ui/CustomCursor'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useBlinkAuth()
  const { profile } = useStore()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/" />
  if (!profile) return <Navigate to="/onboarding" />

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/founders" element={<FoundersLanding />} />
        <Route path="/learners" element={<LearnersLanding />} />
        <Route path="/explore" element={<ExploreLanding />} />
        
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth-check" element={<DashboardRedirect />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><FocusRoom /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        
        <Route path="*" element={<DashboardRedirect />} />
      </Routes>
    </Router>
  )
}

export default App