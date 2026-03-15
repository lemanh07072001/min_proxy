// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@/configs/configi18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import { getDictionary } from '@/utils/getDictionary'

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

// Context Imports — chỉ 3 providers mà root layout CHƯA cung cấp
// (NextAuthProvider + ModalContextProvider đã có ở root layout [lang]/layout.tsx)
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'

// Util Imports
import { getMode, getSystemMode, getSettingsFromCookie } from '@core/utils/serverHelpers'

// CSS imports
import '@/app/[lang]/(private)/(client)/private-specific.css'

function HorizontalFooter() {
  return null
}

const Layout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const { children } = props

  const params = await props.params
  const lang = params.lang as Locale

  // Fetch TẤT CẢ song song — không còn waterfall như Providers cũ
  const [mode, systemMode, dictionary, settingsCookie] = await Promise.all([
    getMode(),
    getSystemMode(),
    getDictionary(lang),
    getSettingsFromCookie()
  ])

  return (
    <VerticalNavProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <BrandingThemeSync />
        <ThemeProvider direction='ltr' systemMode={systemMode}>
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
                    <AuthGuard locale={lang}>
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </AuthGuard>
                  </VerticalLayout>
                }
                horizontalLayout={
                  <HorizontalLayout
                    header={<Header dictionary={dictionary} />}
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
