'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hooks để đảm bảo component chỉ render sau khi đã hydrate
 * Giúp tránh hydration mismatch errors
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Custom hooks để safely access browser APIs
 * Chỉ chạy trên client-side để tránh hydration issues
 */
export const useClientOnly = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Custom hooks để safely access localStorage
 */
export const useLocalStorage = (key: string, initialValue?: string) => {
  const [storedValue, setStoredValue] = useState<string | null>(initialValue || null)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key)

        if (item) {
          setStoredValue(item)
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key, isClient])

  const setValue = (value: string) => {
    try {
      if (isClient) {
        window.localStorage.setItem(key, value)
        setStoredValue(value)
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeValue = () => {
    try {
      if (isClient) {
        window.localStorage.removeItem(key)
        setStoredValue(null)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue] as const
}

