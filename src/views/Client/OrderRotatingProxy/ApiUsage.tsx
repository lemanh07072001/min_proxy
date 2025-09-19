import React, { useState } from 'react'

import { Copy, Check, ChevronDown, ChevronUp, Code, Settings, BookOpen, Globe, Key, Clock } from 'lucide-react'

import { apiEndpoints, type ApiEndpoint } from '@/configs/apiDocsConfig'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

function CodeBlock({ code, language = 'json', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='bg-gray-900 rounded-lg overflow-hidden'>
      {title && (
        <div className='bg-gray-800 px-4 py-2 border-b border-gray-700'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-300 text-sm font-medium'>{title}</span>
            <button
              onClick={copyToClipboard}
              className='flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors text-xs'
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}
      <div className='relative'>
        <pre className='p-4 overflow-x-auto text-sm'>
          <code className='text-gray-300 font-mono'>{code}</code>
        </pre>
        {!title && (
          <button
            onClick={copyToClipboard}
            className='absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors'
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

interface StatusButtonProps {
  status: string
  isActive: boolean
  onClick: () => void
}

function StatusButton({ status, isActive, onClick }: StatusButtonProps) {
  const getStatusColor = (status: string) => {
    if (status.startsWith('2')) return 'bg-green-100 text-green-800 border-green-200'
    if (status.startsWith('4')) return 'bg-red-100 text-red-800 border-red-200'
    if (status.startsWith('5')) return 'bg-orange-100 text-orange-800 border-orange-200'

    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md border text-sm font-medium transition-all ${
        isActive
          ? getStatusColor(status) + ' ring-2 ring-opacity-50 ring-blue-500'
          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
      }`}
    >
      {status}
    </button>
  )
}

export default function ApiUsage() {
  const [selectedApi, setSelectedApi] = useState('get-current-proxy')
  const [selectedStatus, setSelectedStatus] = useState('200 OK')
  const [isBodyExpanded, setIsBodyExpanded] = useState(true)
  const [isResponseExpanded, setIsResponseExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredApis = apiEndpoints.filter(api => {
    const matchesSearch =
      api.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const currentApi = apiEndpoints.find(api => api.id === selectedApi) || apiEndpoints[0]

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500'
      case 'POST':
        return 'bg-green-500'
      case 'PUT':
        return 'bg-yellow-500'
      case 'DELETE':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className='flex h-screen bg-gray-50'>
      {/* API Sidebar */}
      <div className='w-80 bg-white border-r border-gray-200 flex flex-col'>
        {/* API List */}
        <div className='flex-1 overflow-y-auto'>
          {filteredApis.map(api => (
            <div
              key={api.id}
              onClick={() => setSelectedApi(api.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                selectedApi === api.id ? 'bg-white-100 border-l-4 border-l-orange-500' : 'hover:bg-white-100'
              }`}
            >
              <div className='flex items-center justify-between mb-2'>
                <h3 className='font-medium m-0 text-gray-900 text-sm'>{api.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getMethodColor(api.method)}`}>
                  {api.method}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='max-w-4xl mx-auto space-y-6'>
            {/* API Endpoint */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    <Code size={16} className='inline mr-1' />
                    URL Endpoint
                  </label>
                  <div className='flex items-center space-x-2'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold text-white ${getMethodColor(currentApi.method)}`}
                    >
                      {currentApi.method}
                    </span>
                    <div className='flex-1 bg-gray-900 rounded-lg p-3'>
                      <code className='text-blue-400 font-mono text-sm'>{currentApi.endpoint}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Body */}
            {currentApi.requestBody && (
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <div
                  className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                  onClick={() => setIsBodyExpanded(!isBodyExpanded)}
                >
                  <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                    <Settings size={20} className='mr-2' />
                    Request Body
                  </h3>
                  {isBodyExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {isBodyExpanded && (
                  <div className='px-4 pb-4'>
                    <CodeBlock code={currentApi.requestBody} title='JSON Body' />
                  </div>
                )}
              </div>
            )}

            {/* Response */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
              <div
                className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                onClick={() => setIsResponseExpanded(!isResponseExpanded)}
              >
                <h3 className='text-lg font-semibold text-gray-900'>Responses</h3>
                {isResponseExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {isResponseExpanded && (
                <div className='px-4 pb-4 space-y-4'>
                  {/* Status Code Buttons */}
                  <div className='flex flex-wrap gap-2'>
                    {currentApi.statusCodes.map(status => (
                      <StatusButton
                        key={status}
                        status={status}
                        isActive={selectedStatus === status}
                        onClick={() => setSelectedStatus(status)}
                      />
                    ))}
                  </div>

                   {/* Response Body */}
                   <CodeBlock code={currentApi.responses[selectedStatus] || 'No response data'} title={`JSON Response (${selectedStatus})`} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
