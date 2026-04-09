import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sendAgentMessage, addUserMessage, clearChat } from '../../store/slices/agentSlice.js'
import { autoFillFromAI, setAISuggestions } from '../../store/slices/interactionSlice.js'

const TOOL_BADGES = {
  log_interaction:   { label: 'Logged',    bg: 'bg-emerald-100 text-emerald-700' },
  edit_interaction:  { label: 'Edited',    bg: 'bg-amber-100 text-amber-700' },
  search_hcp:        { label: 'HCP Search',bg: 'bg-blue-100 text-blue-700' },
  suggest_followup:  { label: 'Follow-ups',bg: 'bg-indigo-100 text-indigo-700' },
  analyze_sentiment: { label: 'Sentiment', bg: 'bg-violet-100 text-violet-700' },
  general:           { label: 'AI',        bg: 'bg-slate-100 text-slate-600' },
  error:             { label: 'Error',     bg: 'bg-red-100 text-red-600' },
}

const QUICK_PROMPTS = [
  'Met Dr. Priya Sharma at Apollo today, discussed Cardio-X efficacy data, very positive response',
  'Search for cardiologists in Bangalore',
  'Suggest follow-ups for a meeting about Phase III trial results',
  'Analyze sentiment: HCP asked many questions about side effects and seemed cautious',
]

function renderContent(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} className={i > 0 ? 'mt-1' : ''}>
        {parts.map((p, j) => j % 2 === 1
          ? <strong key={j} className="font-semibold">{p}</strong>
          : p)}
      </p>
    )
  })
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const badge  = TOOL_BADGES[msg.tool_used]

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black mt-0.5
        ${isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'}`}>
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`max-w-[84%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && badge && msg.tool_used !== 'general' && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.bg}`}>{badge.label}</span>
        )}
        <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
          {renderContent(msg.content)}
        </div>
        <span className="text-[10px] text-slate-400 px-1">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">AI</div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0,150,300].map(d => (
            <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const dispatch  = useDispatch()
  const { messages, isLoading, sessionId } = useSelector(s => s.agent)
  const { currentInteraction } = useSelector(s => s.interaction)
  const [input, setInput]      = useState('')
  const bottomRef              = useRef(null)
  const textareaRef            = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isLoading])

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'assistant') return
    if (last.tool_used === 'log_interaction' && last.data?.extracted_data)
      dispatch(autoFillFromAI(last.data.extracted_data))
    if (last.tool_used === 'suggest_followup' && last.data?.tool_result?.suggestions)
      dispatch(setAISuggestions(last.data.tool_result.suggestions))
  }, [messages, dispatch])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    dispatch(addUserMessage(text))
    dispatch(sendAgentMessage({ message: text, interactionId: currentInteraction?.id || null }))
  }

  const showWelcome = messages.length === 0

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-500/30">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              AI Assistant
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Gemma 2 · 9B
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Log interaction via chat</div>
          </div>
        </div>
        <button onClick={() => dispatch(clearChat())}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all">
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-white">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-700 mb-1">Describe your HCP interaction</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-5">
              Type naturally — the AI will extract structured data and auto-fill the form on the left.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Try an example</p>
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => setInput(p)}
                  className="w-full text-left text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5
                             hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all leading-relaxed">
                  <span className="text-slate-300 mr-2">—</span>{p.length > 70 ? p.slice(0, 70) + '…' : p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200/80 px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea ref={textareaRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Describe interaction… (e.g. 'Met Dr. Smith, discussed Product X efficacy, positive sentiment')"
            rows={2} disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none
                       disabled:opacity-60 leading-relaxed" />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all
              ${isLoading || !input.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25 active:scale-95'}`}>
            {isLoading
              ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              : <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[10px] text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] border border-slate-200">Enter</kbd> send ·{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] border border-slate-200">Shift+Enter</kbd> newline
          </span>
          <span className="text-[10px] text-slate-400">Powered by LangGraph · Groq · gemma2-9b-it</span>
        </div>
      </div>
    </div>
  )
}