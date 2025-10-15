'use client'

import { useEffect, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import axios from 'axios'

import ErrorPage from './Error'
import LoadingPage from './Loading'
import SuccessPage from './Success'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const verifyUrl = searchParams.get('verify_url')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!verifyUrl) {
      setStatus('error')

      return
    }

    axios
      .get(verifyUrl)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [verifyUrl])

  return (
    <>
      {status === 'loading' && <LoadingPage />}
      {status === 'error' && <ErrorPage />}
      {status === 'success' && <SuccessPage />}
    </>
  )
}
