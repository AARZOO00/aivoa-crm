import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { applySuggestion } from '../../store/slices/interactionSlice'

export default function AIFollowupSuggestions() {
  const dispatch = useDispatch()
  const { aiSuggestions } = useSelector(s => s.interaction)

  if (!aiSuggestions || aiSuggestions.length === 0) return null

  return (
    <div className="mt-3 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-indigo-100 bg-indigo-50/80">
        <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px]">✨</span>
        </div>
        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest">AI Suggested Follow-ups</span>
        <span className="ml-auto text-[10px] font-bold bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">
          {aiSuggestions.length} suggestions
        </span>
      </div>
      <div className="divide-y divide-indigo-100/50">
        {aiSuggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-indigo-50/50 transition-colors group">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 text-indigo-700 text-[10px] font-black flex items-center justify-center mt-0.5">{i + 1}</span>
            <span className="flex-1 text-xs text-indigo-900 leading-relaxed">{s}</span>
            <button type="button" onClick={() => dispatch(applySuggestion(s))}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold
                         text-indigo-600 bg-indigo-100 hover:bg-indigo-600 hover:text-white
                         px-2.5 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-600">
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}