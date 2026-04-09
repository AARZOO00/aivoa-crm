import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, loginAsDemo, clearAuthError } from '@/store/slices/authSlice'
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../../services/auth";
const DEMO_ROLES = [
  { role: 'Admin',   color: 'from-violet-500 to-purple-600', badge: 'AU', desc: 'Full access' },
  { role: 'Manager', color: 'from-blue-500 to-blue-600',     badge: 'SM', desc: 'Team view' },
  { role: 'Rep',     color: 'from-emerald-500 to-green-600', badge: 'AR', desc: 'Field rep' },
  { role: 'MSL',     color: 'from-amber-500 to-orange-500',  badge: 'MU', desc: 'Medical' },
]

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Logging', desc: 'Log interactions via natural language with Groq LLM' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'Sentiment tracking, HCP engagement & territory insights' },
  { icon: '🎙️', title: 'Voice Transcription', desc: 'Convert voice notes to structured CRM data instantly' },
  { icon: '🔗', title: 'LangGraph Agent', desc: '5-tool AI agent: log, edit, search, suggest & analyze' },
]

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, googleLoading, demoLoading, error, isAuthenticated } = useSelector((s) => s.auth)

  const [tab, setTab]         = useState('signin') // signin | register
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }) }, [isAuthenticated])
  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }
  const handleGoogleLogin = async () => {
    try {
        const user = await signInWithGoogle();
        if (user) {
        // ✅ Redux state manually update karo
        dispatch({ type: 'auth/setUser', payload: {
            name: user.displayName,
            email: user.email,
            role: "Rep",
            territory: "Northeast",
        }});
        navigate("/dashboard", { replace: true });
        }
    } catch (err) {
        console.error(err);
        alert("Login failed");
    }
};
  
  const handleDemo = (role) => dispatch(loginAsDemo(role))

  const anyLoading = isLoading || googleLoading || !!demoLoading

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0f0f1a]">

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a3e] via-[#0d1b4b] to-[#0a0a1a]" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <div>
              <div className="text-white font-black text-xl tracking-tight">AIVOA CRM</div>
              <div className="text-blue-400 text-xs font-medium tracking-widest uppercase">Life Sciences · HCP Intelligence</div>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-5">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-3">
              The AI-First<br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                CRM for Pharma
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Powered by Groq's gemma2-9b-it model and LangGraph agent orchestration for life sciences field teams.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 max-w-sm">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3.5 bg-white/5 backdrop-blur border border-white/8 rounded-xl p-3.5 hover:bg-white/8 transition-colors">
                <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <div className="text-white text-sm font-semibold">{f.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-500 text-xs">
          AIVOA Life Sciences CRM v2.0 · Powered by Groq + LangGraph
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc] relative">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black">A</span>
            </div>
            <span className="text-slate-800 font-black text-xl">AIVOA CRM</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {['signin', 'register'].map((t) => (
                <button key={t} onClick={() => { setTab(t); dispatch(clearAuthError()) }}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors capitalize
                    ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                  {t === 'signin' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <div className="p-7">
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {tab === 'signin' ? 'Welcome back 👋' : 'Create account'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {tab === 'signin' ? 'Sign in to your CRM workspace' : 'Start your free AIVOA trial'}
              </p>

              {/* Error */}
              {error && (
                <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}

             <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200
                            hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700
                            transition-all duration-150 active:scale-[0.98] mb-4 shadow-sm"
                >
                <img 
                    src="https://www.svgrepo.com/show/475656/google-color.svg" 
                    className="w-5 h-5"
                />
                Continue with Google
            </button>
              
              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Jane Smith" required={tab === 'register'}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com" required autoComplete="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                               focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                    {tab === 'signin' && <button type="button" className="text-xs text-blue-500 hover:text-blue-600">Forgot?</button>}
                  </div>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" required autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-11"/>
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={anyLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500
                             text-white font-bold rounded-xl text-sm transition-all duration-150 active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 mt-1">
                  {isLoading ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Signing in…</>
                  ) : (
                    <>{tab === 'signin' ? 'Sign In' : 'Create Account'} <span>→</span></>
                  )}
                </button>
              </form>

              {/* Demo login */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center mb-3 font-medium">Quick demo — click to sign in instantly</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ROLES.map(({ role, color, badge, desc }) => (
                    <button key={role} onClick={() => handleDemo(role)} disabled={anyLoading}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                                 hover:bg-slate-100 hover:border-slate-300 transition-all active:scale-[0.97] disabled:opacity-50 group">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {demoLoading === role
                          ? <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          : badge[0]}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs font-semibold text-slate-700">{role}</div>
                        <div className="text-xs text-slate-400">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            By signing in you agree to our <span className="text-blue-500 hover:underline cursor-pointer">Terms</span> &amp; <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}