'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useAxiosAuth from '@/hocs/useAxiosAuth'

export default function InfiniteReloadDebug() {
  const { data: session, status } = useSession()
  const [reloadCount, setReloadCount] = useState(0)
  const [lastReload, setLastReload] = useState<Date | null>(null)
  const axiosAuth = useAxiosAuth()

  useEffect(() => {
    // Tăng counter mỗi khi component mount (có thể do reload)
    setReloadCount(prev => prev + 1)
    setLastReload(new Date())
    
    console.log('🔄 Component mounted/reloaded:', {
      count: reloadCount + 1,
      timestamp: new Date().toISOString(),
      session: session ? 'Available' : 'Not available',
      status
    })
  }, [])

  const testApiCall = async () => {
    try {
      console.log('🧪 Testing API call...')
      const response = await axiosAuth.get('/api/me')
      console.log('✅ API call successful:', response.data)
    } catch (error) {
      console.error('❌ API call failed:', error)
    }
  }

  const checkSession = () => {
    console.log('🔍 Current session:', {
      hasSession: !!session,
      hasAccessToken: !!session?.access_token,
      accessTokenLength: session?.access_token?.length || 0,
      status,
      timestamp: new Date().toISOString()
    })
  }

  const checkLocalStorage = () => {
    const keys = Object.keys(localStorage)
    const authKeys = keys.filter(key => key.includes('auth') || key.includes('session'))
    console.log('📦 LocalStorage auth keys:', authKeys)
    
    authKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key)
        console.log(`  ${key}:`, value ? 'Has value' : 'Empty')
      } catch (error) {
        console.log(`  ${key}: Error reading`)
      }
    })
  }

  const clearSession = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      console.log('🧹 Cleared all storage')
      window.location.reload()
    } catch (error) {
      console.error('❌ Error clearing storage:', error)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 max-w-2xl">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">
        🔄 Infinite Reload Debug
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Reload Count</div>
            <div className="text-2xl font-bold text-red-600">{reloadCount}</div>
          </div>
          
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Last Reload</div>
            <div className="text-sm font-mono">
              {lastReload ? lastReload.toLocaleTimeString() : 'N/A'}
            </div>
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

        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkSession}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            🔍 Check Session
          </button>
          
          <button
            onClick={checkLocalStorage}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            📦 Check Storage
          </button>
          
          <button
            onClick={testApiCall}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          >
            🧪 Test API
          </button>
          
          <button
            onClick={clearSession}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            🧹 Clear Storage
          </button>
        </div>

        {reloadCount > 5 && (
          <div className="bg-red-100 border border-red-300 rounded p-3">
            <div className="text-red-800 font-bold">⚠️ Warning: High Reload Count</div>
            <div className="text-red-700 text-sm">
              Component has been mounted {reloadCount} times. This may indicate an infinite reload loop.
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600">
          <div>• Check console for detailed logs</div>
          <div>• Monitor Network tab for repeated requests</div>
          <div>• Look for useEffect dependencies issues</div>
          <div>• Check for window.location.reload() calls</div>
        </div>
      </div>
    </div>
  )
}
