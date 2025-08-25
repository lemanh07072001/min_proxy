

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports
import '@/app/globals.css'
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { i18n } from '@configs/i18n'

import "@/app/[lang]/(private)/(landing-page)/main.css"

import { headers } from 'next/headers'

import type { Locale } from '@configs/i18n'

import type { ChildrenType } from '@core/types'
import Header from '@/app/[lang]/(private)/(landing-page)/components/Header'
import Footer from '@/app/[lang]/(private)/(landing-page)/components/Footer'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import Providers from '@components/Providers'




const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  // Vars
  const direction = 'ltr'
  const mode = await getMode()
  const systemMode = await getSystemMode()

  const dictionary = await getDictionary(params.lang)



  return (
    <>
      <Providers direction={direction}>
      <Header/>
      {children}
      <Footer/>
      </Providers>
    </>
  )
}

export default Layout
