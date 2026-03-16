import { useSyncExternalStore } from 'react'

/**
 * Hook kiểm tra tab có đang visible không.
 * Polling hooks dùng để dừng poll khi user rời tab → tiết kiệm bandwidth + pin.
 */

function subscribe(callback: () => void) {
  document.addEventListener('visibilitychange', callback)

  return () => document.removeEventListener('visibilitychange', callback)
}

function getSnapshot() {
  return document.visibilityState === 'visible'
}

function getServerSnapshot() {
  return true
}

export function useTabVisible() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
