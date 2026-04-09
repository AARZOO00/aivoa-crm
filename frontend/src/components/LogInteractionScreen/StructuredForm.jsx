import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateFormField, createInteraction, resetForm, clearError,
} from '../../store/slices/interactionSlice.js'
import HCPSelector from './HCPSelector.jsx'
import MaterialsSection from './MaterialsSection.jsx'
import SentimentSelector from './SentimentSelector.jsx'
import AIFollowupSuggestions from './AIFollowupSuggestions.jsx'

const INTERACTION_TYPES = [
  { value: 'Meeting',    icon: '🤝', color: 'indigo' },
  { value: 'Call',       icon: '📞', color: 'blue' },
  { value: 'Email',      icon: '✉️',  color: 'cyan' },
  { value: 'Conference', icon: '🎤', color: 'violet' },
  { value: 'CME',        icon: '🎓', color: 'emerald' },
]

const FIELD_LABEL = 'block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2'
const FIELD_INPUT = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all'
const FIELD_TEXTAREA = `${FIELD_INPUT} resize-none leading-relaxed`

export default function StructuredForm() {
  const dispatch   = useDispatch()
  const { formData, isSubmitting, submitSuccess, error } = useSelector(s => s.interaction)
  const [attendeeInput, setAttendeeInput] = useState('')
  const [voiceConsent, setVoiceConsent]   = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  const set = (field, value) => dispatch(updateFormField({ field, value }))

  const handleAddAttendee = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && attendeeInput.trim()) {
      e.preventDefault()
      const name = attendeeInput.trim().replace(/,$/, '')
      if (name && !formData.attendees.includes(name))
        set('attendees', [...formData.attendees, name])
      setAttendeeInput('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const payload = { ...formData }
    delete payload.hcp_name
    await dispatch(createInteraction(payload))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">

      {/* ── FORM BODY ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Banners */}
        {submitSuccess && (
          <div className="mx-5 mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-800">Interaction logged successfully!</div>
              <div className="text-xs text-emerald-600 mt-0.5">Record saved to your HCP interaction history</div>
            </div>
          </div>
        )}
        {error && (
          <div className="mx-5 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Section 1 — HCP & Type */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">1</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Healthcare Professional</span>
          </div>
          <HCPSelector />
        </div>

        {/* Section 2 — Type + Date/Time */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">2</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Interaction Details</span>
          </div>

          {/* Type pills */}
          <div className="mb-4">
            <label className={FIELD_LABEL}>Type</label>
            <div className="flex gap-2 flex-wrap">
              {INTERACTION_TYPES.map(({ value, icon }) => {
                const active = formData.interaction_type === value
                return (
                  <button key={value} type="button" onClick={() => set('interaction_type', value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border
                      ${active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                    <span>{icon}</span>{value}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={FIELD_LABEL}>Date</label>
              <input type="date" value={formData.date}
                onChange={e => set('date', e.target.value)} className={FIELD_INPUT} />
            </div>
            <div>
              <label className={FIELD_LABEL}>Time</label>
              <input type="time" value={formData.time}
                onChange={e => set('time', e.target.value)} className={FIELD_INPUT} />
            </div>
          </div>
        </div>

        {/* Section 3 — Attendees */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">3</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Attendees</span>
            {formData.attendees.length > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {formData.attendees.length} added
              </span>
            )}
          </div>
          <div className={`min-h-[44px] flex flex-wrap gap-2 rounded-xl border px-3 py-2.5 transition-all bg-slate-50
            ${formData.attendees.length > 0 || attendeeInput ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10'}`}>
            {formData.attendees.map(name => (
              <span key={name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                {name}
                <button type="button" onClick={() => set('attendees', formData.attendees.filter(a => a !== name))}
                  className="hover:text-indigo-900 transition-colors ml-0.5 leading-none opacity-60 hover:opacity-100">✕</button>
              </span>
            ))}
            <input type="text" value={attendeeInput}
              onChange={e => setAttendeeInput(e.target.value)}
              onKeyDown={handleAddAttendee}
              placeholder={formData.attendees.length === 0 ? 'Type name and press Enter…' : 'Add more…'}
              className="flex-1 min-w-[130px] text-sm text-slate-800 outline-none bg-transparent placeholder-slate-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 pl-1">Press Enter or comma after each name</p>
        </div>

        {/* Section 4 — Topics */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">4</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Topics Discussed</span>
            <button type="button" onClick={() => setVoiceConsent(!voiceConsent)}
              className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
              </svg>
              Voice Note
            </button>
          </div>
          {voiceConsent && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-amber-800">Consent required before recording</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">HCP/patient consent is required per compliance policy before summarizing voice notes.</p>
                <button type="button" onClick={() => setVoiceConsent(false)}
                  className="mt-2 text-xs font-bold text-amber-700 underline hover:text-amber-900">
                  ✓ Consent obtained — Summarize Voice Note
                </button>
              </div>
            </div>
          )}
          <textarea value={formData.topics_discussed}
            onChange={e => set('topics_discussed', e.target.value)}
            placeholder="Describe key topics, products discussed, clinical data presented, questions raised…"
            rows={3} className={FIELD_TEXTAREA} />
        </div>

        {/* Section 5 — Materials & Samples */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">5</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Materials & Samples</span>
          </div>
          <MaterialsSection />
        </div>

        {/* Section 6 — Sentiment */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">6</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">HCP Sentiment</span>
          </div>
          <SentimentSelector />
        </div>

        {/* Section 7 — Outcomes & Follow-up */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">7</div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Outcomes & Next Steps</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className={FIELD_LABEL}>Outcomes</label>
              <textarea value={formData.outcomes}
                onChange={e => set('outcomes', e.target.value)}
                placeholder="What was achieved, agreed upon or decided…"
                rows={2} className={FIELD_TEXTAREA} />
            </div>
            <div>
              <label className={FIELD_LABEL}>Follow-up Actions</label>
              <textarea value={formData.follow_up_actions}
                onChange={e => set('follow_up_actions', e.target.value)}
                placeholder="Next steps, tasks, scheduled calls…"
                rows={2} className={FIELD_TEXTAREA} />
              <AIFollowupSuggestions />
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {formData.ai_summary && (
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🤖</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI Summary</span>
              <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600">Auto-generated</span>
            </div>
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed">
              {formData.ai_summary}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* ── FOOTER ── */}
      <div className="flex-shrink-0 bg-white border-t border-slate-100 px-5 py-3.5">
        <div className="flex gap-2.5">
          <button type="button" onClick={() => { dispatch(resetForm()); setAttendeeInput('') }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">
            Reset
          </button>
          <button type="submit" disabled={isSubmitting}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95
              ${isSubmitting
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25'}`}>
            {isSubmitting ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Logging…</>
            ) : (
              <><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>Log Interaction</>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}