// Third-party Imports
// MUI Imports
import Button from '@mui/material/Button'

// Style Imports
import '@/app/globals.css'
import '@/app/shared-layout.css' // CSS chung cho cả private và public
import '@/app/root.css'
import '@/app/[lang]/(landing-page)/main.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { ToastContainer } from 'react-toastify'

import type { Locale } from '@configs/i18n'
import LayoutWrapper from '@layouts/LayoutWrapper'

import type { ChildrenType } from '@core/types'
import Header from '@/app/[lang]/(landing-page)/components/Header'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { getDictionary } from '@/utils/getDictionary'
import VerticalLayout from '@layouts/VerticalLayout'

import Providers from '@components/Providers'
import HorizontalLayout from '@layouts/HorizontalLayout'

import ScrollToTop from '@core/components/scroll-to-top'
import Footer from './components/Footer'

function HorizontalFooter() {
  return null
}

const Layout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  // Vars
  const direction = 'ltr'
  const mode = await getMode()
  const systemMode = await getSystemMode()

  // const dictionary = await getDictionary(params.lang)

  return (
    <>
      <Providers direction={direction}>
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout landingPage={true} navbar={<Header />} footer={<Footer />}>
              {children}
              <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
                aria-label={undefined}
              />
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header />} footer={<HorizontalFooter />}>
              {children}
            </HorizontalLayout>
          }
        />
        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='tabler-arrow-up' />
          </Button>
        </ScrollToTop>
      </Providers>
    </>
  )
}

export default Layout
