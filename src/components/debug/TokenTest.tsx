'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import useAxiosAuth from '@/hocs/useAxiosAuth'
import { refreshAccessToken } from '@/libs/tokenUtils'

export default function TokenTest() {
  const { data: session, update: updateSession } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string | null>(null)
  const axiosAuth = useAxiosAuth()

  const testTokenRefresh = async () => {
    if (!session?.access_token) {
      console.log('❌ No session or access token available')
      return
    }

    setIsRefreshing(true)
    console.log('🧪 Starting manual token refresh test...')
    
    try {
      const result = await refreshAccessToken(session as any)
      
      if (result.error) {
        console.error('❌ Manual refresh failed:', result.error)
        return
      }

      if (result.access_token) {
        console.log('✅ Manual refresh successful, updating session...')
        await updateSession({
          access_token: result.access_token,
          accessTokenExpires: result.accessTokenExpires
        })
        setLastRefresh(new Date().toISOString())
        console.log('✅ Session updated with new token')
      }
    } catch (error) {
      console.error('❌ Error during manual refresh:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const testApiCall = async () => {
    try {
      console.log('🧪 Testing API call...')
      const response = await axiosAuth.get('/api/me')
      console.log('✅ API call successful:', response.data)
    } catch (error) {
      console.error('❌ API call failed:', error)
    }
  }

  const checkTokenStatus = () => {
    if (!session?.access_token) {
      console.log('❌ No access token available')
      return
    }

    console.log('🔍 Current token status:', {
      hasToken: !!session.access_token,
      tokenLength: session.access_token.length,
      tokenPreview: `${session.access_token.substring(0, 20)}...${session.access_token.substring(session.access_token.length - 20)}`,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50 max-w-2xl">
      <h3 className="text-lg font-bold text-green-800 mb-4">
        🧪 Token Test Component
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
            {lastRefresh && (
              <div>Last Refresh: <span className="font-mono text-sm">{new Date(lastRefresh).toLocaleTimeString()}</span></div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkTokenStatus}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            disabled={!session?.access_token}
          >
            🔍 Check Token
          </button>
          
          <button
            onClick={testTokenRefresh}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            disabled={!session?.access_token || isRefreshing}
          >
            {isRefreshing ? '🔄 Refreshing...' : '🔄 Test Refresh'}
          </button>
          
          <button
            onClick={testApiCall}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            disabled={!session?.access_token}
          >
            🧪 Test API
          </button>
        </div>

        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600 mb-2">Debug Info</div>
          <div className="text-xs font-mono space-y-1">
            <div>Component ID: {Math.random().toString(36).substr(2, 9)}</div>
            <div>Current Time: {new Date().toLocaleTimeString()}</div>
            <div>Is Refreshing: {isRefreshing ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          <div>• Check console for detailed logs</div>
          <div>• Test token refresh manually</div>
          <div>• Monitor API calls</div>
          <div>• Look for token changes</div>
        </div>
      </div>
    </div>
  )
}
