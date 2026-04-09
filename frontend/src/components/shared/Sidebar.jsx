import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { logout } from '@/store/slices/authSlice'

const NAV = [
  { to: '/dashboard',       label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/log-interaction', label: 'Log Interaction',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { to: '/hcp',             label: 'HCP Directory',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/interactions',    label: 'Interactions',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/analytics',       label: 'Analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]

const ROLE_BADGE = {
  admin:   'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  manager: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
  rep:     'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  msl:     'bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth?.user)
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  return (
    <aside className="w-64 min-h-screen flex-shrink-0 flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1E1B4B 0%, #0F0E1F 100%)' }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.07] blur-2xl"
        style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }}/>
      <div className="absolute bottom-20 left-0 w-32 h-32 rounded-full opacity-[0.05] blur-2xl"
        style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }}/>

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-grad-brand flex items-center justify-center shadow-glow-brand flex-shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-tight leading-none">AIVOA</div>
            <div className="text-indigo-400 text-[11px] mt-0.5 font-medium">Life Sciences CRM</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.12em] px-3.5 mb-3">Main Menu</p>
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
               ${isActive ? 'text-white bg-white/12 shadow-inner' : 'text-indigo-300/70 hover:text-white hover:bg-white/8'}`
            }>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(124,58,237,0.2))' }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}/>
                )}
                {/* Left accent bar */}
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-indigo-400"/>}
                <svg className={`w-[18px] h-[18px] flex-shrink-0 relative z-10 transition-colors ${isActive ? 'text-indigo-300' : 'text-indigo-500/60 group-hover:text-indigo-300'}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
                </svg>
                <span className="relative z-10">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 relative z-10 animate-pulse"/>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="mx-4 h-px bg-white/[0.07] mb-4"/>
      <div className="px-3 pb-6 space-y-2">
        <NavLink to="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-grad-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-glow-brand">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate leading-none">{user?.full_name || 'User'}</div>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${ROLE_BADGE[user?.role] || 'bg-slate-500/20 text-slate-300'}`}>
              {user?.role?.toUpperCase() || 'USER'}
            </span>
          </div>
        </NavLink>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-indigo-400/70 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all duration-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}