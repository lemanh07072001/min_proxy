// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
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

import AuthGuard from '@/hocs/AuthGuard'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import HorizontalLayout from '@layouts/HorizontalLayout'
import Header from '@components/layout/horizontal/Header'

// CSS imports - Import shared-layout.css trước để có CSS variables
import '@/app/[lang]/(private)/(client)/private-specific.css'

function HorizontalFooter() {
  return null
}

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  // Vars - Fetch song song để tối ưu performance
  const [mode, systemMode, dictionary] = await Promise.all([
    getMode(),
    getSystemMode(),
    getDictionary(params.lang)
  ])

  return (
    <Providers direction="ltr">
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
                <AuthGuard locale={params.lang}>
                  {children}
                </AuthGuard>
              </VerticalLayout>
            }
            horizontalLayout={
              <HorizontalLayout 
                header={<Header dictionary={dictionary} />} 
                footer={<HorizontalFooter />}
              >
                <AuthGuard locale={params.lang}>
                  {children}
                </AuthGuard>
              </HorizontalLayout>
            }
          />
        </LanguageSyncWrapper>
      </LayoutProvider>
    </Providers>
  )
}

export default Layout
