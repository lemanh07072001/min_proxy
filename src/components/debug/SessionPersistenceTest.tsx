'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { refreshAccessToken } from '@/libs/tokenUtils'

export default function SessionPersistenceTest() {
  const { data: session, update: updateSession, status } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshResult, setRefreshResult] = useState<any>(null)
  const [sessionHistory, setSessionHistory] = useState<any[]>([])

  // Track session changes
  useEffect(() => {
    if (session) {
      setSessionHistory(prev => [...prev, {
        timestamp: new Date().toISOString(),
        hasToken: !!session.access_token,
        tokenLength: session.access_token?.length || 0,
        tokenPreview: session.access_token ? 
          `${session.access_token.substring(0, 20)}...${session.access_token.substring(session.access_token.length - 20)}` : 
          'No token',
        status
      }])
    }
  }, [session, status])

  const testRefresh = async () => {
    if (!session?.access_token) {
      console.log('❌ No session or access token available')
      return
    }

    setIsRefreshing(true)
    console.log('🧪 Starting token refresh test...')
    
    try {
      // Test 1: Log current token
      console.log('📊 Current token before refresh:', {
        hasToken: !!session.access_token,
        tokenLength: session.access_token.length,
        tokenPreview: `${session.access_token.substring(0, 20)}...${session.access_token.substring(session.access_token.length - 20)}`
      })

      // Test 2: Call refreshAccessToken
      const result = await refreshAccessToken(session as any)
      setRefreshResult(result)
      
      if (result.error) {
        console.error('❌ Refresh failed:', result.error)
        return
      }

      if (result.access_token) {
        console.log('✅ Refresh successful, new token:', {
          hasNewToken: !!result.access_token,
          newTokenLength: result.access_token.length,
          newTokenPreview: `${result.access_token.substring(0, 20)}...${result.access_token.substring(result.access_token.length - 20)}`
        })

        // Test 3: Check if token is different
        const isDifferent = result.access_token !== session.access_token
        console.log('🔍 Token comparison:', {
          isDifferent,
          oldTokenLength: session.access_token.length,
          newTokenLength: result.access_token.length
        })

        if (isDifferent) {
          console.log('✅ Token is different, updating session...')
          // Update NextAuth session
          await updateSession({
            access_token: result.access_token,
            accessTokenExpires: result.accessTokenExpires
          })
          console.log('✅ Session updated successfully')
        } else {
          console.log('⚠️ Token is the same, no update needed')
        }
      }
    } catch (error) {
      console.error('❌ Error during refresh test:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const checkSession = () => {
    console.log('🔍 Current session status:', {
      hasSession: !!session,
      hasToken: !!session?.access_token,
      tokenLength: session?.access_token?.length || 0,
      status,
      timestamp: new Date().toISOString()
    })
  }

  const clearHistory = () => {
    setSessionHistory([])
  }

  const simulatePageReload = () => {
    console.log('🔄 Simulating page reload...')
    window.location.reload()
  }

  return (
    <div className="p-4 border rounded-lg bg-orange-50 max-w-4xl">
      <h3 className="text-lg font-bold text-orange-800 mb-4">
        🧪 Session Persistence Test
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">Current Session</div>
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
            <div className="text-sm text-gray-600 mb-2">Session History</div>
            <div className="space-y-1">
              <div>Total Changes: <span className="font-mono">{sessionHistory.length}</span></div>
              <div>Last Change: <span className="font-mono text-xs">
                {sessionHistory.length > 0 ? new Date(sessionHistory[sessionHistory.length - 1].timestamp).toLocaleTimeString() : 'N/A'}
              </span></div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkSession}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            🔍 Check Session
          </button>
          
          <button
            onClick={testRefresh}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            disabled={!session?.access_token || isRefreshing}
          >
            {isRefreshing ? '🔄 Refreshing...' : '🔄 Test Refresh'}
          </button>

          <button
            onClick={clearHistory}
            className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            🧹 Clear History
          </button>

          <button
            onClick={simulatePageReload}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            🔄 Reload Page
          </button>
        </div>

        {refreshResult && (
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">Last Refresh Result</div>
            <div className="space-y-1 text-xs">
              <div>Has Error: <span className={refreshResult.error ? 'text-red-600' : 'text-green-600'}>{refreshResult.error ? 'Yes' : 'No'}</span></div>
              {refreshResult.error && (
                <div>Error: <span className="font-mono text-red-600">{refreshResult.error}</span></div>
              )}
              <div>Has New Token: <span className={refreshResult.access_token ? 'text-green-600' : 'text-red-600'}>{refreshResult.access_token ? 'Yes' : 'No'}</span></div>
              {refreshResult.access_token && (
                <div>New Token Length: <span className="font-mono">{refreshResult.access_token.length}</span></div>
              )}
            </div>
          </div>
        )}

        {sessionHistory.length > 0 && (
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">Session Change History</div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {sessionHistory.map((entry, index) => (
                <div key={index} className="text-xs border-l-2 border-blue-200 pl-2">
                  <div className="font-mono text-gray-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="space-y-1">
                    <div>Status: <span className="font-mono">{entry.status}</span></div>
                    <div>Has Token: <span className={entry.hasToken ? 'text-green-600' : 'text-red-600'}>{entry.hasToken ? 'Yes' : 'No'}</span></div>
                    <div>Token Length: <span className="font-mono">{entry.tokenLength}</span></div>
                    <div className="font-mono text-xs text-gray-500 break-all">
                      {entry.tokenPreview}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600">
          <div>• Check console for NextAuth logs</div>
          <div>• Monitor session changes over time</div>
          <div>• Test token refresh and persistence</div>
          <div>• Reload page to test session persistence</div>
        </div>
      </div>
    </div>
  )
}
