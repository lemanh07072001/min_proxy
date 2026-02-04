// FILE: hooks/useCopy.ts

import { useState, useEffect } from 'react'

import { toast } from 'react-toastify'

export function useCopy(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async (text: string, successMessage?: string) => {
    let copySuccessful = false

    // 1. THỬ DÙNG CLIPBOARD API (Hiện đại, cần HTTPS/Secure Context)
    if (navigator?.clipboard) {
      try {
        await navigator.clipboard.writeText(text)
        copySuccessful = true
      } catch (error) {
      }
    }

    // 2. THỬ PHƯƠNG PHÁP FALLBACK (document.execCommand)
    if (!copySuccessful) {
      try {
        const textArea = document.createElement('textarea')

        textArea.value = text

        // Cần thiết lập vị trí để không ảnh hưởng đến layout
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'

        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        copySuccessful = document.execCommand('copy')
        document.body.removeChild(textArea)

        if (!copySuccessful) {
          throw new Error('execCommand failed')
        }
      } catch (error) {
        copySuccessful = false
      }
    }

    // 3. XỬ LÝ KẾT QUẢ
    setIsCopied(copySuccessful)

    if (copySuccessful) {
      toast.success(successMessage || 'Đã sao chép vào clipboard!')
    } else {
      toast.error('Sao chép thất bại! Vui lòng thử lại. Lỗi: Clipboard not supported.')
    }

    return copySuccessful
  }

  useEffect(() => {
    // ... (Logic timer giữ nguyên)
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => clearTimeout(timer)
    }
  }, [isCopied, timeout])

  return [isCopied, copy] as const
}
