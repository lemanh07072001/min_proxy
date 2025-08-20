

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports
import '@/app/globals.css'
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { i18n } from '@configs/i18n'

import "@/app/[lang]/(landing-page)/main.css"

import { headers } from 'next/headers'

import type { Locale } from '@configs/i18n'

import type { ChildrenType } from '@core/types'
import Header from '@/app/[lang]/(landing-page)/components/Header'
import Footer from '@/app/[lang]/(landing-page)/components/Footer'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'



const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  const headersList = await headers()
  const systemMode = await getSystemMode()

  const direction = i18n.langDirection[params.lang]

  return (
    <>
      <Header/>
      {children}
      <Footer/>
    </>
  )
}

export default Layout
