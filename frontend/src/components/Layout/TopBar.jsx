import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { motion, AnimatePresence } from 'framer-motion'

const PAGE_META = {
  '/dashboard':       { title: 'Dashboard',       sub: 'Overview of your HCP activity' },
  '/log-interaction': { title: 'Log Interaction',  sub: 'Capture HCP interaction via form or AI chat' },
  '/hcp':             { title: 'HCP Directory',    sub: 'Search and manage healthcare professionals' },
  '/interactions':    { title: 'Interactions',     sub: 'All logged HCP interaction records' },
  '/analytics':       { title: 'Analytics',        sub: 'Insights, trends and performance metrics' },
  '/profile':         { title: 'Profile',          sub: 'Your account and security' },
  '/settings':        { title: 'Settings',         sub: 'Manage your account and preferences' },
}

// Mock notifications
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'interaction', message: 'New interaction logged with Dr. Smith', time: '2 min ago', read: false },
  { id: 2, type: 'reminder', message: 'Follow-up reminder: Dr. Johnson', time: '15 min ago', read: false },
  { id: 3, type: 'insight', message: 'New AI insight: High sentiment detected', time: '1 hour ago', read: true },
  { id: 4, type: 'interaction', message: 'Interaction with HCP recorded', time: '3 hours ago', read: true },
]

// Mock search data
const MOCK_SEARCH_DATA = [
  { id: 1, type: 'hcp', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', path: '/hcp' },
  { id: 2, type: 'hcp', name: 'Dr. Michael Chen', specialty: 'Oncology', path: '/hcp' },
  { id: 3, type: 'hcp', name: 'Dr. Emily Roberts', specialty: 'Neurology', path: '/hcp' },
  { id: 4, type: 'interaction', name: 'Meeting with Dr. Anderson', date: 'Today', path: '/interactions' },
  { id: 5, type: 'interaction', name: 'Call with Dr. Williams', date: 'Yesterday', path: '/interactions' },
]

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth?.user)
  const meta = PAGE_META[location.pathname] || { title: 'AIVOA CRM', sub: '' }

  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const roleColor = { Admin: 'bg-violet-100 text-violet-700', Manager: 'bg-blue-100 text-blue-700', Rep: 'bg-emerald-100 text-emerald-700', MSL: 'bg-amber-100 text-amber-700' }

  // Filter search results
  const searchResults = searchQuery
    ? MOCK_SEARCH_DATA.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.specialty && item.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Handle search selection
  const handleSearchSelect = (result) => {
    navigate(result.path)
    setSearchQuery('')
    setShowSearch(false)
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 gap-4">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">{meta.title}</h1>
          <p className="text-xs text-slate-400 leading-tight hidden sm:block">{meta.sub}</p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              placeholder="Search HCP or interactions..."
              className="w-48 bg-slate-100 hover:bg-slate-200/70 rounded-xl px-3 py-2 text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 flex-shrink-0 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>

            {/* Search dropdown */}
            <AnimatePresence>
              {showSearch && (searchQuery || true) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50"
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchSelect(result)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm"
                        >
                          <div className="flex items-center gap-2">
                            {result.type === 'hcp' ? (
                              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                              </svg>
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-slate-900">{result.name}</div>
                              <div className="text-xs text-slate-400">{result.specialty || result.date}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                      No results found for "{searchQuery}"
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {showSearch && (
            <div className="fixed inset-0 z-40" onClick={() => setShowSearch(false)} />
          )}
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </button>

          {/* Notifications dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50"
              >
                <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-indigo-50' : ''}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.read ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">
                      No notifications
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {showNotifications && <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />}
        </div>

        {/* User profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-700 leading-tight">{user?.name || 'User'}</div>
              <div className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full inline-block ${roleColor[user?.role] || 'bg-slate-100 text-slate-500'}`}>
                {user?.role || 'Rep'}
              </div>
            </div>
          </button>

          {/* Profile dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Account</div>
                </div>
                <button
                  onClick={() => { navigate('/profile'); setShowProfile(false) }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm text-slate-700 font-medium"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  View Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowProfile(false) }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm text-slate-700 font-medium"
                >
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                  Settings
                </button>
                <div className="border-t border-slate-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors flex items-center gap-3 text-sm text-red-600 font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                  </svg>
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {showProfile && <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />}
        </div>
      </div>
    </header>
  )
}