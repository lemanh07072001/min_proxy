"use client"

import { useModalContext } from '@/app/contexts/ModalContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'


export function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const router = useRouter()

  const { openAuthModal } = useModalContext()

  useEffect(() => {
    if (token && email) {
      // mở modal đổi mật khẩu
      openAuthModal('reset', email, token)
      setTimeout(() => router.replace('/overview'), 500) // delay
    }
  }, [token, email, openAuthModal,router])

return(
  <>
  dsa
  </>
)
}