'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Props {
  onSubmit: (alias: string) => void
}

export function AliasModal({ onSubmit }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xs text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">Pick a name</h2>
          <p className="text-sm text-gray-400">Everyone will see you as this</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            maxLength={20}
            placeholder="Your alias…"
            autoFocus
            className="text-center"
          />
          <Button type="submit" disabled={!value.trim()} className="w-full">
            Join
          </Button>
        </form>
      </div>
    </div>
  )
}
