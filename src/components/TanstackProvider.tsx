'use client'

import { useState, lazy } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? lazy(() =>
        import('@tanstack/react-query-devtools').then(mod => ({
          default: mod.ReactQueryDevtools
        }))
      )
    : () => null

const TanstackProvider = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default TanstackProvider
