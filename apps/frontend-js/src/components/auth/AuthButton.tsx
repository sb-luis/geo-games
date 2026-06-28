'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { Button } from '@/components/ui/Button'
import { AuthModal } from './AuthModal'

export function AuthButton() {
  const { user, loading, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)

  if (loading) return null

  return (
    <>
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm select-none">
              {user.username}
            </span>
            <Button size="sm" variant="secondary" onClick={logout} className="bg-white/80 backdrop-blur-sm shadow-sm">
              Log out
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => setShowModal(true)}>
            Log in
          </Button>
        )}
      </div>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}
