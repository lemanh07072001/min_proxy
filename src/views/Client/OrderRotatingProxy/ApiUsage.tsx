import React, { useState, useMemo } from 'react'

import { Copy, Check, ChevronDown, ChevronUp, Code, Settings, Key, Shield, Lock } from 'lucide-react'

import { apiEndpoints, categoryLabels, authLabels, type ApiEndpoint } from '@/configs/apiDocsConfig'

interface CodeBlockProps {
  code: string
  title?: string
}

function CodeBlock({ code, title }: CodeBlockProps) {
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

function AuthBadge({ auth }: { auth: string }) {
  const info = authLabels[auth]

  if (!info) return null

  const isKey = auth === 'api_key'

  return (
    <div className='flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200'>
      {isKey ? <Key size={14} className='text-amber-600 mt-0.5 flex-shrink-0' /> : <Lock size={14} className='text-amber-600 mt-0.5 flex-shrink-0' />}
      <div>
        <span className='text-sm font-semibold text-amber-800'>{info.label}</span>
        <span className='text-xs text-amber-600 ml-1'>— {info.description}</span>
      </div>
    </div>
  )
}

function ParamTable({ params }: { params: ApiEndpoint['parameters'] }) {
  if (!params?.length) return null

  return (
    <div className='overflow-hidden rounded-lg border border-gray-200'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='bg-gray-50 border-b border-gray-200'>
            <th className='text-left px-4 py-2.5 font-semibold text-gray-700'>Tham số</th>
            <th className='text-left px-4 py-2.5 font-semibold text-gray-700'>Kiểu</th>
            <th className='text-left px-4 py-2.5 font-semibold text-gray-700'>Bắt buộc</th>
            <th className='text-left px-4 py-2.5 font-semibold text-gray-700'>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {params.map(p => (
            <tr key={p.name} className='border-b border-gray-100 last:border-0'>
              <td className='px-4 py-2.5'>
                <code className='text-sm font-mono bg-gray-100 px-1.5 py-0.5 rounded text-rose-600'>{p.name}</code>
              </td>
              <td className='px-4 py-2.5 text-gray-600'>{p.type}</td>
              <td className='px-4 py-2.5'>
                {p.required ? (
                  <span className='text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded'>Required</span>
                ) : (
                  <span className='text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded'>Optional</span>
                )}
              </td>
              <td className='px-4 py-2.5 text-gray-600'>
                {p.description}
                {p.example && (
                  <span className='ml-2 text-xs text-gray-400'>VD: <code className='bg-gray-100 px-1 rounded'>{p.example}</code></span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ApiUsageProps {
  endpoints?: ApiEndpoint[]
}

export default function ApiUsage({ endpoints }: ApiUsageProps) {
  const data = endpoints || apiEndpoints

  const [selectedApi, setSelectedApi] = useState(data[0]?.id || '')
  const [selectedStatus, setSelectedStatus] = useState('200 OK')
  const [isBodyExpanded, setIsBodyExpanded] = useState(true)
  const [isResponseExpanded, setIsResponseExpanded] = useState(true)

  const currentApi = data.find(api => api.id === selectedApi) || data[0]

  // Nhóm endpoints theo category
  const groupedApis = useMemo(() => {
    const groups: Record<string, ApiEndpoint[]> = {}

    data.forEach(api => {
      if (!groups[api.category]) groups[api.category] = []
      groups[api.category].push(api)
    })

    return groups
  }, [data])

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

  const handleSelectApi = (id: string) => {
    setSelectedApi(id)
    setSelectedStatus('200 OK')
    setIsBodyExpanded(true)
    setIsResponseExpanded(true)
  }

  return (
    <div className='flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200' style={{ minHeight: '600px' }}>
      {/* Sidebar */}
      <div className='w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0'>
        <div className='p-3 border-b border-gray-100 bg-gray-50'>
          <span className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Endpoints</span>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {Object.entries(groupedApis).map(([category, apis]) => (
            <div key={category}>
              <div className='px-4 pt-3 pb-1'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                  {categoryLabels[category] || category}
                </span>
              </div>
              {apis.map(api => (
                <div
                  key={api.id}
                  onClick={() => handleSelectApi(api.id)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    selectedApi === api.id
                      ? 'bg-orange-50 border-l-4 border-l-orange-500'
                      : 'border-l-4 border-l-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <h3 className='font-medium text-gray-900 text-sm m-0 leading-tight'>{api.title}</h3>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${getMethodColor(api.method)} flex-shrink-0 ml-2`}>
                      {api.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-y-auto'>
        <div className='flex-1 p-6'>
          <div className='max-w-4xl mx-auto space-y-5'>

            {/* Endpoint URL + Description */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5'>
              <div className='mb-3'>
                <h2 className='text-lg font-bold text-gray-900 m-0'>{currentApi.title}</h2>
                <p className='text-sm text-gray-500 mt-1 mb-0'>{currentApi.description}</p>
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
                  <Code size={12} className='inline mr-1' />
                  Endpoint
                </label>
                <div className='flex items-center space-x-2'>
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getMethodColor(currentApi.method)}`}>
                    {currentApi.method}
                  </span>
                  <div className='flex-1 bg-gray-900 rounded-lg p-3'>
                    <code className='text-blue-400 font-mono text-sm'>{currentApi.endpoint}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication */}
            <AuthBadge auth={currentApi.auth} />

            {/* Parameters Table */}
            {currentApi.parameters && currentApi.parameters.length > 0 && (
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <div className='p-4 border-b border-gray-100'>
                  <h3 className='text-base font-semibold text-gray-900 flex items-center m-0'>
                    <Shield size={16} className='mr-2 text-gray-400' />
                    Parameters
                  </h3>
                </div>
                <div className='p-4'>
                  <ParamTable params={currentApi.parameters} />
                </div>
              </div>
            )}

            {/* Request Body */}
            {currentApi.requestBody && (
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                <div
                  className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors'
                  onClick={() => setIsBodyExpanded(!isBodyExpanded)}
                >
                  <h3 className='text-base font-semibold text-gray-900 flex items-center m-0'>
                    <Settings size={16} className='mr-2 text-gray-400' />
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
                <h3 className='text-base font-semibold text-gray-900 m-0'>Responses</h3>
                {isResponseExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {isResponseExpanded && (
                <div className='px-4 pb-4 space-y-4'>
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
                  <CodeBlock
                    code={currentApi.responses[selectedStatus] || 'No response data'}
                    title={`Response — ${selectedStatus}`}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
