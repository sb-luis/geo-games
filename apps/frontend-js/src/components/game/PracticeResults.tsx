'use client'

import { WorldMap } from '@/components/stats/WorldMap'
import { StatCards } from '@/components/stats/StatCards'
import type { RoundResult } from '@/lib/game/types'
import type { CountryStat } from '@/components/stats/WorldMap'
import type { GeoCollection } from '@/lib/geo/types'

interface PracticeStatsResponse {
  games_played:    number
  games_completed: number
  countries:       CountryStat[]
}

interface Props {
  results:        RoundResult[]
  elapsedMs?:     number
  geo?:           GeoCollection
  practiceStats?: PracticeStatsResponse
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

export function PracticeResults({ results, elapsedMs, geo, practiceStats }: Props) {
  const correct = results.filter(r => r.outcome === 'correct')
  const wrong   = results.filter(r => r.outcome === 'wrong').length
  const skipped = results.filter(r => r.outcome === 'skipped').length

  const totalCorrect = practiceStats?.countries.reduce((s, c) => s + c.correct, 0) ?? 0
  const totalWrong   = practiceStats?.countries.reduce((s, c) => s + c.wrong,   0) ?? 0
  const totalSkipped = practiceStats?.countries.reduce((s, c) => s + c.skipped, 0) ?? 0

  return (
    <>
      {/* This game */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">This game</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <StatCards stats={[
        { label: 'time', value: elapsedMs != null ? formatElapsed(elapsedMs) : '—' },
      ]} />

      <StatCards stats={[
        { label: 'correct', value: correct.length },
        { label: 'wrong',   value: wrong },
        { label: 'skipped', value: skipped },
      ]} />

      {/* Correct countries breakdown */}
      {correct.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400">Correct countries</p>
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

      {/* All games */}
      {practiceStats && (
        <>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">All games</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <StatCards stats={[
            { label: 'games played', value: practiceStats.games_played },
          ]} />

          <StatCards stats={[
            { label: 'correct', value: totalCorrect },
            { label: 'wrong',   value: totalWrong },
            { label: 'skipped', value: totalSkipped },
          ]} />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {geo ? (
              <WorldMap geo={geo} stats={practiceStats.countries} />
            ) : (
              <div className="w-full rounded-xl bg-gray-100 animate-pulse" style={{ paddingBottom: '52.5%' }} />
            )}
          </div>
        </>
      )}
    </>
  )
}
