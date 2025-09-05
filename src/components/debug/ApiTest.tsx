'use client'

import { useState } from 'react'

export default function ApiTest() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLoginEndpoint = async () => {
    setLoading(true)

    try {
      const apiUrl = 'https://api.minhan.online'

      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      const data = await response.json()

      setTestResult({
        endpoint: '/api/login',
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      setTestResult({
        endpoint: '/api/login',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testRefreshEndpoint = async () => {
    setLoading(true)

    try {
      const apiUrl = 'https://api.minhan.online'

      const response = await fetch(`${apiUrl}/api/refresh`, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer test-token',
          Accept: 'application/json'
        }
      })

      const data = await response.json()

      setTestResult({
        endpoint: '/api/refresh',
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error) {
      setTestResult({
        endpoint: '/api/refresh',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-4 border rounded-lg bg-gray-50'>
      <h3 className='text-lg font-semibold mb-4'>API Endpoint Test</h3>

      <div className='space-y-2 mb-4'>
        <button
          onClick={testLoginEndpoint}
          disabled={loading}
          className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
        >
          Test /api/login
        </button>

        <button
          onClick={testRefreshEndpoint}
          disabled={loading}
          className='px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 ml-2'
        >
          Test /api/refresh
        </button>
      </div>

      {loading && <p>Testing...</p>}

      {testResult && (
        <div className='mt-4 p-3 bg-white border rounded'>
          <h4 className='font-medium mb-2'>Test Result: {testResult.endpoint}</h4>
          <pre className='text-sm overflow-auto'>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
