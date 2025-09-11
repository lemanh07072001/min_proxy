'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useTokenReset, checkTokenStatus, useTokenRefresh } from '@/libs/tokenUtils'

export default function TokenResetTest() {
  const { data: session, status, update } = useSession()
  const [testResult, setTestResult] = useState<any>(null)
  const [tokenStatus, setTokenStatus] = useState<any>(null)
  const { resetToken } = useTokenReset()
  const { refreshToken } = useTokenRefresh()

  const checkStatus = async () => {
    try {
      const status = await checkTokenStatus()
      setTokenStatus(status)
      console.log('Token status:', status)
    } catch (error) {
      console.error('Error checking token status:', error)
      setTokenStatus({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const testManualReset = async () => {
    try {
      setTestResult({ loading: true, message: 'Resetting token...' })
      await resetToken()
      setTestResult({ success: true, message: 'Token reset successfully' })
    } catch (error) {
      console.error('Reset token error:', error)
      setTestResult({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  const testNextAuthSignOut = async () => {
    try {
      setTestResult({ loading: true, message: 'Signing out with NextAuth...' })
      await signOut({ redirect: true })
    } catch (error) {
      console.error('SignOut error:', error)
      setTestResult({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  const testTokenRefresh = async () => {
    try {
      setTestResult({ loading: true, message: 'Refreshing token...' })
      await refreshToken()
      setTestResult({ success: true, message: 'Token refresh triggered' })
    } catch (error) {
      console.error('Token refresh error:', error)
      setTestResult({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  const testSessionUpdate = async () => {
    try {
      setTestResult({ loading: true, message: 'Updating session...' })
      await update()
      setTestResult({ success: true, message: 'Session updated' })
    } catch (error) {
      console.error('Session update error:', error)
      setTestResult({ 
        error: true, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Token Reset Test - Laravel JWT</h2>
      
      {/* Session Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Session Info</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
          <p><strong>Has Token:</strong> {(session as any)?.access_token ? 'Yes' : 'No'}</p>
          <p><strong>Token Error:</strong> {(session as any)?.error || 'None'}</p>
          <p><strong>User:</strong> {session?.user?.email || 'None'}</p>
        </div>
      </div>

      {/* Token Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h3 className="text-lg font-semibold mb-2">Token Status</h3>
        <button 
          onClick={checkStatus}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Token Status
        </button>
        {tokenStatus && (
          <div className="text-sm space-y-1">
            <p><strong>Valid:</strong> {tokenStatus.isValid ? 'Yes' : 'No'}</p>
            <p><strong>Expires At:</strong> {tokenStatus.expiresAt ? new Date(tokenStatus.expiresAt).toLocaleString() : 'Unknown'}</p>
            <p><strong>Time Left:</strong> {tokenStatus.timeLeft ? `${Math.round(tokenStatus.timeLeft / 1000)}s` : 'Unknown'}</p>
            {tokenStatus.error && <p className="text-red-600"><strong>Error:</strong> {tokenStatus.error}</p>}
          </div>
        )}
      </div>

      {/* Test Buttons */}
      <div className="mb-6 space-y-3">
        <h3 className="text-lg font-semibold">Test Actions</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={testTokenRefresh}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Token Refresh
          </button>
          
          <button 
            onClick={testSessionUpdate}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Test Session Update
          </button>
          
          <button 
            onClick={testManualReset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Test Manual Reset
          </button>
          
          <button 
            onClick={testNextAuthSignOut}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test NextAuth SignOut
          </button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded ${
          testResult.loading ? 'bg-yellow-50 border border-yellow-200' :
          testResult.success ? 'bg-green-50 border border-green-200' :
          testResult.error ? 'bg-red-50 border border-red-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <h4 className="font-semibold mb-2">Test Result</h4>
          <p className={`
            ${testResult.loading ? 'text-yellow-700' :
              testResult.success ? 'text-green-700' :
              testResult.error ? 'text-red-700' :
              'text-gray-700'}
          `}>
            {testResult.message}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Check Token Status:</strong> Kiểm tra trạng thái token hiện tại</li>
          <li><strong>Test Token Refresh:</strong> Thử refresh token thông qua NextAuth</li>
          <li><strong>Test Session Update:</strong> Cập nhật session thủ công</li>
          <li><strong>Test Manual Reset:</strong> Reset token và gọi Laravel logout API</li>
          <li><strong>Test NextAuth SignOut:</strong> Sử dụng NextAuth signOut</li>
        </ul>
      </div>
    </div>
  )
}

