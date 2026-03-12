// MUI Imports
import Button from '@mui/material/Button'
import { ToastContainer } from 'react-toastify'

import type { ChildrenType } from '@core/types'
import Header from '@/app/[lang]/(landing-page)/components/Header'

// Lightweight providers — chỉ cần SettingsProvider + ThemeProvider cho MUI
// KHÔNG dùng Providers.tsx vì nó gọi getServerSession() thừa
// và wrap NextAuthProvider + ModalContextProvider (root layout đã wrap rồi)
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

import ScrollToTop from '@core/components/scroll-to-top'
import Footer from './components/Footer'

const Layout = async (props: ChildrenType) => {
  const { children } = props

  // Chỉ fetch những gì MUI theme cần — KHÔNG gọi getServerSession()
  const [mode, settingsCookie, systemMode] = await Promise.all([
    getMode(),
    getSettingsFromCookie(),
    getSystemMode()
  ])

  const direction = 'ltr'

  return (
    <>
      {/* Override html/body/.main constraints cho landing page —
          globals.css đặt html { block-size: 100% } và body { flex-auto }
          làm giới hạn chiều cao = viewport, landing page cần scroll tự nhiên */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, html body {
              height: auto !important;
              block-size: auto !important;
              min-block-size: auto !important;
              overflow-y: auto !important;
            }
            html body {
              flex: none !important;
              display: block !important;
            }
            html body .main {
              background: none !important;
              display: block !important;
              height: auto !important;
              block-size: auto !important;
              flex: none !important;
            }
          `
        }}
      />
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          <div className='landing-page-wrapper'>
            <Header />
            <main className='landing-page'>
              {children}
            </main>
            <Footer />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover
              theme="light"
              limit={3}
              style={{ zIndex: 99999 }}
            />
          </div>
          <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='tabler-arrow-up' />
            </Button>
          </ScrollToTop>
        </ThemeProvider>
      </SettingsProvider>
    </>
  )
}

export default Layout
