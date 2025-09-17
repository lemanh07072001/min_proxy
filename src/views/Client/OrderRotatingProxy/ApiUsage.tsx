import React, { useState } from 'react'

import { ChevronDown, ChevronUp, Copy, Menu } from 'lucide-react'
import IconButton from '@mui/material/IconButton'

export default function ApiUsage() {
  const [expandedSection, setExpandedSection] = useState<string>('rotate-proxy')
  const [showResponses, setShowResponses] = useState(true)
  const [showBody, setShowBody] = useState(true)

  const apiUrl = 'https://api.netproxy.io/api/rotateProxy/getNewProxy'

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200 flex-shrink-0'>
        <div className='p-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-6'>API Documentation</h2>

          {/* Rotate Proxy Section */}
          <div className='mb-4'>
            <button
              onClick={() => setExpandedSection(expandedSection === 'rotate-proxy' ? '' : 'rotate-proxy')}
              className='flex items-center justify-between w-full text-left p-3 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors'
            >
              <span className='font-medium'>Rotate Proxy</span>
              {expandedSection === 'rotate-proxy' ? (
                <ChevronUp className='w-4 h-4' />
              ) : (
                <ChevronDown className='w-4 h-4' />
              )}
            </button>

            {expandedSection === 'rotate-proxy' && (
              <div className='mt-2 space-y-1'>
                <button className='flex items-center space-x-3 w-full text-left p-3 bg-gray-100 text-gray-900 rounded-lg'>
                  <span className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium'>POST</span>
                  <span className='text-sm'>Get New Proxy</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>
          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center space-x-3 mb-4'>
              <span className='bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium'>POST</span>
              <h1 className='text-2xl font-bold text-gray-900'>Get New Proxy</h1>
            </div>
          </div>

          {/* URL Display */}
          <div className='bg-gray-900 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400 text-sm'>URL:</span>
              <IconButton aria-label='capture screenshot'>
                <Copy className='w-4 h-4' style={{ color: 'white' }} />
              </IconButton>
            </div>
            <code className='text-blue-400 text-sm break-all'>{apiUrl}</code>
          </div>

          {/* Body Section */}
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-6'>
            <div className='flex items-center justify-between p-3 border-b border-gray-200'>
              <button
                onClick={() => setShowBody(!showBody)}
                className='flex items-center space-x-2 text-gray-700 bg-white hover:text-gray-900'
              >
                <span className='font-medium'>Body</span>
                {showBody ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
              </button>
            </div>

            {showBody && (
              <div className='bg-gray-900 p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-400 text-sm'>JSON Body</span>
                  </div>
                  <IconButton aria-label='capture screenshot'>
                    <Copy className='w-4 h-4' style={{ color: 'white' }} />
                  </IconButton>
                </div>

                <pre className='text-sm overflow-x-auto'>
                  <code className='text-gray-300'>
                    <span className='text-gray-500'>{'{'}</span>
                    {'\n    '}
                    <span className='text-orange-400'>"key"</span>
                    <span className='text-gray-500'>:</span>{' '}
                    <span className='text-yellow-400'>"GSaTZVGtrHPRiYUhBUSfPx"</span>
                    <span className='text-gray-500'>,</span>
                    {'\n'}
                    <span className='text-gray-500'>{'}'}</span>
                  </code>
                </pre>
              </div>
            )}
          </div>

          {/* Responses Section */}
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='flex items-center justify-between p-3 border-b border-gray-200'>
              <button
                onClick={() => setShowResponses(!showResponses)}
                className='flex items-center space-x-2 text-gray-700 bg-white hover:text-gray-900'
              >
                <span className='font-medium'>Responses</span>
                {showResponses ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
              </button>

              <div className='flex items-center space-x-2'>
                <span className='bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium'>200 OK</span>
              </div>
            </div>

            {showResponses && (
              <div className='bg-gray-900 p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-400 text-sm'>JSON Response</span>
                  </div>
                  <IconButton aria-label='capture screenshot'>
                    <Copy className='w-4 h-4' style={{ color: 'white' }} />
                  </IconButton>
                </div>
                <pre className='text-sm overflow-x-auto'>
                  <code className='text-gray-300'>
                    <span className='text-gray-500'>{'{'}</span>
                    {'\n  '}
                    <span className='text-orange-400'>"data"</span>
                    <span className='text-gray-500'>:</span> <span className='text-gray-500'>{'{'}</span>
                    {'\n    '}
                    <span className='text-orange-400'>"realIpAddress"</span>
                    <span className='text-gray-500'>:</span> <span className='text-yellow-400'>"42.119.124.219"</span>,
                    {' \n    '}
                    <span className='text-orange-400'>"http"</span>
                    <span className='text-gray-500'>:</span>{' '}
                    <span className='text-yellow-400'>"42.119.124.219:16847:khljtiNj3Kd:fdkm3nbjg45d"</span>,{' \n    '}
                    <span className='text-orange-400'>"socks5"</span>
                    <span className='text-gray-500'>:</span>{' '}
                    <span className='text-yellow-400'>"42.119.124.219:26847:khljtiNj3Kd:fdkm3nbjg45d"</span>,{' \n    '}
                    <span className='text-orange-400'>"httpPort"</span>
                    <span className='text-gray-500'>:</span> <span className='text-blue-400'>"16847"</span>,{' \n    '}
                    <span className='text-orange-400'>"socks5Port"</span>
                    <span className='text-gray-500'>:</span> <span className='text-blue-400'>"26847"</span>,{' \n    '}
                    <span className='text-orange-400'>"host"</span>
                    <span className='text-gray-500'>:</span> <span className='text-yellow-400'>"42.119.124.219"</span>,
                    {' \n    '}
                    <span className='text-orange-400'>"location"</span>
                    <span className='text-gray-500'>:</span> <span className='text-yellow-400'>"YenBai1"</span>,
                    {' \n    '}
                    <span className='text-orange-400'>"expirationAt"</span>
                    <span className='text-gray-500'>:</span> <span className='text-blue-400'>1758099900</span>
                    {'\n  '}
                    <span className='text-gray-500'>{'}'}</span>,{' \n  '}
                    <span className='text-orange-400'>"success"</span>
                    <span className='text-gray-500'>:</span> <span className='text-green-400'>true</span>,{' \n  '}
                    <span className='text-orange-400'>"code"</span>
                    <span className='text-gray-500'>:</span> <span className='text-blue-400'>200</span>,{' \n  '}
                    <span className='text-orange-400'>"status"</span>
                    <span className='text-gray-500'>:</span> <span className='text-yellow-400'>"SUCCESS"</span>
                    {'\n'}
                    <span className='text-gray-500'>{'}'}</span>
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
