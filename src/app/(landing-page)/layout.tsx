// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Providers from '@components/Providers'

// Util Imports
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const Layout = async (props: ChildrenType) => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <Header />
      {children}
      <Footer />
    </Providers>
  )
}

export default Layout
