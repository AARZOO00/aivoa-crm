import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MONTHLY = [
  { month: 'Nov', meetings: 6,  calls: 8,  total: 14 },
  { month: 'Dec', meetings: 9,  calls: 7,  total: 16 },
  { month: 'Jan', meetings: 11, calls: 10, total: 21 },
  { month: 'Feb', meetings: 14, calls: 12, total: 26 },
  { month: 'Mar', meetings: 18, calls: 15, total: 33 },
  { month: 'Apr', meetings: 22, calls: 18, total: 40 },
]
const MAX_VAL = 45

const TYPE_DATA = [
  { label: 'Meeting',    pct: 42, color: '#6366f1', count: 52 },
  { label: 'Call',       pct: 28, color: '#8b5cf6', count: 35 },
  { label: 'Email',      pct: 18, color: '#06b6d4', count: 22 },
  { label: 'Conference', pct: 8,  color: '#f59e0b', count: 10 },
  { label: 'CME',        pct: 4,  color: '#10b981', count: 5  },
]

const SENT_DATA = [
  { label: 'Positive', pct: 64, color: '#10b981', bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
  { label: 'Neutral',  pct: 27, color: '#94a3b8', bg: 'bg-slate-400',   light: 'bg-slate-100 text-slate-600' },
  { label: 'Negative', pct: 9,  color: '#f43f5e', bg: 'bg-rose-400',    light: 'bg-rose-50 text-rose-600' },
]

const TOP_HCPS = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiology',   visits: 14, sentiment: 'Positive', grad: 'from-indigo-400 to-indigo-600' },
  { name: 'Dr. Michael Chen',  specialty: 'Oncology',     visits: 11, sentiment: 'Neutral',  grad: 'from-violet-400 to-violet-600' },
  { name: 'Dr. Priya Patel',   specialty: 'Neurology',    visits: 9,  sentiment: 'Positive', grad: 'from-blue-400 to-blue-600' },
  { name: 'Dr. James Wilson',  specialty: 'Endocrinology',visits: 7,  sentiment: 'Positive', grad: 'from-emerald-400 to-emerald-600' },
  { name: 'Dr. Lisa Thompson', specialty: 'Rheumatology', visits: 5,  sentiment: 'Negative', grad: 'from-pink-400 to-rose-500' },
]

const SENT_DOT = { Positive: 'bg-emerald-400', Neutral: 'bg-slate-400', Negative: 'bg-rose-400' }

const KPI = [
  { label: 'Total Interactions', value: '124', delta: '+18%', up: true,  icon: '📋', color: 'indigo' },
  { label: 'HCPs Engaged',       value: '47',  delta: '+6',   up: true,  icon: '👤', color: 'violet' },
  { label: 'Positive Rate',      value: '64%', delta: '+5%',  up: true,  icon: '😊', color: 'emerald' },
  { label: 'Avg / Month',        value: '20.7',delta: '+3.2', up: true,  icon: '📈', color: 'blue' },
]

const KCOLOR = {
  indigo:  { card: 'bg-indigo-50 border-indigo-100',  val: 'text-indigo-700', delta: 'bg-indigo-100 text-indigo-600' },
  violet:  { card: 'bg-violet-50 border-violet-100',  val: 'text-violet-700', delta: 'bg-violet-100 text-violet-600' },
  emerald: { card: 'bg-emerald-50 border-emerald-100',val: 'text-emerald-700',delta: 'bg-emerald-100 text-emerald-600' },
  blue:    { card: 'bg-blue-50 border-blue-100',      val: 'text-blue-700',   delta: 'bg-blue-100 text-blue-600' },
}

const [CHART_PERIOD, setChartPeriod] = [null, null]

export default function Analytics() {
  const [period, setPeriod] = useState('6m')
  const navigate = useNavigate()

  // Build donut path for sentiment
  const buildDonut = (data, r = 56, cx = 70, cy = 70, stroke = 18) => {
    let angle = -90
    return data.map(d => {
      const a1 = angle; angle += (d.pct / 100) * 360; const a2 = angle
      const toRad = deg => deg * Math.PI / 180
      const x1 = cx + r * Math.cos(toRad(a1)); const y1 = cy + r * Math.sin(toRad(a1))
      const x2 = cx + r * Math.cos(toRad(a2)); const y2 = cy + r * Math.sin(toRad(a2))
      const large = a2 - a1 > 180 ? 1 : 0
      return { ...d, path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}` }
    })
  }
  const donut = buildDonut(SENT_DATA)

  return (
    <div className="h-full overflow-y-auto bg-[#f4f6fa] pb-6">

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-6 pb-0">
        {KPI.map(k => {
          const c = KCOLOR[k.color]
          return (
            <div key={k.label} className={`rounded-2xl border p-5 ${c.card}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{k.icon}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.delta}`}>
                  {k.up ? '↑' : '↓'} {k.delta}
                </span>
              </div>
              <div className={`text-3xl font-black ${c.val}`}>{k.value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">{k.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 p-6">

        {/* Monthly Interactions Bar Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Monthly Interactions</h3>
              <p className="text-xs text-slate-400 mt-0.5">6-month activity trend</p>
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
              {['3m','6m','1y'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all
                    ${period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3" style={{ height: 160 }}>
            {MONTHLY.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex gap-1 items-end" style={{ height: 140 }}>
                  {/* Meetings bar */}
                  <div className="flex-1 rounded-t-lg transition-all duration-500 group-hover:opacity-90 relative"
                    style={{ height: `${(m.meetings/MAX_VAL)*100}%`, background: 'linear-gradient(to top, #6366f1, #818cf8)', minHeight: 4 }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {m.meetings}
                    </div>
                  </div>
                  {/* Calls bar */}
                  <div className="flex-1 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                    style={{ height: `${(m.calls/MAX_VAL)*100}%`, background: 'linear-gradient(to top, #a78bfa, #c4b5fd)', minHeight: 4 }} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{m.month}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm bg-indigo-500" />Meetings
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-sm bg-violet-300" />Calls
            </div>
          </div>
        </div>

        {/* Sentiment Donut */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Sentiment Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">HCP engagement quality</p>

          {/* SVG Donut */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg viewBox="0 0 140 140" className="w-32 h-32">
                {donut.map((d, i) => (
                  <path key={d.label} d={d.path} fill="none" stroke={d.color}
                    strokeWidth="22" strokeLinecap="round"
                    className="transition-all duration-500" />
                ))}
                <text x="70" y="65" textAnchor="middle" className="text-2xl font-black fill-slate-800" fontSize="22" fontWeight="800">64%</text>
                <text x="70" y="82" textAnchor="middle" className="fill-slate-400" fontSize="9">Positive</text>
              </svg>
            </div>
          </div>

          <div className="space-y-2.5">
            {SENT_DATA.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${s.bg} flex-shrink-0`} />
                <span className="text-xs text-slate-600 flex-1 font-medium">{s.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.bg} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 w-8 text-right">{s.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Types */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Interaction Types</h3>
          <p className="text-xs text-slate-400 mb-5">Breakdown by category</p>
          <div className="space-y-3">
            {TYPE_DATA.map(t => (
              <div key={t.label} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-xs font-semibold text-slate-700 w-24 flex-shrink-0">{t.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                </div>
                <span className="text-xs font-bold text-slate-500 w-8 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top HCPs */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Top HCPs by Visits</h3>
              <p className="text-xs text-slate-400 mt-0.5">Most engaged healthcare professionals</p>
            </div>
            <button onClick={() => navigate('/hcp')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View all →</button>
          </div>
          <div className="divide-y divide-slate-50">
            {TOP_HCPS.map((h, i) => (
              <div key={h.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer">
                <span className="text-xs font-black text-slate-300 w-4 flex-shrink-0">{i + 1}</span>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${h.grad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {h.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{h.name}</div>
                  <div className="text-xs text-slate-400">{h.specialty}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-slate-700">{h.visits}</div>
                    <div className="text-xs text-slate-400">visits</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${SENT_DOT[h.sentiment]}`} />
                    <span className="text-xs text-slate-500">{h.sentiment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}