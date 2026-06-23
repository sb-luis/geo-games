'use client'

import { useState, useCallback } from 'react'
import { WelcomeScreen } from '@/components/game/WelcomeScreen'
import { GameScreen } from '@/components/game/GameScreen'
import { ResultsScreen } from '@/components/game/ResultsScreen'
import { useCountryNames, pickRandom } from '@/lib/game/countries'
import type { GamePhase, RoundResult } from '@/lib/game/types'

export default function Page() {
  const [phase, setPhase] = useState<GamePhase>('welcome')
  const [targets, setTargets] = useState<string[]>([])
  const [results, setResults] = useState<RoundResult[]>([])

  const countryNames = useCountryNames()

  const startGame = useCallback(() => {
    if (!countryNames.length) return
    setTargets(pickRandom(countryNames, 10))
    setResults([])
    setPhase('playing')
  }, [countryNames])

  const handleGameEnd = useCallback((r: RoundResult[]) => {
    setResults(r)
    setPhase('results')
  }, [])

  const handleExit = useCallback(() => {
    setPhase('welcome')
  }, [])

  if (phase === 'welcome') {
    return <WelcomeScreen onStart={startGame} loading={countryNames.length === 0} />
  }
  if (phase === 'playing') {
    return <GameScreen targets={targets} onEnd={handleGameEnd} />
  }
  return <ResultsScreen results={results} onPlayAgain={startGame} onExit={handleExit} />
}
