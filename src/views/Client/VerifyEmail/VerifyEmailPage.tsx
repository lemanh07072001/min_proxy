'use client'

import { useEffect, useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import axios from 'axios'

import { signIn } from 'next-auth/react'

import ErrorPage from './Error'
import LoadingPage from './Loading'
import SuccessPage from './Success'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const verifyUrl = searchParams.get('verify_url')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  const router = useRouter()

  useEffect(() => {
    if (!verifyUrl) {
      setStatus('error')

      return
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(verifyUrl)
        const data = res.data

        if (data.status === 'success' && data.token) {
          // ✅ Gọi NextAuth đăng nhập bằng credentials provider
          const result = await signIn('credentials', {
            email: data.user.email,
            token: data.token,
            redirect: false
          })

          if (result?.error) throw new Error(result.error)

          setStatus('success')

          router.replace('/overview')
        }
      } catch (error) {
        console.error('❌ Verify error:', error)
        setStatus('error')
      }
    }

    verifyEmail()
  }, [router, verifyUrl])

  return (
    <>
      {status === 'loading' && <LoadingPage />}
      {status === 'error' && <ErrorPage />}
      {status === 'success' && <SuccessPage />}
    </>
  )
}
