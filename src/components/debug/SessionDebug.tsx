'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function SessionDebug() {
  const { data: session, status, update } = useSession()
  const [testResult, setTestResult] = useState<any>(null)

  const testApiMe = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.minhan.online'
      const accessToken = (session as any)?.accessToken;
      
      console.log('Testing Laravel API with token:', {
        url: `${apiUrl}/api/me`,
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
        tokenStart: accessToken?.substring(0, 20) + '...'
      });

      const response = await fetch(`${apiUrl}/api/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Laravel API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${apiUrl}/api/me`,
        requestHeaders: {
          'Authorization': `Bearer ${accessToken ? 'Token available' : 'No token'}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        responseHeaders: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      console.error('Laravel API Test Error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      })
    }
  }

  const testRefreshEndpoint = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.minhan.online'
      const accessToken = (session as any)?.accessToken;
      
      console.log('Testing Laravel /refresh endpoint with token:', {
        url: `${apiUrl}/refresh`,
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
        tokenStart: accessToken?.substring(0, 20) + '...'
      });

      // Test với access token (không phải refresh token)
      const response = await fetch(`${apiUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Laravel /refresh Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

      setTestResult({
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: `${apiUrl}/refresh`,
        requestHeaders: {
          'Authorization': `Bearer ${accessToken ? 'Token available' : 'No token'}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        responseHeaders: Object.fromEntries(response.headers.entries()),
        note: 'Testing if Laravel has /refresh endpoint'
      })
    } catch (error) {
      console.error('Laravel /refresh Test Error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        note: 'Error testing /refresh endpoint'
      })
    }
  }

  const refreshSession = async () => {
    try {
      await update()
      setTestResult({ message: 'Session refreshed successfully' })
    } catch (error) {
      setTestResult({ error: 'Failed to refresh session', details: error })
    }
  }

  const testWithDifferentMethods = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.minhan.online'
      const accessToken = (session as any)?.accessToken;
      
      // Test với GET method
      const getResponse = await fetch(`${apiUrl}/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      })
      
      const getData = await getResponse.json()
      
      // Test với POST method
      const postResponse = await fetch(`${apiUrl}/api/me`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      
      const postData = await postResponse.json()
      
      setTestResult({
        GET: {
          status: getResponse.status,
          data: getData
        },
        POST: {
          status: postResponse.status,
          data: postData
        },
        url: `${apiUrl}/api/me`
      })
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Laravel Session Debug - Testing Refresh Endpoint</h3>
      
      <div className="space-y-2 mb-4">
        <p><strong>Status:</strong> {status}</p>
        <p><strong>User:</strong> {session?.user?.email || 'None'}</p>
        <p><strong>Access Token:</strong> {(session as any)?.accessToken ? 'Available' : 'Not available'}</p>
        <p><strong>Token Length:</strong> {(session as any)?.accessToken?.length || 0}</p>
        <p><strong>Token Preview:</strong> {(session as any)?.accessToken ? `${(session as any).accessToken.substring(0, 30)}...` : 'None'}</p>
        <p><strong>Sodu (Balance):</strong> {(session as any)?.user?.sodu || 'None'}</p>
        <p><strong>Error:</strong> {(session as any)?.error || 'None'}</p>
        <p><strong>Expires:</strong> {session?.expires || 'None'}</p>
      </div>

      <div className="space-x-2 mb-4">
        <button 
          onClick={testApiMe}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Laravel API /me (POST)
        </button>
        
        <button 
          onClick={testWithDifferentMethods}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test GET vs POST
        </button>
        
        <button 
          onClick={testRefreshEndpoint}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Test /refresh Endpoint
        </button>
        
        <button 
          onClick={refreshSession}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Refresh Session
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-white border rounded">
          <h4 className="font-semibold mb-2">Test Result:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">Laravel Backend Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Backend: Laravel với JWT authentication</li>
          <li>• Response format: access_token, token_type: bearer</li>
          <li>• User data: name, email, sodu (balance)</li>
          <li>• Endpoint: /api/me (có thể cần thay đổi)</li>
          <li>• <strong>Testing /refresh endpoint để xem Laravel có hỗ trợ refresh token không</strong></li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">Testing Refresh Token:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Click "Test /refresh Endpoint" để kiểm tra Laravel có endpoint /refresh không</li>
          <li>• Nếu có /refresh endpoint → Laravel hỗ trợ refresh token</li>
          <li>• Nếu không có /refresh endpoint → Laravel không hỗ trợ refresh token</li>
          <li>• Kết quả sẽ quyết định logic xử lý token trong frontend</li>
        </ul>
      </div>
    </div>
  )
}
