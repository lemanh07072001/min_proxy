'use client'

import type { FormNotification } from '@/hooks/useFormNotification'

const styles: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: '✓' },
  error:   { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' },
  warning: { bg: '#fffbeb', border: '#fde68a', color: '#b45309', icon: '!' },
}

interface FormAlertProps {
  notification: FormNotification | null
  onClose: () => void
}

export default function FormAlert({ notification, onClose }: FormAlertProps) {
  if (!notification) return null

  const s = styles[notification.type] || styles.error

  return (
    <div
      data-form-alert
      style={{
        margin: '8px 20px 0',
        padding: '12px 16px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        animation: notification.type === 'error' ? 'shake 0.4s ease' : 'fadeIn 0.3s ease',
      }}
    >
      <span>{s.icon} {notification.message}</span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 18, padding: '0 4px', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  )
}
