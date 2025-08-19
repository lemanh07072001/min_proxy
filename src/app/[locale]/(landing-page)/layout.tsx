
// Type Imports
import { notFound } from 'next/navigation'

import { NextIntlClientProvider, hasLocale } from 'next-intl'

import {setRequestLocale} from 'next-intl/server';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import type { ChildrenType } from '@core/types'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

import { routing } from '@/i18n/routing'


const Layout = async (props: ChildrenType) => {
  const { children, params } = props

  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <InitColorSchemeScript attribute="data" defaultMode="system" />
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  )
}

export default Layout
