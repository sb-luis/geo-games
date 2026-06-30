'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'practice_time_limit'
const DEFAULT_LIMIT_MS = 15 * 60 * 1000

// minutes → ms, null = no limit
const OPTIONS: { label: string; ms: number | null }[] = [
  { label: '1m',       ms:  1 * 60 * 1000 },
  { label: '2m',       ms:  2 * 60 * 1000 },
  { label: '3m',       ms:  3 * 60 * 1000 },
  { label: '5m',       ms:  5 * 60 * 1000 },
  { label: '10m',      ms: 10 * 60 * 1000 },
  { label: '15m',      ms: 15 * 60 * 1000 },
  { label: '20m',      ms: 20 * 60 * 1000 },
  { label: '30m',      ms: 30 * 60 * 1000 },
  { label: 'no limit', ms: null },
]

export function loadPracticeTimeLimit(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return DEFAULT_LIMIT_MS
    if (raw === 'null') return null
    const n = Number(raw)
    return isNaN(n) ? DEFAULT_LIMIT_MS : n
  } catch {
    return DEFAULT_LIMIT_MS
  }
}

export function savePracticeTimeLimit(ms: number | null) {
  try {
    localStorage.setItem(STORAGE_KEY, ms === null ? 'null' : String(ms))
  } catch {}
}

interface Props {
  onConfirm: (timeLimitMs: number | null) => void
  onClose:   () => void
}

export function PracticeTimeLimitModal({ onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<number | null>(loadPracticeTimeLimit)

  const handleConfirm = () => {
    savePracticeTimeLimit(selected)
    onConfirm(selected)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-lg px-7 py-6 w-full max-w-xs space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors text-xl leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Practice</p>
          <p className="text-base font-bold text-gray-900">set a time limit</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {OPTIONS.map(opt => (
            <button
              key={String(opt.ms)}
              onClick={() => setSelected(opt.ms)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer select-none ${
                selected === opt.ms
                  ? 'bg-gray-900 text-white'
                  : 'bg-black/6 text-gray-600 hover:bg-black/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Button className="w-full" onClick={handleConfirm}>
          start
        </Button>
      </div>
    </div>
  )
}
