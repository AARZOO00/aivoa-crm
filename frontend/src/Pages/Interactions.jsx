import React from 'react'
import StructuredForm from '../components/LogInteractionScreen/StructuredForm.jsx'
import ChatInterface from '../components/LogInteractionScreen/ChatInterface.jsx'

export default function Interactions() {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#f4f6fa' }}>
      {/* LEFT: Structured Form */}
      <div className="w-[50%] min-w-0 flex flex-col border-r border-slate-200/80 overflow-hidden bg-white">
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-500/30">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 leading-tight">Log HCP Interaction</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill manually or use AI chat →</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <StructuredForm />
        </div>
      </div>

      {/* RIGHT: AI Chat */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#f8fafc]">
        <ChatInterface />
      </div>
    </div>
  )
}