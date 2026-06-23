'use client'

import type { RoundResult } from '@/lib/game/types'

interface Props {
  results: RoundResult[]
  onPlayAgain: () => void
  onExit: () => void
}

function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

export function ResultsScreen({ results, onPlayAgain, onExit }: Props) {
  const correct = results.filter(r => r.guessed).length
  const totalMs = results.reduce((sum, r) => sum + r.timeMs, 0)

  return (
    <main className="w-screen h-screen bg-[#f3f3f3] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Results</h2>
        <p className="text-center text-gray-400 text-sm mt-1 mb-6">
          {correct} / 10 correct &middot; {formatTime(totalMs)} total
        </p>

        <ul className="space-y-2 mb-8">
          {results.map((r, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className={r.guessed ? 'text-gray-700' : 'text-gray-400'}>
                {r.country}
              </span>
              <span className={r.guessed ? 'text-green-600 font-medium' : 'text-red-400'}>
                {r.guessed ? formatTime(r.timeMs) : 'missed'}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={onExit}
            className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Exit
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2.5 rounded-full bg-[#427cdf] text-white text-sm font-semibold hover:bg-[#3569c7] transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </main>
  )
}
