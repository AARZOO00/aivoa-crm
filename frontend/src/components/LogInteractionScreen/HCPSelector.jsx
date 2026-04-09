import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchHCPs, selectHCP } from '../../store/slices/hcpSlice.js'
import { updateFormField } from '../../store/slices/interactionSlice.js'

const SPEC_DOT = {
  Cardiology:'bg-red-400', Oncology:'bg-purple-400', Neurology:'bg-blue-400',
  Endocrinology:'bg-amber-400', Rheumatology:'bg-pink-400', default:'bg-slate-400'
}

export default function HCPSelector() {
  const dispatch = useDispatch()
  const { searchResults, selectedHCP, isSearching } = useSelector(s => s.hcp)
  const [query, setQuery]   = useState('')
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef(null)
  const debounceRef         = useRef(null)

  const handleInput = useCallback(value => {
    setQuery(value); setOpen(true)
    clearTimeout(debounceRef.current)
    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => dispatch(searchHCPs(value)), 280)
    }
  }, [dispatch])

  const handleSelect = hcp => {
    dispatch(selectHCP(hcp))
    dispatch(updateFormField({ field: 'hcp_id', value: hcp.id }))
    dispatch(updateFormField({ field: 'hcp_name', value: hcp.name }))
    setQuery(hcp.name); setOpen(false)
  }

  const handleClear = () => {
    dispatch(selectHCP(null))
    dispatch(updateFormField({ field: 'hcp_id', value: null }))
    dispatch(updateFormField({ field: 'hcp_name', value: '' }))
    setQuery(''); setOpen(false)
  }

  useEffect(() => {
    const h = e => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (selectedHCP && query !== selectedHCP.name) setQuery(selectedHCP.name)
  }, [selectedHCP])

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
        </div>
        <input type="text" value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search Healthcare Professional…"
          className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all
            ${selectedHCP ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200'}`} />
        {query && (
          <button onClick={handleClear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {isSearching ? (
            <div className="px-4 py-3.5 flex items-center gap-3 text-sm text-slate-500">
              <svg className="animate-spin h-4 w-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Searching…
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{searchResults.length} results</span>
              </div>
              {searchResults.map(hcp => (
                <button key={hcp.id} onClick={() => handleSelect(hcp)}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {hcp.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{hcp.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      {hcp.specialty && <><div className={`w-1.5 h-1.5 rounded-full ${SPEC_DOT[hcp.specialty]||SPEC_DOT.default}`} />{hcp.specialty}</>}
                      {hcp.hospital && <><span>·</span>{hcp.hospital}</>}
                    </div>
                  </div>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-300 flex-shrink-0">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-4 text-sm text-slate-500 text-center">No HCPs found for "{query}"</div>
          ) : null}
        </div>
      )}

      {/* Selected HCP chip */}
      {selectedHCP && (
        <div className="mt-2.5 flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {selectedHCP.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-indigo-800 truncate">{selectedHCP.name}</div>
            <div className="text-xs text-indigo-500 truncate">
              {[selectedHCP.specialty, selectedHCP.hospital, selectedHCP.territory].filter(Boolean).join(' · ')}
            </div>
          </div>
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400" title="Selected" />
        </div>
      )}
    </div>
  )
}