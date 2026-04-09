import React, { useEffect } from 'react'
import { BrowserRouter , Router, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from '@/store/slices/authSlice'

// Layout
import MainLayout from '@/components/Layout/MainLayout'
import ProtectedRoute from '@/components/Auth/ProtectedRoute'

// Auth & Landing
import LoginPage from '@/components/Auth/LoginPage'
import LandingPage from '@/components/LandingPage'

// Pages
import Dashboard from './Pages/Dashboard'
import HCPDirectory from './Pages/HCPDirectory'
import Interactions from './Pages/Interactions'
import Analytics from './Pages/Analytics'
import Profile from './Pages/Profile'
import Settings from "./Pages/Settings"; 


// Existing feature screens (kept intact)
import LogInteractionScreen from './components/LogInteractionScreen'
import HCPTimeline from './components/Timeline/HCPTimeline'

function AppInitializer() {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated ?? false)
  const user = useSelector((s) => s.auth?.user ?? null)
  useEffect(() => {
    if (isAuthenticated && !user) dispatch(fetchCurrentUser())
  }, []) // eslint-disable-line
  return null
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInitializer />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected pages — each in MainLayout */}
        <Route path="/dashboard"       element={<Protected><Dashboard /></Protected>} />
        <Route path="/log-interaction" element={<Protected><LogInteractionScreen /></Protected>} />
        <Route path="/hcp"             element={<Protected><HCPDirectory /></Protected>} />
        <Route path="/interactions"    element={<Protected><Interactions /></Protected>} />
        <Route path="/analytics"       element={<Protected><Analytics /></Protected>} />
        <Route path="/profile"         element={<Protected><Profile /></Protected>} />
        <Route path="/settings"        element={<Protected><Settings /></Protected>} />
        <Route path="/timeline/:hcpId" element={<Protected><HCPTimeline /></Protected>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
