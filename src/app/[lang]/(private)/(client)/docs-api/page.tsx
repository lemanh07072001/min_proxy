'use client'

import ApiUsage from '@/views/Client/OrderRotatingProxy/ApiUsage'
import { apiEndpoints } from '@/configs/apiDocsConfig'

export default function DocsApiPage() {
  return (
    <div className='ts-layout-content-height-fixed flex flex-col flex-1 overflow-hidden'>
      <ApiUsage endpoints={apiEndpoints} />
    </div>
  )
}
