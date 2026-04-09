import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { BASE_URL } from '@/services/api'

const TOOL_LABELS = {
  log_interaction: { label: 'Logged', color: 'bg-blue-100 text-blue-700' },
  edit_interaction: { label: 'Edited', color: 'bg-amber-100 text-amber-700' },
  search_hcp:       { label: 'HCP Search', color: 'bg-violet-100 text-violet-700' },
  suggest_followup: { label: 'Follow-ups', color: 'bg-emerald-100 text-emerald-700' },
  analyze_sentiment:{ label: 'Sentiment',  color: 'bg-rose-100 text-rose-700' },
  general:          { label: 'Assistant',  color: 'bg-slate-100 text-slate-600' },
  error:            { label: 'Error',      color: 'bg-red-100 text-red-600' },
}

const EXAMPLE_PROMPTS = [
  'Met Dr. Priya Sharma at Apollo, discussed Cardio-X Phase III efficacy, positive response, shared brochure',
  'Search for cardiologists in Bangalore',
  'Suggest follow-ups for a meeting about Phase III trial results',
  'Analyze sentiment: HCP asked many questions about side effects and seemed cautious',
]

function ToolBadge({ tool }) {
  const info = TOOL_LABELS[tool] || TOOL_LABELS.general
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>{info.label}</span>
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
        </svg>
      </div>
      <div className="chat-bubble-ai flex items-center gap-1.5 px-4 py-3">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"/>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"/>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 typing-dot"/>
      </div>
    </div>
  )
}

function StreamingBubble({ content, tool_used }) {
  const formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
        </svg>
      </div>
      <div className="flex flex-col gap-1 max-w-[88%]">
        {tool_used && tool_used !== 'general' && <ToolBadge tool={tool_used}/>}
        <div className="chat-bubble-ai">
          <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }}/>
          <span className="inline-block w-0.5 h-3.5 bg-slate-400 ml-0.5 animate-pulse align-middle"/>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const formatted = message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
        </div>
      )}
      <div className={`flex flex-col gap-1 max-w-[88%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && message.tool_used && message.tool_used !== 'general' && <ToolBadge tool={message.tool_used}/>}
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
          <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }}/>
        </div>
        <span className="text-xs text-slate-400 px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, resetChat } = useAgent()
  const [inputValue, setInputValue] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [streamingTool, setStreamingTool] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, streamingContent])

  const handleStreamSend = useCallback(async (text) => {
    if (!text?.trim() || isLoading || isStreaming) return
    setInputValue('')
    setStreamingContent('')
    setStreamingTool('')
    setIsStreaming(true)

    const token = localStorage.getItem('access_token')
    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Add user message to store via hook
      await sendMessage(text, null, true)
    } catch {
      // sendMessage handles its own errors
    } finally {
      setIsStreaming(false)
      setStreamingContent('')
    }
  }, [isLoading, isStreaming, sendMessage])

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || isLoading || isStreaming) return
    setInputValue('')
    await sendMessage(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">AI Assistant</div>
            <div className="text-xs text-slate-400">Log interaction via chat</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-xs font-medium text-emerald-600">Gemma 2 · Streaming</span>
          </div>
          {messages.length > 0 && (
            <button onClick={resetChat} title="Clear chat"
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
        {isEmpty && !isStreaming ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">Describe your HCP interaction</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-5">
              Type naturally — the AI will extract structured data and auto-fill the form. Responses stream in real time.
            </p>
            <div className="w-full space-y-2">
              <p className="text-xs font-medium text-slate-500 text-left mb-1.5">Try an example:</p>
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <button key={i} onClick={() => setInputValue(prompt)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-xs text-slate-600 hover:text-blue-700 transition-all">
                  <span className="text-slate-300 mr-1.5">→</span>
                  {prompt.length > 80 ? prompt.slice(0, 80) + '...' : prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => <MessageBubble key={msg.id} message={msg}/>)}
            {isLoading && !streamingContent && <TypingIndicator/>}
            {streamingContent && <StreamingBubble content={streamingContent} tool_used={streamingTool}/>}
          </>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative">
            <textarea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Describe interaction..." rows={2}
              className="form-textarea resize-none pr-3 text-sm leading-relaxed w-full"/>
          </div>
          <button onClick={handleSend} disabled={!inputValue.trim() || isLoading || isStreaming}
            className="btn-primary px-4 py-3 flex-shrink-0 self-end">
            {(isLoading || isStreaming) ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 px-0.5">
          <span className="text-xs text-slate-400">Powered by</span>
          <span className="text-xs font-semibold text-slate-500">LangGraph · Groq · SSE Streaming</span>
          <span className="ml-auto text-xs text-slate-300">↵ Send</span>
        </div>
      </div>
    </div>
  )
}