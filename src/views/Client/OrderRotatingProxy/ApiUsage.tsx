'use client'
import React, { useState } from 'react'

import { ChevronDown, ChevronUp, Copy } from 'lucide-react'
import IconButton from '@mui/material/IconButton'

import { apiEndpoints } from '@/configs/apiDocsConfig'

export default function ApiUsage() {
  const [currentView, setCurrentView] = useState<'get' | 'post'>('get')
  const [showBody, setShowBody] = useState(true)
  const [showResponses, setShowResponses] = useState(true)
  const [selectedStatusCode, setSelectedStatusCode] = useState<number>(200)

  // Get first GET API as default
  const getApis = apiEndpoints.filter(api => api.method.toLowerCase() === 'get')
  const [expandedId, setExpandedId] = useState(getApis.length > 0 ? getApis[0].id : apiEndpoints[0].id)
  
  // Keep track of the current API name to maintain selection across method changes
  const [currentApiName, setCurrentApiName] = useState(getApis.length > 0 ? getApis[0].name : apiEndpoints[0].name)

  const handleCopy = (text: string) => navigator.clipboard.writeText(text)

  // Filter APIs based on current view
  const filteredApis = apiEndpoints.filter(api => api.method.toLowerCase() === currentView)

  // Keep current API selected by name when switching methods
  React.useEffect(() => {
    if (filteredApis.length > 0) {
      // Find API with the same name in the new method
      const sameNameApi = filteredApis.find(api => api.name === currentApiName)
      if (sameNameApi) {
        // Keep the same API name, just update the ID
        setExpandedId(sameNameApi.id)
      } else {
        // If no API with same name exists, select first and update name
        setExpandedId(filteredApis[0].id)
        setCurrentApiName(filteredApis[0].name)
      }
    }
  }, [currentView, filteredApis, currentApiName])

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200'>
        <div className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-6'>API Documentation</h2>

          {filteredApis.map(api => (
            <div key={api.id} className='mb-4'>
              <button
                onClick={() => {
                  setExpandedId(api.id)
                  setCurrentApiName(api.name)
                }}
                className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                  expandedId === api.id
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'text-orange-500 hover:bg-orange-50'
                }`}
              >
                <span className='font-medium'>{api.name}</span>
                {expandedId === api.id ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto p-8'>
        {filteredApis.map(
          api =>
            expandedId === api.id && (
              <div key={api.id}>
                {/* Header */}
                <div className='mb-6 flex items-center justify-between space-x-3'>
                  <div className='flex items-center justify-end gap-2'>
                    <span className='bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium'>
                      {api.method}
                    </span>
                    <h1 className='text-2xl font-bold text-gray-900'>{api.name}</h1>
                  </div>

                  <div>
                    <div className='bg-white'>
                      <div className='flex items-center justify-end'>
                        <div className='flex bg-gray-100 rounded-lg p-1'>
                          <button
                            onClick={() => setCurrentView('get')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              currentView === 'get'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            GET
                          </button>
                          <button
                            onClick={() => setCurrentView('post')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                              currentView === 'post'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            POST
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* URL */}
                <div className='bg-gray-900 rounded-lg p-4 mb-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-gray-400 text-sm'>URL:</span>
                    <IconButton onClick={() => handleCopy(api.url)}>
                      <Copy className='w-4 h-4 text-white' />
                    </IconButton>
                  </div>
                  <code className='text-blue-400 text-sm break-all'>{api.url}</code>
                </div>

                {/* Body - Only show for POST requests */}
                {api.method.toLowerCase() === 'post' && (
                  <div className='bg-white rounded-lg border border-gray-200 mb-6'>
                    <div className='flex items-center justify-between p-3 border-b'>
                      <button
                        onClick={() => setShowBody(!showBody)}
                        className='flex items-center space-x-2 bg-white  text-gray-700'
                      >
                        <span className='font-medium '>Body</span>
                        {showBody ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
                      </button>
                    </div>
                    {showBody && (
                      <div className='bg-gray-900 p-4'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-gray-400 text-sm'>JSON Body</span>
                          <IconButton onClick={() => handleCopy(JSON.stringify(api.body, null, 2))}>
                            <Copy className='w-4 h-4 text-white' />
                          </IconButton>
                        </div>
                        <pre className='text-sm overflow-x-auto text-gray-300'>{JSON.stringify(api.body, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Response */}
                <div className='bg-white rounded-lg border border-gray-200'>
                  <div className='flex items-center justify-between p-3 border-b'>
                    <button
                      onClick={() => setShowResponses(!showResponses)}
                      className='flex items-center  bg-white  space-x-2 text-gray-700'
                    >
                      <span className='font-medium'>Responses</span>
                      {showResponses ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
                    </button>
                    <div className='flex gap-2'>
                      {Object.keys(api.responses).map(statusCode => (
                        <button
                          key={statusCode}
                          onClick={() => setSelectedStatusCode(Number(statusCode))}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            selectedStatusCode === Number(statusCode)
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {statusCode} {Number(statusCode) >= 400 ? 'ERROR' : 'OK'}
                        </button>
                      ))}
                    </div>
                  </div>
                  {showResponses && (
                    <div className='bg-gray-900 p-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-gray-400 text-sm'>
                          JSON Response
                        </span>
                        <IconButton onClick={() => handleCopy(JSON.stringify(api.responses[selectedStatusCode as keyof typeof api.responses], null, 2))}>
                          <Copy className='w-4 h-4 text-white' />
                        </IconButton>
                      </div>
                      <pre className='text-sm overflow-x-auto text-gray-300'>
                        {JSON.stringify(api.responses[selectedStatusCode as keyof typeof api.responses], null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}
