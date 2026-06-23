export type GamePhase = 'welcome' | 'playing' | 'results'

export interface RoundResult {
  country: string
  guessed: boolean
  timeMs: number
}
