import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchHCPTimeline } from '@/store/slices/analyticsSlice'

const SENTIMENT_CONFIG = {
  Positive: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', emoji: '😊' },
  Neutral:  { color: 'bg-amber-100 text-amber-700 border-amber-200',   dot: 'bg-amber-400',   emoji: '😐' },
  Negative: { color: 'bg-red-100 text-red-700 border-red-200',         dot: 'bg-red-400',     emoji: '😟' },
}

const TYPE_ICONS = {
  Meeting:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>,
  Call:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>,
  Email:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
  Conference: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>,
  CME:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>,
}

function StatCard({ label, value, sub, colorClass = 'bg-blue-50 text-blue-700' }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>{sub}</div>}
    </div>
  )
}

function TimelineCard({ interaction, isLast }) {
  const [expanded, setExpanded] = useState(false)
  const sent = SENTIMENT_CONFIG[interaction.sentiment] || SENTIMENT_CONFIG.Neutral
  const typeIcon = TYPE_ICONS[interaction.interaction_type] || TYPE_ICONS.Meeting

  return (
    <div className="flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm mt-1.5 flex-shrink-0 ${sent.dot}`}/>
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1"/>}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">{typeIcon}</svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{interaction.interaction_type}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${sent.color}`}>
                      {sent.emoji} {interaction.sentiment}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {interaction.date} {interaction.time && `· ${interaction.time}`}
                    {interaction.attendees?.length > 0 && ` · ${interaction.attendees.length} attendee${interaction.attendees.length > 1 ? 's' : ''}`}
                  </div>
                </div>
              </div>
              <button onClick={() => setExpanded(!expanded)}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 p-1">
                <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            {interaction.ai_summary && (
              <div className="mt-3 p-2.5 bg-violet-50 border border-violet-100 rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3 h-3 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs font-semibold text-violet-700">AI Summary</span>
                </div>
                <p className="text-xs text-violet-800 leading-relaxed">{interaction.ai_summary}</p>
              </div>
            )}

            {interaction.topics_discussed && (
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-2">{interaction.topics_discussed}</p>
            )}
          </div>

          {expanded && (
            <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-3">
              {interaction.attendees?.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1.5">Attendees</div>
                  <div className="flex flex-wrap gap-1.5">
                    {interaction.attendees.map((a, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {interaction.materials_shared?.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1.5">Materials Shared</div>
                  <div className="flex flex-wrap gap-1.5">
                    {interaction.materials_shared.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {interaction.outcomes && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Outcomes</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{interaction.outcomes}</p>
                </div>
              )}
              {interaction.follow_up_actions && (
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Follow-up Actions</div>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{interaction.follow_up_actions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HCPTimeline() {
  const { hcpId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { hcpTimeline, isTimelineLoading, error } = useSelector((s) => s.analytics)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    if (hcpId) dispatch(fetchHCPTimeline(hcpId))
  }, [hcpId, dispatch])

  if (isTimelineLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading timeline...</p>
      </div>
    </div>
  )

  if (!hcpTimeline) return null

  const { hcp, stats, interactions } = hcpTimeline
  const FILTERS = ['All', 'Meeting', 'Call', 'Email', 'Conference', 'CME']
  const filtered = filter === 'All' ? interactions : interactions.filter((i) => i.interaction_type === filter)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {hcp.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{hcp.name}</h1>
            <p className="text-xs text-slate-500">{hcp.specialty} · {hcp.hospital}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {hcp.email && <a href={`mailto:${hcp.email}`} className="text-xs text-blue-600 hover:underline">{hcp.email}</a>}
            {hcp.phone && <span className="text-xs text-slate-400">{hcp.phone}</span>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Interactions" value={stats.total_interactions}/>
            <StatCard label="Positive Sentiment"
              value={`${stats.sentiment_breakdown.Positive || 0}`}
              sub={stats.total_interactions > 0 ? `${Math.round((stats.sentiment_breakdown.Positive || 0) / stats.total_interactions * 100)}% positive` : 'No data'}
              colorClass="bg-emerald-50 text-emerald-700"/>
            <StatCard label="Last Contact"
              value={stats.last_contact ? new Date(stats.last_contact).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
              sub={stats.last_contact ? new Date(stats.last_contact).getFullYear().toString() : undefined}/>
          </div>

          {/* Sentiment bar */}
          {stats.total_interactions > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-medium text-slate-500 mb-3">Sentiment Breakdown</div>
              <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
                {['Positive', 'Neutral', 'Negative'].map((s) => {
                  const pct = Math.round((stats.sentiment_breakdown[s] || 0) / stats.total_interactions * 100)
                  const colors = { Positive: 'bg-emerald-400', Neutral: 'bg-amber-400', Negative: 'bg-red-400' }
                  return pct > 0 ? <div key={s} className={`${colors[s]} transition-all`} style={{ width: `${pct}%` }} title={`${s}: ${pct}%`}/> : null
                })}
              </div>
              <div className="flex gap-4 mt-2">
                {['Positive', 'Neutral', 'Negative'].map((s) => {
                  const count = stats.sentiment_breakdown[s] || 0
                  const cfg = SENTIMENT_CONFIG[s]
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`}/>
                      <span className="text-xs text-slate-600">{s}: {count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                {f} {f !== 'All' && `(${interactions.filter(i => i.interaction_type === f).length})`}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm text-slate-500">No {filter !== 'All' ? filter.toLowerCase() : ''} interactions found.</p>
            </div>
          ) : (
            <div>
              {filtered.map((interaction, idx) => (
                <TimelineCard key={interaction.id} interaction={interaction} isLast={idx === filtered.length - 1}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}