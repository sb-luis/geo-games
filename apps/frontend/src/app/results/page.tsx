'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResultsScreen } from '@/components/game/ResultsScreen'
import { useSocket } from '@/lib/multiplayer/SocketContext'
import { useGame } from '@/lib/game/GameContext'

export default function ResultsPage() {
  const router           = useRouter()
  const { emitStatus }   = useSocket()
  const { results, mode, elapsedSeconds } = useGame()

  useEffect(() => { emitStatus('playing') }, [emitStatus])

  // Redirect to home on hard refresh (results only null if no game was played in this session)
  useEffect(() => {
    if (results === null) router.replace('/')
  }, [results, router])

  if (results === null) return null

  return (
    <ResultsScreen
      results={results}
      mode={mode}
      elapsedSeconds={elapsedSeconds ?? undefined}
      onContinue={() => router.push('/')}
    />
  )
}
