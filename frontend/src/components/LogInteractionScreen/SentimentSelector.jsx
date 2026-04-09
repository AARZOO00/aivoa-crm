import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from '../../store/slices/interactionSlice.js'

const OPTIONS = [
  {
    value: 'Positive',
    emoji: '😊',
    label: 'Positive',
    desc: 'Receptive & engaged',
    active: 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25',
    idle:   'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600',
  },
  {
    value: 'Neutral',
    emoji: '😐',
    label: 'Neutral',
    desc: 'No strong reaction',
    active: 'bg-slate-600 text-white border-slate-600 shadow-md shadow-slate-500/20',
    idle:   'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50',
  },
  {
    value: 'Negative',
    emoji: '😟',
    label: 'Negative',
    desc: 'Had concerns',
    active: 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25',
    idle:   'bg-white text-slate-500 border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600',
  },
]

export default function SentimentSelector() {
  const dispatch  = useDispatch()
  const sentiment = useSelector(s => s.interaction.formData.sentiment)

  return (
    <div className="flex gap-2.5">
      {OPTIONS.map(opt => {
        const sel = sentiment === opt.value
        return (
          <button key={opt.value} type="button"
            onClick={() => dispatch(updateFormField({ field: 'sentiment', value: opt.value }))}
            className={`flex-1 flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl border-2 transition-all duration-150 cursor-pointer
              ${sel ? opt.active : opt.idle}`}>
            <span className="text-2xl leading-none">{opt.emoji}</span>
            <span className={`text-xs font-bold leading-none ${sel ? 'opacity-100' : 'opacity-70'}`}>{opt.label}</span>
            <span className={`text-[10px] leading-tight text-center ${sel ? 'opacity-80' : 'opacity-50'}`}>{opt.desc}</span>
          </button>
        )
      })}
    </div>
  )
}