'use client'

import ApiUsage from '@/views/Client/OrderRotatingProxy/ApiUsage'
import { apiEndpoints } from '@/configs/apiDocsConfig'

export default function DocsApiPage() {
  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h1 className='text-xl font-bold text-gray-900 m-0'>API Documentation</h1>
        <p className='text-sm text-gray-500 mt-1 mb-0'>
          Tài liệu API cho nhà phát triển tích hợp hệ thống proxy. Base URL: <code className='bg-gray-100 px-1.5 py-0.5 rounded text-rose-600 text-xs'>{process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL}</code>
        </p>
      </div>
      <ApiUsage endpoints={apiEndpoints} />
    </div>
  )
}
