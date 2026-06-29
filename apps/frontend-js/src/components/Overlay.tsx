'use client'

import { Button } from '@/components/ui/Button'
import { useSocket } from '@/lib/multiplayer/SocketContext'

export function Overlay() {
  const { sessionInactive, continueHere } = useSocket()

  return (
    <>
      {sessionInactive && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-md">
            <span className="text-sm text-gray-400">Connected in another tab</span>
            <Button size="sm" onClick={continueHere}>Continue here instead</Button>
          </div>
        </div>
      )}
    </>
  )
}
