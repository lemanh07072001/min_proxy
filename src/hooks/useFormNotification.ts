import { useState, useCallback } from 'react'

export type FormNotificationType = 'success' | 'error' | 'warning'

export interface FormNotification {
  type: FormNotificationType
  message: string
}

/**
 * Hook quản lý thông báo inline trong modal/form.
 * Thay thế toast trong modal — tránh z-index conflict.
 *
 * Usage:
 *   const { notification, showSuccess, showError, clear } = useFormNotification()
 *   // Trong onSuccess: showSuccess('Thành công!')
 *   // Trong onError: showError('Có lỗi xảy ra')
 *   // Render: <FormAlert notification={notification} onClose={clear} />
 */
export function useFormNotification() {
  const [notification, setNotification] = useState<FormNotification | null>(null)

  const showSuccess = useCallback((message: string) => {
    setNotification({ type: 'success', message })
    scrollToAlert()
  }, [])

  const showError = useCallback((message: string) => {
    setNotification({ type: 'error', message })
    scrollToAlert()
  }, [])

  const showWarning = useCallback((message: string) => {
    setNotification({ type: 'warning', message })
    scrollToAlert()
  }, [])

  const clear = useCallback(() => setNotification(null), [])

  return { notification, showSuccess, showError, showWarning, clear }
}

function scrollToAlert() {
  // Tìm alert element gần nhất trong DOM và scroll tới
  setTimeout(() => {
    document.querySelector('[data-form-alert]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, 50)
}
