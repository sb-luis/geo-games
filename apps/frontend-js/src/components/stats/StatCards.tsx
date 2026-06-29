'use client'

import { useEffect, useState } from 'react'
import NumberFlow from '@number-flow/react'

interface StatCard {
  label: string
  value: string | number
}

interface Props {
  stats: StatCard[]
}

export function StatCards({ stats }: Props) {
  const [displayed, setDisplayed] = useState<(string | number)[]>(
    stats.map(s => typeof s.value === 'number' ? 0 : s.value)
  )

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(stats.map(s => s.value)), 150)
    return () => clearTimeout(t)
  }, [stats])

  return (
    <div className={`grid gap-3 ${
      stats.length === 1 ? 'grid-cols-1' :
      stats.length === 3 ? 'grid-cols-3' :
      stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' :
      'grid-cols-2'
    }`}>
      {stats.map(({ label }, i) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-black text-gray-900 tabular-nums">
            {typeof displayed[i] === 'number'
              ? <NumberFlow value={displayed[i] as number} />
              : displayed[i]
            }
          </p>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}
