// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@/configs/configi18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import LayoutProvider from '@components/LayoutProvider'
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import Header from '@components/layout/horizontal/Header'
import LanguageSyncWrapper from '@/components/LanguageSyncWrapper'
import ThemeProvider from '@components/theme'

import AuthGuard from '@/hocs/AuthGuard'
import PageTransition from '@/components/PageTransition'
import BrandingThemeSync from '@/components/BrandingThemeSync'
import PartnersBanner from '@/components/PartnersBanner'

// Context Imports — chỉ 3 providers mà root layout CHƯA cung cấp
// (NextAuthProvider + ModalContextProvider đã có ở root layout [lang]/layout.tsx)
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'

// Util Imports — chỉ dùng defaults, theme sync client-side qua BrandingThemeSync
import themeConfig from '@configs/themeConfig'

// CSS imports
import '@/app/[lang]/(private)/(client)/private-specific.css'

function HorizontalFooter() {
  return null
}

const Layout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const { children } = props

  const params = await props.params
  const lang = params.lang as Locale

  // Không gọi async functions (cookies, getDictionary) → layout static → navigation instant
  const mode = themeConfig.mode
  const systemMode = 'light' as const

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={{}} mode={mode}>
        <BrandingThemeSync />
        <ThemeProvider direction='ltr' systemMode={systemMode}>
          <LayoutProvider>
            <LanguageSyncWrapper>
              <LayoutWrapper
                systemMode={systemMode}
                verticalLayout={
                <VerticalLayout
                  navigation={<Navigation mode={mode} />}
                  navbar={<><Navbar /><PartnersBanner /></>}
                  landingPage={false}
                >
                    <AuthGuard locale={lang}>
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </AuthGuard>
                  </VerticalLayout>
                }
                horizontalLayout={
                  <HorizontalLayout
                    header={<><Header /><PartnersBanner /></>}
                    footer={<HorizontalFooter />}
                  >
                    <AuthGuard locale={lang}>
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </AuthGuard>
                  </HorizontalLayout>
                }
              />
            </LanguageSyncWrapper>
          </LayoutProvider>
        </ThemeProvider>
      </SettingsProvider>
    </VerticalNavProvider>
  )
}

export default Layout
