'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SimpleTest() {
  const { data: session, status } = useSession()
  const [mountCount, setMountCount] = useState(0)
  const [renderCount, setRenderCount] = useState(0)

  // Track component mount/unmount
  useEffect(() => {
    setMountCount(prev => prev + 1)
    console.log('🔄 SimpleTest MOUNTED:', {
      count: mountCount + 1,
      timestamp: new Date().toISOString(),
      session: session ? 'Available' : 'Not available',
      status
    })

    return () => {
      console.log('🔄 SimpleTest UNMOUNTED:', {
        count: mountCount,
        timestamp: new Date().toISOString()
      })
    }
  }, []) // Empty dependency array

  // Track every render
  useEffect(() => {
    setRenderCount(prev => prev + 1)
    console.log('🔄 SimpleTest RENDERED:', {
      renderCount: renderCount + 1,
      mountCount,
      timestamp: new Date().toISOString(),
      session: session ? 'Available' : 'Not available',
      status
    })
  }) // No dependency array - runs on every render

  // Test session changes
  useEffect(() => {
    console.log('📊 SimpleTest SESSION CHANGED:', {
      hasSession: !!session,
      hasToken: !!session?.access_token,
      status,
      timestamp: new Date().toISOString()
    })
  }, [session, status])

  return (
    <div className="p-4 border rounded-lg bg-blue-50 max-w-2xl">
      <h3 className="text-lg font-bold text-blue-800 mb-4">
        🧪 Simple Test Component
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Mount Count</div>
            <div className="text-2xl font-bold text-blue-600">{mountCount}</div>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Render Count</div>
            <div className="text-2xl font-bold text-green-600">{renderCount}</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600 mb-2">Session Status</div>
          <div className="space-y-1">
            <div>Status: <span className="font-mono">{status}</span></div>
            <div>Has Session: <span className={session ? 'text-green-600' : 'text-red-600'}>{session ? 'Yes' : 'No'}</span></div>
            <div>Has Token: <span className={session?.access_token ? 'text-green-600' : 'text-red-600'}>{session?.access_token ? 'Yes' : 'No'}</span></div>
            {session?.access_token && (
              <div>Token Length: <span className="font-mono">{session.access_token.length}</span></div>
            )}
          </div>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600 mb-2">Debug Info</div>
          <div className="text-xs font-mono space-y-1">
            <div>Component ID: {Math.random().toString(36).substr(2, 9)}</div>
            <div>Last Mount: {new Date().toLocaleTimeString()}</div>
            <div>Last Render: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        {mountCount > 3 && (
          <div className="bg-red-100 border border-red-300 rounded p-3">
            <div className="text-red-800 font-bold">⚠️ Warning: High Mount Count</div>
            <div className="text-red-700 text-sm">
              Component has been mounted {mountCount} times. This indicates a serious issue.
            </div>
          </div>
        )}

        {renderCount > 20 && (
          <div className="bg-orange-100 border border-orange-300 rounded p-3">
            <div className="text-orange-800 font-bold">⚠️ Warning: High Render Count</div>
            <div className="text-orange-700 text-sm">
              Component has been rendered {renderCount} times. This may indicate excessive re-renders.
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600">
          <div>• Check console for detailed logs</div>
          <div>• Monitor mount vs render counts</div>
          <div>• Look for session changes</div>
          <div>• Check for parent component issues</div>
        </div>
      </div>
    </div>
  )
}
