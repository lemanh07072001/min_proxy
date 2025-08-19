

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports
import '@/app/globals.css'
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { i18n } from '@/configs/i18n'

import "@/app/[lang]/(client)/products/main.css"

import { headers } from 'next/headers'

import type { Locale } from '@/configs/i18n'

import type { ChildrenType } from '@core/types'
// import Header from '@/app/[lang]/(client)/layout-client/Header'
// import Footer from '@/app/[lang]/(client)/layout-client/Sidebar'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'



const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  const headersList = await headers()
  const systemMode = await getSystemMode()

  const direction = i18n.langDirection[params.lang]

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
      <InitColorSchemeScript attribute='data' defaultMode={systemMode} />

      {children}

      </body>
      </html>
    </TranslationWrapper>
  )
}

export default Layout
