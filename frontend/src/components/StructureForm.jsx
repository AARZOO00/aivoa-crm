import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateFormField, addAttendee, removeAttendee,
  createInteraction, resetForm, clearMessages,
} from '@/store/slices/interactionSlice'
import { sendAgentMessage, addUserMessage } from '@/store/slices/agentSlice'
import HCPSelector from './HCPSelector'
import MaterialsSection from './MaterialsSection'
import SentimentSelector from './SentimentSelector'
import AIFollowupSuggestions from './AIFollowupSuggestions'
import VoiceRecorder from '@/components/Voice/VoiceRecorder'

const INTERACTION_TYPES = ['Meeting', 'Call', 'Email', 'Conference', 'CME']

export default function StructuredForm() {
  const dispatch = useDispatch()
  const { formData, isSaving, successMessage, error } = useSelector((s) => s.interaction)
  const [attendeeInput, setAttendeeInput] = useState('')
  const [showVoice, setShowVoice] = useState(false)

  const handleFieldChange = (field) => (e) => dispatch(updateFormField({ field, value: e.target.value }))

  const handleAddAttendee = () => {
    if (attendeeInput.trim()) { dispatch(addAttendee(attendeeInput.trim())); setAttendeeInput('') }
  }

  const handleVoiceTranscript = (text, structured) => {
    setShowVoice(false)
    if (text) {
      const msg = `Voice note transcription: ${text}`
      dispatch(addUserMessage(msg))
      dispatch(sendAgentMessage({ message: msg, interactionId: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createInteraction({
      hcp_id: formData.hcp_id || null,
      interaction_type: formData.interaction_type || 'Meeting',
      date: formData.date, time: formData.time,
      attendees: formData.attendees,
      topics_discussed: formData.topics_discussed,
      materials_shared: formData.materials_shared,
      samples_distributed: formData.samples_distributed,
      sentiment: formData.sentiment || 'Neutral',
      outcomes: formData.outcomes,
      follow_up_actions: formData.follow_up_actions,
      ai_summary: formData.ai_summary,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Log HCP Interaction</h2>
          <p className="text-xs text-slate-400 mt-0.5">Fill manually or use AI chat →</p>
        </div>
        <button type="button" onClick={() => dispatch(resetForm())}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
        {successMessage && (
          <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-emerald-700 font-medium">{successMessage}</span>
            <button type="button" onClick={() => dispatch(clearMessages())} className="ml-auto text-emerald-400 hover:text-emerald-600">✕</button>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-red-700">{error}</span>
            <button type="button" onClick={() => dispatch(clearMessages())} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <HCPSelector/>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="form-label">Type</label>
            <select value={formData.interaction_type} onChange={handleFieldChange('interaction_type')} className="form-select">
              {INTERACTION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Date</label>
            <input type="date" value={formData.date} onChange={handleFieldChange('date')} className="form-input"/>
          </div>
          <div>
            <label className="form-label">Time</label>
            <input type="time" value={formData.time} onChange={handleFieldChange('time')} className="form-input"/>
          </div>
        </div>

        <div>
          <label className="form-label">Attendees</label>
          <div className="flex gap-2">
            <input type="text" value={attendeeInput} onChange={(e) => setAttendeeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
              placeholder="Add attendee name, press Enter..." className="form-input flex-1"/>
            <button type="button" onClick={handleAddAttendee} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-sm font-medium transition-colors">Add</button>
          </div>
          {formData.attendees.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {formData.attendees.map((a) => (
                <div key={a} className="tag">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  {a}
                  <button type="button" onClick={() => dispatch(removeAttendee(a))} className="tag-remove">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="form-label">Topics Discussed</label>
          <textarea value={formData.topics_discussed} onChange={handleFieldChange('topics_discussed')}
            placeholder="Describe what was discussed..." rows={3} className="form-textarea"/>
          <button type="button" onClick={() => setShowVoice(!showVoice)}
            className="mt-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
            {showVoice ? 'Hide Voice Recorder' : 'Summarize from Voice Note (Requires Consent)'}
          </button>
        </div>

        {showVoice && <VoiceRecorder onTranscript={handleVoiceTranscript}/>}

        <MaterialsSection/>
        <SentimentSelector/>

        <div>
          <label className="form-label">Outcomes</label>
          <textarea value={formData.outcomes} onChange={handleFieldChange('outcomes')}
            placeholder="Key outcomes from this interaction..." rows={2} className="form-textarea"/>
        </div>

        <div>
          <label className="form-label">Follow-up Actions</label>
          <textarea value={formData.follow_up_actions} onChange={handleFieldChange('follow_up_actions')}
            placeholder="Actions planned after this meeting..." rows={2} className="form-textarea"/>
        </div>

        <AIFollowupSuggestions/>

        {formData.ai_summary && (
          <div className="p-3 bg-violet-50 border border-violet-200 rounded-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <svg className="w-3.5 h-3.5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              <span className="text-xs font-semibold text-violet-700">AI Summary</span>
            </div>
            <p className="text-xs text-violet-800 leading-relaxed">{formData.ai_summary}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
        <button type="submit" disabled={isSaving} className="btn-primary w-full py-2.5 text-sm font-semibold">
          {isSaving ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Logging...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Log Interaction</>
          )}
        </button>
      </div>
    </form>
  )
}