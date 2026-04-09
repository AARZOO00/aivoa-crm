import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from '../../store/slices/interactionSlice.js'

const presetMaterials = [
  'Efficacy Brochure',
  'Safety Data Sheet',
  'Clinical Trial Summary',
  'Product Monograph',
  'Dosing Guide',
  'Patient Case Studies',
]

const presetSamples = [
  'Product A — 10mg (x6)',
  'Product B — 25mg (x4)',
  'Product C — Starter Pack',
]

function TagList({ items, onRemove, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  }
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${colors[color]}`}
        >
          {item}
          <button
            onClick={() => onRemove(i)}
            className="ml-0.5 opacity-60 hover:opacity-100 text-xs"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  )
}

function AddItemInput({ placeholder, onAdd, presets, color }) {
  const [val, setVal] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  const add = (v) => {
    const trimmed = (v || val).trim()
    if (trimmed) { onAdd(trimmed); setVal('') }
    setShowPresets(false)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setShowPresets(true)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="form-input flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => add()}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
        >
          + Add
        </button>
      </div>
      {showPresets && presets && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg">
          {presets.map((p) => (
            <button
              key={p}
              onMouseDown={() => add(p)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-slate-700 border-b border-slate-50 last:border-0"
            >
              {p}
            </button>
          ))}
          <button
            onMouseDown={() => setShowPresets(false)}
            className="w-full text-center px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default function MaterialsSection() {
  const dispatch = useDispatch()
  const materials = useSelector((s) => s.interaction.formData.materials_shared || [])
  const samples = useSelector((s) => s.interaction.formData.samples_distributed || [])

  const addMaterial = (item) => {
    if (!materials.includes(item)) {
      dispatch(updateFormField({ field: 'materials_shared', value: [...materials, item] }))
    }
  }
  const removeMaterial = (i) => {
    dispatch(updateFormField({ field: 'materials_shared', value: materials.filter((_, idx) => idx !== i) }))
  }

  const addSample = (item) => {
    if (!samples.includes(item)) {
      dispatch(updateFormField({ field: 'samples_distributed', value: [...samples, item] }))
    }
  }
  const removeSample = (i) => {
    dispatch(updateFormField({ field: 'samples_distributed', value: samples.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="space-y-4">
      {/* Materials */}
      <div>
        <label className="form-label">Materials Shared</label>
        <AddItemInput
          placeholder="Search or type material name..."
          onAdd={addMaterial}
          presets={presetMaterials}
          color="blue"
        />
        {materials.length > 0 && (
          <TagList items={materials} onRemove={removeMaterial} color="blue" />
        )}
      </div>

      {/* Samples */}
      <div>
        <label className="form-label">Samples Distributed</label>
        <AddItemInput
          placeholder="Add sample product..."
          onAdd={addSample}
          presets={presetSamples}
          color="purple"
        />
        {samples.length > 0 && (
          <TagList items={samples} onRemove={removeSample} color="purple" />
        )}
      </div>
    </div>
  )
}