import { useSyncExternalStore } from 'react'

// Module-level state — shared giữa VerticalMenu và PageTransition
let _isPending = false
const _listeners = new Set<() => void>()

export function setNavigationPending(value: boolean) {
  if (_isPending === value) return
  _isPending = value
  _listeners.forEach(l => l())
}

export function useNavigationPending() {
  return useSyncExternalStore(
    (callback) => {
      _listeners.add(callback)

      return () => { _listeners.delete(callback) }
    },
    () => _isPending,
    () => false
  )
}
