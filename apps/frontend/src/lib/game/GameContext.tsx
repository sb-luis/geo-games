'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { useCountryNames, pickRandom } from './countries'
import type { RoundResult } from './types'

export interface LatLng { lat: number; lng: number }

interface GameContextValue {
  countryNames:         string[]
  targets:              string[]
  results:              RoundResult[] | null
  startGame:            () => void
  setResults:           (results: RoundResult[]) => void
  cameraOrientationRef: React.MutableRefObject<LatLng | null>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const countryNames          = useCountryNames()
  const [targets, setTargets] = useState<string[]>([])
  const [results, setResults] = useState<RoundResult[] | null>(null)
  const cameraOrientationRef  = useRef<LatLng | null>(null)

  const startGame = useCallback(() => {
    if (!countryNames.length) return
    setTargets(pickRandom(countryNames, countryNames.length))
    setResults(null)
  }, [countryNames])

  return (
    <GameContext.Provider value={{ countryNames, targets, results, startGame, setResults, cameraOrientationRef }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used inside GameProvider')
  return ctx
}
