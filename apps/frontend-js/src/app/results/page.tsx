'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ResultsScreen } from '@/components/game/ResultsScreen'
import { useSocket } from '@/lib/multiplayer/SocketContext'
import { useGame } from '@/lib/game/GameContext'
import { useAuth } from '@/lib/auth/AuthContext'
import { useGeoData } from '@/lib/geo/GeoDataContext'
import { LEVELS } from '@/lib/geo/lod'
import type { CountryStat } from '@/components/stats/WorldMap'
import type { GeoCollection } from '@/lib/geo/types'

const VARIANT = 'ne_110m_admin_0_countries'

interface StatsResponse {
  games_played:    number
  games_completed: number
  countries:       CountryStat[]
}

export default function ResultsPage() {
  const router              = useRouter()
  const { emitStatus }      = useSocket()
  const { results, mode, elapsedMs } = useGame()
  const { user }            = useAuth()
  const { loadCollection }  = useGeoData()

  const [geo,   setGeo]   = useState<GeoCollection | null>(null)
  const [stats, setStats] = useState<StatsResponse | null>(null)

  useEffect(() => { emitStatus('results') }, [emitStatus])

  useEffect(() => {
    if (results === null) router.replace('/')
  }, [results, router])

  // Fetch geo + stats for the practice map
  useEffect(() => {
    if (mode !== 'practice' || !user) return
    loadCollection(LEVELS[0].url).then(setGeo).catch(() => {})
    fetch(`/api/practice/stats?variant=${encodeURIComponent(VARIANT)}`)
      .then(r => r.ok ? r.json() as Promise<StatsResponse> : Promise.reject())
      .then(setStats)
      .catch(() => {})
  }, [mode, user, loadCollection])

  if (results === null) return null

  return (
    <ResultsScreen
      results={results}
      mode={mode}
      elapsedMs={elapsedMs ?? undefined}
      geo={geo ?? undefined}
      practiceStats={stats ?? undefined}
      onReturn={() => router.push('/')}
    />
  )
}
