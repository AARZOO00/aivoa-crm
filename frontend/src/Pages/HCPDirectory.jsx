import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllHCPs, searchHCPs, selectHCP } from '@/store/slices/hcpSlice'
import { useNavigate } from 'react-router-dom'

const SPEC_COLORS = {
  Cardiology:     'bg-red-50 text-red-600 ring-red-100',
  Oncology:       'bg-purple-50 text-purple-600 ring-purple-100',
  Neurology:      'bg-blue-50 text-blue-600 ring-blue-100',
  Endocrinology:  'bg-amber-50 text-amber-700 ring-amber-100',
  Rheumatology:   'bg-pink-50 text-pink-600 ring-pink-100',
  Pulmonology:    'bg-sky-50 text-sky-600 ring-sky-100',
  Gastroenterology:'bg-teal-50 text-teal-600 ring-teal-100',
  Hematology:     'bg-orange-50 text-orange-600 ring-orange-100',
  Diabetology:    'bg-lime-50 text-lime-700 ring-lime-100',
  default:        'bg-slate-50 text-slate-600 ring-slate-100',
}

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-indigo-600', 'from-violet-400 to-violet-600',
  'from-blue-400 to-blue-600',     'from-emerald-400 to-emerald-600',
  'from-amber-400 to-orange-500',  'from-pink-400 to-rose-500',
  'from-teal-400 to-teal-600',     'from-cyan-400 to-cyan-600',
]

export default function HCPDirectory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { allHCPs, searchResults, isSearching, isFetching } = useSelector(s => s.hcp)
  const [query, setQuery]   = useState('')
  const [view, setView]     = useState('table') // table | grid
  const [filter, setFilter] = useState('All')

  useEffect(() => { dispatch(fetchAllHCPs()) }, [dispatch])

  const handleSearch = (e) => {
    const v = e.target.value; setQuery(v)
    if (v.trim().length >= 2) dispatch(searchHCPs(v))
  }

  const displayed = query.trim().length >= 2 ? searchResults : allHCPs
  const specialties = ['All', ...new Set(allHCPs.map(h => h.specialty).filter(Boolean))]
  const filtered = filter === 'All' ? displayed : displayed.filter(h => h.specialty === filter)

  const handleSelect = (hcp) => { dispatch(selectHCP(hcp)); navigate('/log-interaction') }

  return (
    <div className="h-full flex flex-col bg-[#f4f6fa] overflow-hidden">

      {/* Page header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/80 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg viewBox="0 0 20 20" fill="currentColor"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input type="text" value={query} onChange={handleSearch}
                placeholder="Search by name, specialty or hospital…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800
                           placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"/>
              {isSearching && (
                <svg className="animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              )}
            </div>

            {/* Specialty filter pills */}
            <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
              {specialties.slice(0, 6).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all
                    ${filter === s
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {[['table','M3 4a1 1 0 000 2h14a1 1 0 100-2H3zM3 8a1 1 0 000 2h14a1 1 0 100-2H3zM3 12a1 1 0 000 2h14a1 1 0 100-2H3z'],
                ['grid', 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z']
              ].map(([v, d]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`w-8 h-7 rounded-lg flex items-center justify-center transition-all ${view === v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d={d} clipRule="evenodd"/></svg>
                </button>
              ))}
            </div>

            {/* Add HCP */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm shadow-indigo-500/20">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
              Add HCP
            </button>
          </div>
        </div>
      </div>

      {/* Count bar */}
      <div className="flex-shrink-0 px-6 py-2.5 flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{filtered.length} healthcare professionals</span>
        {filter !== 'All' && (
          <button onClick={() => setFilter('All')} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">
            × Clear filter
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isFetching ? (
          <div className="flex items-center justify-center h-48">
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Loading HCP directory…
            </div>
          </div>
        ) : view === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Name','Specialty','Hospital','Territory','Contact','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((hcp, i) => {
                  const spec = SPEC_COLORS[hcp.specialty] || SPEC_COLORS.default
                  const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                  const ini  = hcp.name.split(' ').map(w=>w[0]).join('').slice(0,2)
                  return (
                    <tr key={hcp.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleSelect(hcp)}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                            {ini}
                          </div>
                          <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{hcp.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${spec}`}>{hcp.specialty || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{hcp.hospital || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{hcp.territory || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{hcp.email || '—'}</td>
                      <td className="px-5 py-3.5" onClick={e => { e.stopPropagation(); navigate(`/timeline/${hcp.id}`) }}>
                        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline whitespace-nowrap">
                          Timeline →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">No HCPs found{query ? ` for "${query}"` : ''}.</div>
            )}
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((hcp, i) => {
              const spec = SPEC_COLORS[hcp.specialty] || SPEC_COLORS.default
              const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
              const ini  = hcp.name.split(' ').map(w=>w[0]).join('').slice(0,2)
              return (
                <div key={hcp.id} onClick={() => handleSelect(hcp)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>{ini}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{hcp.name}</div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 mt-1 inline-block ${spec}`}>{hcp.specialty || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-500">
                    {hcp.hospital  && <div className="flex items-center gap-1.5 truncate"><span>🏥</span>{hcp.hospital}</div>}
                    {hcp.territory && <div className="flex items-center gap-1.5"><span>📍</span>{hcp.territory}</div>}
                    {hcp.email     && <div className="flex items-center gap-1.5 truncate"><span>✉</span>{hcp.email}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}