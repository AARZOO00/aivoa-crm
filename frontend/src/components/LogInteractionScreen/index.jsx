import React from 'react'
import StructuredForm from './StructuredForm.jsx'
import ChatInterface from './ChatInterface.jsx'

export default function LogInteractionScreen() {
  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      {/* LEFT PANEL — Structured Form */}
      <div className="w-[52%] min-w-0 flex flex-col border-r border-slate-200 overflow-hidden">
        {/* Panel header */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">📋</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800 leading-tight">
                Log HCP Interaction
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Fill in the form or use the AI assistant on the right
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto">
          <StructuredForm />
        </div>
      </div>

      {/* RIGHT PANEL — AI Chat */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  )
}