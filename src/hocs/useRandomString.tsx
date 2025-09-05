import { useCallback } from 'react'

function useRandomString(length: number = 6) {
  const generate = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }, [length])

  return generate
}

export default useRandomString
