import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '@/store/slices/authSlice'

const TITLES = {
  '/dashboard':       { title: 'Dashboard',        sub: 'Your HCP engagement overview' },
  '/log-interaction': { title: 'Log Interaction',   sub: 'Capture HCP interaction via form or AI chat' },
  '/hcp':             { title: 'HCP Directory',     sub: 'Search and manage healthcare professionals' },
  '/interactions':    { title: 'Interactions',      sub: 'Browse all logged interaction records' },
  '/analytics':       { title: 'Analytics',         sub: 'Insights, trends and performance metrics' },
  '/profile':         { title: 'My Profile',        sub: 'Account information and settings' },
}

export default function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useSelector((s) => s.auth?.user)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const page = TITLES[pathname] || { title: 'AIVOA CRM', sub: 'Life Sciences Platform' }
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-indigo-100/60 z-30"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)' }}>

      {/* Left: breadcrumb */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-grad-brand"/>
          <h1 className="text-base font-bold text-slate-900">{page.title}</h1>
        </div>
        <p className="text-xs text-indigo-400 mt-0.5 ml-3.5">{page.sub}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Search pill */}
        <button className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-400 text-sm hover:bg-indigo-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="text-xs">Search...</span>
          <kbd className="hidden lg:inline text-[10px] bg-indigo-100 text-indigo-400 px-1.5 py-0.5 rounded-md font-mono">⌘K</kbd>
        </button>

        {/* Bell */}
        <button className="relative w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 flex items-center justify-center text-indigo-400 transition-colors">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-white"/>
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all">
            <div className="w-8 h-8 rounded-lg bg-grad-brand flex items-center justify-center text-white text-xs font-bold shadow-glow-brand">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-none">{user?.full_name?.split(' ')[0] || 'User'}</div>
              <div className="text-[11px] text-indigo-400 mt-0.5 capitalize">{user?.role}</div>
            </div>
            <svg className={`w-4 h-4 text-indigo-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, scale: 0.94, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -6 }} transition={{ duration: 0.14, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-indigo-100 shadow-card-lg overflow-hidden z-50">

                {/* User header */}
                <div className="px-4 py-3.5 border-b border-indigo-50"
                  style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-grad-brand flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 leading-none">{user?.full_name}</div>
                      <div className="text-[11px] text-indigo-400 mt-0.5 truncate">{user?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                {[
                  { label: 'My Profile', to: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { label: 'Settings',   to: '/profile', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                ].map(item => (
                  <button key={item.label} onClick={() => { setOpen(false); navigate(item.to) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left">
                    <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon}/>
                    </svg>
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-indigo-50">
                  <button onClick={() => { dispatch(logout()); navigate('/login') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}