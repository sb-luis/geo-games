'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Props {
  onClose: () => void
}

type Tab = 'login' | 'register'

export function AuthModal({ onClose }: Props) {
  const { login, register } = useAuth()
  const [tab, setTab]           = useState<Tab>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [busy, setBusy]         = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (tab === 'login') {
        await login(username, password)
      } else {
        await register(username, password)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const switchTab = (t: Tab) => { setTab(t); setError(null) }

  return (
    // Backdrop — click anywhere outside the card to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs space-y-5"
        onClick={e => e.stopPropagation()}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors text-xl leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>

        {/* Tab switcher */}
        <div className="flex gap-5 justify-center">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={`text-sm font-semibold pb-0.5 border-b-2 transition-colors cursor-pointer ${
                tab === t
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-300 hover:text-gray-500'
              }`}
            >
              {t === 'login' ? 'Log in' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
            autoComplete="username"
            maxLength={20}
            className="text-center"
          />
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            className="text-center"
          />

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={busy || !username.trim() || !password}
            className="w-full"
          >
            {busy ? '…' : tab === 'login' ? 'Log in' : 'Create account'}
          </Button>
        </form>

      </div>
    </div>
  )
}
