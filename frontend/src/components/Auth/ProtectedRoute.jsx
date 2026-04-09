import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { fetchCurrentUser } from '@/store/slices/authSlice'

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const dispatch = useDispatch()

  // Defensive selector — always returns a plain object even if slice is undefined
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated ?? false)
  const isInitializing  = useSelector((s) => s.auth?.isInitializing  ?? false)
  const user            = useSelector((s) => s.auth?.user            ?? null)

  useEffect(() => {
    if (isAuthenticated && !user && !isInitializing) {
      dispatch(fetchCurrentUser())
    }
  }, [isAuthenticated, user, isInitializing, dispatch])

  // Loading spinner while verifying token
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}/>
            ))}
          </div>
          <p className="text-sm text-slate-400">Loading AIVOA CRM...</p>
        </div>
      </div>
    )
  }

  // No token — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role guard
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Access Denied</h2>
          <p className="text-sm text-slate-500">
            Your role <span className="font-medium">({user.role})</span> cannot access this page.
          </p>
        </div>
      </div>
    )
  }

  return children
}