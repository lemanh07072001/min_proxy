
// Type Imports
import { notFound } from 'next/navigation'

import { NextIntlClientProvider, hasLocale } from 'next-intl'

import '@/app/[locale]/(client)/products/main.css'

import {setRequestLocale} from 'next-intl/server';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import type { ChildrenType } from '@core/types'

import { routing } from '@/i18n/routing'
import MainClient from '@/app/[locale]/(client)/layout-client/MainClient'


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

      <MainClient/>

    </NextIntlClientProvider>
  )
}

export default Layout
