'use client' // Đánh dấu đây là một Client Component

import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const TanstackProvider = ({ children }) => {
  // Sử dụng useState để đảm bảo QueryClient chỉ được tạo một lần
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default TanstackProvider
