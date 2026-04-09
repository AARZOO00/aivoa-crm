import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const KPI_DATA = [
  { label: 'Interactions', value: '124', sub: 'This month', delta: '+18%', up: true,  icon: '📋', gradient: 'from-blue-500 to-blue-600',    glow: 'shadow-blue-500/20' },
  { label: 'HCPs Visited', value: '47',  sub: 'Active HCPs', delta: '+6',  up: true,  icon: '👤', gradient: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/20' },
  { label: 'Follow-ups',   value: '12',  sub: 'Pending',     delta: '-3',  up: false, icon: '🔔', gradient: 'from-amber-500 to-orange-500',  glow: 'shadow-amber-500/20' },
  { label: 'AI Actions',   value: '89',  sub: 'Suggestions used', delta: '+31%', up: true, icon: '🤖', gradient: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
]

const ACTIVITY = [
  { name: 'Dr. Sarah Johnson',  specialty: 'Cardiology',      type: 'Meeting',    sentiment: 'Positive', time: '10:30 AM', date: 'Today',     topic: 'Product X Phase III efficacy data',      initials: 'SJ', color: 'from-blue-400 to-blue-600' },
  { name: 'Dr. Michael Chen',   specialty: 'Oncology',         type: 'Call',       sentiment: 'Neutral',  time: '3:15 PM',  date: 'Yesterday', topic: 'Treatment Y clinical trial update',      initials: 'MC', color: 'from-violet-400 to-violet-600' },
  { name: 'Dr. Priya Patel',    specialty: 'Neurology',        type: 'Email',      sentiment: 'Positive', time: '9:00 AM',  date: '2 days ago', topic: 'Sent comparative efficacy brochure',    initials: 'PP', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Dr. James Wilson',   specialty: 'Endocrinology',    type: 'Conference', sentiment: 'Positive', time: '2:00 PM',  date: '3 days ago', topic: 'ADA 2026 — Disease management panel',  initials: 'JW', color: 'from-amber-400 to-orange-500' },
  { name: 'Dr. Lisa Thompson',  specialty: 'Rheumatology',     type: 'Meeting',    sentiment: 'Negative', time: '11:00 AM', date: '4 days ago', topic: 'Pricing concerns — needs follow-up',   initials: 'LT', color: 'from-pink-400 to-rose-500' },
]

const FOLLOWUPS = [
  { hcp: 'Dr. Sarah Johnson', action: 'Send Phase III summary deck', due: 'Tomorrow',   urgency: 'high' },
  { hcp: 'Dr. Michael Chen',  action: 'Schedule lunch & learn',      due: 'This week',  urgency: 'med' },
  { hcp: 'Dr. Lisa Thompson', action: 'Address pricing objections',  due: 'Today',      urgency: 'high' },
  { hcp: 'Dr. James Wilson',  action: 'Follow up on trial interest', due: 'Next week',  urgency: 'low' },
]

const SENTIMENT_DIST = [
  { label: 'Positive', pct: 62, color: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'Neutral',  pct: 28, color: 'bg-slate-400',   text: 'text-slate-500' },
  { label: 'Negative', pct: 10, color: 'bg-red-400',     text: 'text-red-500' },
]

const sentimentStyle = {
  Positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Neutral:  'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Negative: 'bg-red-50 text-red-600 ring-1 ring-red-200',
}
const typeStyle = {
  Meeting: 'bg-blue-50 text-blue-700', Call: 'bg-violet-50 text-violet-700',
  Email: 'bg-amber-50 text-amber-700', Conference: 'bg-teal-50 text-teal-700',
}
const urgencyStyle = {
  high: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  med:  'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  low:  'bg-slate-100 text-slate-500',
}

export default function Dashboard() {
  const user     = useSelector((s) => s.auth?.user)
  const navigate = useNavigate()
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const [activeTab, setActiveTab] = useState('activity')

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="h-full overflow-y-auto bg-[#f8fafc]">
      {/* ── TOP HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Agent Online
          </div>
          <button onClick={() => navigate('/log-interaction')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500
                       text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-blue-500/20">
            <span>+</span> Log Interaction
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {KPI_DATA.map((k) => (
            <div key={k.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.gradient} flex items-center justify-center text-lg shadow-lg ${k.glow}`}>
                  {k.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {k.delta}
                </span>
              </div>
              <div className="text-2xl font-black text-slate-800">{k.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{k.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* LEFT: Activity + Follow-ups tabs */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Tab header */}
            <div className="flex border-b border-slate-100">
              {[['activity', '📋 Recent Activity'], ['followups', '🔔 Follow-ups']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-5 py-3.5 text-sm font-semibold transition-colors flex-1
                    ${activeTab === id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-500 hover:text-slate-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'activity' && (
              <div className="divide-y divide-slate-50">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => navigate('/log-interaction')}>
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                      {a.initials}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{a.name}</span>
                        <span className="text-xs text-slate-400">{a.specialty}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{a.topic}</p>
                    </div>
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeStyle[a.type] || 'bg-slate-100 text-slate-600'}`}>{a.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sentimentStyle[a.sentiment]}`}>{a.sentiment}</span>
                    </div>
                    {/* Time */}
                    <div className="hidden md:block text-right flex-shrink-0 min-w-[70px]">
                      <div className="text-xs text-slate-400">{a.date}</div>
                      <div className="text-xs text-slate-400">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'followups' && (
              <div className="divide-y divide-slate-50">
                {FOLLOWUPS.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{f.hcp}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{f.action}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${urgencyStyle[f.urgency]}`}>{f.due}</span>
                      <button className="text-slate-300 hover:text-blue-500 transition-colors text-lg">✓</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar widgets */}
          <div className="space-y-4">
            {/* Sentiment distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span>😊</span> HCP Sentiment Overview
              </h3>
              <div className="space-y-3">
                {SENTIMENT_DIST.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-semibold ${s.text}`}>{s.label}</span>
                      <span className="text-slate-400 font-medium">{s.pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Log New Interaction', icon: '📋', to: '/log-interaction', color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
                  { label: 'Browse HCP Directory', icon: '👤', to: '/hcp',             color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
                  { label: 'View Analytics',       icon: '📊', to: '/analytics',       color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
                ].map((a) => (
                  <button key={a.label} onClick={() => navigate(a.to)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${a.color}`}>
                    <span>{a.icon}</span> {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI tip */}
            <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🤖</span>
                <div>
                  <div className="font-bold text-sm mb-1">AI Insight</div>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Dr. Lisa Thompson expressed pricing concerns. Schedule a follow-up with a value proposition deck within 48 hours.
                  </p>
                  <button onClick={() => navigate('/log-interaction')}
                    className="mt-3 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                    Act on this →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}