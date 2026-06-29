'use client'

import { StatCards } from '@/components/stats/StatCards'
import type { RoundResult } from '@/lib/game/types'

interface Props {
  results: RoundResult[]
}

export function PlayResults({ results }: Props) {
  const correct = results.filter(r => r.outcome === 'correct')
  const wrong   = results.filter(r => r.outcome === 'wrong').length
  const skipped = results.filter(r => r.outcome === 'skipped').length

  return (
    <>
      <StatCards stats={[
        { label: 'correct', value: correct.length },
        { label: 'wrong',   value: wrong },
        { label: 'skipped', value: skipped },
      ]} />

      {correct.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ul className="divide-y divide-gray-50">
            {correct.map((r, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-gray-800">{r.country}</span>
                <span className="tabular-nums text-xs text-gray-400 shrink-0 ml-3">
                  {(r.timeMs / 1000).toFixed(1)}s
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
