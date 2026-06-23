'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Globe } from '@/components/globe/Globe'
import type { RoundResult } from '@/lib/game/types'

const TOTAL = 10
const SECONDS = 30
const FEEDBACK_MS = 1500

interface Props {
  targets: string[]
  onEnd: (results: RoundResult[]) => void
}

type Feedback = {
  correct: boolean
  target: string
  clicked: string | null  // null means timed out, not a wrong click
} | null

export function GameScreen({ targets, onEnd }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(SECONDS)
  const [feedback, setFeedback] = useState<Feedback>(null)

  // Refs avoid stale closures inside callbacks and setTimeout
  const currentIndexRef = useRef(0)
  const resultsRef = useRef<RoundResult[]>([])
  const startTimeRef = useRef(performance.now())
  const doneRef = useRef(false)

  // Sync refs and reset start time whenever the active country changes
  useEffect(() => {
    currentIndexRef.current = currentIndex
    startTimeRef.current = performance.now()
    doneRef.current = false
  }, [currentIndex])

  const advance = useCallback(() => {
    const count = resultsRef.current.length
    if (count >= TOTAL) {
      onEnd([...resultsRef.current])
      return
    }
    setCurrentIndex(count)
    setTimeLeft(SECONDS)
    setFeedback(null)
  }, [onEnd])

  const record = useCallback(
    (guessed: boolean, clicked: string | null = null) => {
      if (doneRef.current) return
      doneRef.current = true
      const elapsed = performance.now() - startTimeRef.current
      const country = targets[currentIndexRef.current]
      resultsRef.current.push({ country, guessed, timeMs: elapsed })
      setFeedback({ correct: guessed, target: country, clicked })
      setTimeout(advance, FEEDBACK_MS)
    },
    [targets, advance],
  )

  // Countdown — one tick per second, stops at 0
  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft])

  // When the timer expires, record a miss
  useEffect(() => {
    if (timeLeft === 0) record(false)
  }, [timeLeft, record])

  const handleSelect = useCallback(
    (name: string | null) => {
      if (!name) return
      const isCorrect = name === targets[currentIndexRef.current]
      record(isCorrect, isCorrect ? null : name)
    },
    [targets, record],
  )

  return (
    <div className="relative w-screen h-screen">
      <Globe onSelect={handleSelect} showLabel={false} />

      {/* Progress + timer */}
      <div className="pointer-events-none absolute top-4 inset-x-0 flex justify-between items-center px-6">
        <span className="text-sm font-medium text-gray-500 bg-white/70 rounded-full px-3 py-1 backdrop-blur-sm">
          {currentIndex + 1} / {TOTAL}
        </span>
        <span
          className={`text-sm font-semibold rounded-full px-3 py-1 backdrop-blur-sm ${
            timeLeft <= 5
              ? 'bg-red-100 text-red-600'
              : 'bg-white/70 text-gray-500'
          }`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Country prompt */}
      <div className="pointer-events-none absolute top-14 inset-x-0 flex justify-center">
        <div className="bg-white/90 rounded-2xl px-8 py-4 shadow backdrop-blur-sm text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Find</p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">{targets[currentIndex]}</p>
        </div>
      </div>

      {/* Feedback overlay */}
      {feedback && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={`rounded-2xl px-10 py-6 shadow-xl text-center border ${
              feedback.correct
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`text-3xl font-bold ${
                feedback.correct ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {feedback.correct ? 'Correct!' : 'Missed!'}
            </p>
            {!feedback.correct && (
              <p className="text-sm text-gray-500 mt-2">
                {feedback.clicked
                  ? `You clicked ${feedback.clicked}`
                  : `Time's up — it was ${feedback.target}`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
