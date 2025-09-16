// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports - CSS Variables phải được import đầu tiên
import '@/app/css-variables.css'
import '@/app/globals.css'
import '@/app/shared-layout.css' // CSS chung cho cả private và public
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { Figtree } from 'next/font/google'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { getServerSession } from 'next-auth'

import { i18n } from '@/configs/configi18n'

import '@/app/[lang]/(landing-page)/main.css'

import { headers } from 'next/headers'

import type { Locale } from '@/configs/configi18n'

import type { ChildrenType } from '@core/types'

import TanstackProvider from '@/components/TanstackProvider'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'

import { ModalContextProvider } from '@/app/contexts/ModalContext'

import { authOptions } from '@/libs/auth'
import { UserProvider } from '@/app/contexts/UserContext'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import ClientLayout from '@components/ClientLayout'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

export const revalidate = 0 //

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  const headersList = await headers()
  const systemMode = await getSystemMode()

  const direction = i18n.langDirection[params.lang]

  const session = await getServerSession(authOptions)

  // ✅ Gọi API /me trên server
  let user = null
  if (session) {
    if (session?.access_token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store'
      })
      if (res.ok) user = await res.json()
    }
  }

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction} className={figtree.variable} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <TanstackProvider>
            <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
            <ModalContextProvider>
              <UserProvider value={user}>{children}</UserProvider>
            </ModalContextProvider>
          </TanstackProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
