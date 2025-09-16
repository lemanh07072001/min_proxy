// Type Imports
import type { Metadata } from 'next'

import type { ChildrenType } from '@core/types'
import type { Locale } from '@/configs/configi18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import { getDictionary } from '@/utils/getDictionary'

// Component Imports
import Providers from '@components/Providers'
import LayoutProvider from '@components/LayoutProvider'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import LanguageSyncWrapper from '@/components/LanguageSyncWrapper'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import HorizontalLayout from '@layouts/HorizontalLayout'
import Header from '@components/layout/horizontal/Header'

// CSS riêng cho public layout
import './public-specific.css'

function HorizontalFooter() {
  return null
}

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  // Vars - Fetch song song để tối ưu performance
  const [mode, systemMode, dictionary] = await Promise.all([getMode(), getSystemMode(), getDictionary(params.lang)])

  return (
    <Providers direction='ltr'>
      <LayoutProvider>
        <LanguageSyncWrapper>
          <LayoutWrapper
            systemMode={systemMode}
            verticalLayout={
              <VerticalLayout
                navigation={<Navigation dictionary={dictionary} mode={mode} />}
                navbar={<Navbar />}
                landingPage={false}
              >
                {children}
              </VerticalLayout>
            }
            horizontalLayout={
              <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
                {children}
              </HorizontalLayout>
            }
          />
        </LanguageSyncWrapper>
      </LayoutProvider>
    </Providers>
  )
}

export default Layout
