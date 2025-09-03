'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { refreshAccessToken } from '@/libs/tokenUtils'

export default function SimpleTokenTest() {
  const { data: session, update: updateSession } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshResult, setRefreshResult] = useState<any>(null)

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
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="p-4 border rounded-lg bg-purple-50 max-w-2xl">
      <h3 className="text-lg font-bold text-purple-800 mb-4">
        🧪 Simple Token Test
      </h3>
      
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600 mb-2">Session Status</div>
          <div className="space-y-1">
            <div>Has Session: <span className={session ? 'text-green-600' : 'text-red-600'}>{session ? 'Yes' : 'No'}</span></div>
            <div>Has Token: <span className={session?.access_token ? 'text-green-600' : 'text-red-600'}>{session?.access_token ? 'Yes' : 'No'}</span></div>
            {session?.access_token && (
              <div>Token Length: <span className="font-mono">{session.access_token.length}</span></div>
            )}
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
        </div>

        {refreshResult && (
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">Refresh Result</div>
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

        <div className="text-xs text-gray-600">
          <div>• Check console for detailed logs</div>
          <div>• Test token refresh step by step</div>
          <div>• Monitor token changes</div>
          <div>• Verify session updates</div>
        </div>
      </div>
    </div>
  )
}
