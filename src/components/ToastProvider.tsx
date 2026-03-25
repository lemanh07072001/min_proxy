'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * ToastContainer bọc trong Portal → render trực tiếp vào <body>.
 * Tránh bị nhốt trong stacking context của parent (vd: div.relative.z-10).
 */
export default function ToastProvider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <ToastContainer
      position='top-center'
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme='light'
      limit={3}
    />,
    document.body
  )
}
