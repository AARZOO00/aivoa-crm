import React, { useState, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { voiceAPI } from '@/services/api'
import { updateFormField } from '@/store/slices/interactionSlice'

const STATES = { idle: 'idle', recording: 'recording', processing: 'processing', done: 'done', error: 'error' }

export default function VoiceRecorder({ onTranscript }) {
  const dispatch = useDispatch()
  const [recState, setRecState] = useState(STATES.idle)
  const [transcript, setTranscript] = useState('')
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  const startRecording = useCallback(async () => {
    if (!consentGiven) { setError('Please confirm consent before recording.'); return }
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        await sendToWhisper(blob)
      }
      recorder.start(250)
      setRecState(STATES.recording)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.')
      setRecState(STATES.error)
    }
  }, [consentGiven])

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current)
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stop()
      setRecState(STATES.processing)
    }
  }, [])

  const sendToWhisper = async (blob) => {
    try {
      setRecState(STATES.processing)
      const res = await voiceAPI.transcribe(blob)
      const { transcript: text, structured_data } = res.data
      setTranscript(text)
      setRecState(STATES.done)

      // Auto-fill form fields
      if (structured_data) {
        if (structured_data.topics_discussed) dispatch(updateFormField({ field: 'topics_discussed', value: structured_data.topics_discussed }))
        if (structured_data.sentiment && ['Positive','Neutral','Negative'].includes(structured_data.sentiment)) dispatch(updateFormField({ field: 'sentiment', value: structured_data.sentiment }))
        if (structured_data.outcomes) dispatch(updateFormField({ field: 'outcomes', value: structured_data.outcomes }))
        if (structured_data.follow_up_actions) dispatch(updateFormField({ field: 'follow_up_actions', value: structured_data.follow_up_actions }))
        if (structured_data.ai_summary) dispatch(updateFormField({ field: 'ai_summary', value: structured_data.ai_summary }))
      }
      if (onTranscript) onTranscript(text, structured_data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Transcription failed. Check your GROQ_API_KEY.')
      setRecState(STATES.error)
    }
  }

  const reset = () => { setRecState(STATES.idle); setTranscript(''); setError(''); setDuration(0) }

  const fmtTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-rose-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
          </svg>
        </div>
        <span className="text-sm font-medium text-slate-800">Voice Note Transcription</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">Requires Consent</span>
      </div>

      {/* Consent */}
      {!consentGiven && (
        <label className="flex items-start gap-2.5 cursor-pointer p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <input type="checkbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} className="mt-0.5 rounded"/>
          <span className="text-xs text-amber-800 leading-relaxed">
            I confirm the HCP has given verbal consent to have this conversation recorded and transcribed for CRM purposes.
          </span>
        </label>
      )}

      {consentGiven && recState === STATES.idle && (
        <button onClick={startRecording}
          className="w-full flex items-center justify-center gap-2 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8"/>
          </svg>
          Start Recording
        </button>
      )}

      {recState === STATES.recording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"/>
              <span className="text-sm font-medium text-rose-700">Recording...</span>
            </div>
            <span className="text-sm font-mono text-rose-600 font-medium">{fmtTime(duration)}</span>
          </div>
          <button onClick={stopRecording}
            className="w-full h-9 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            Stop Recording
          </button>
        </div>
      )}

      {recState === STATES.processing && (
        <div className="flex items-center justify-center gap-2.5 py-3 text-sm text-slate-600">
          <svg className="animate-spin w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Transcribing with Whisper...
        </div>
      )}

      {recState === STATES.done && transcript && (
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs font-medium text-slate-500 mb-1">Transcript</p>
            <p className="text-sm text-slate-700 leading-relaxed">{transcript}</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs text-emerald-700 font-medium">Form auto-filled from transcript</span>
          </div>
          <button onClick={reset} className="w-full h-8 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-600 transition-colors">
            Record Again
          </button>
        </div>
      )}

      {(recState === STATES.error || error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-700">{error}</p>
          <button onClick={reset} className="mt-2 text-xs text-red-600 underline underline-offset-2">Try again</button>
        </div>
      )}
    </div>
  )
}