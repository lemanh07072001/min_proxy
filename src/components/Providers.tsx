// Type Imports
import { getServerSession } from 'next-auth/next'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import { ModalContextProvider } from '@/app/contexts/ModalContext'
import GlobalSessionCleanup from '@components/GlobalSessionCleanup'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { NextAuthProvider } from '@/app/contexts/nextAuthProvider'
import { authOptions } from '@/libs/auth'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = async (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()
  const systemMode = await getSystemMode()

  const session = await getServerSession(authOptions as any) as any;

  return (
    <NextAuthProvider session={session} basePath={process.env.NEXTAUTH_BASEPATH}>
      <GlobalSessionCleanup />
      <ModalContextProvider>
        <VerticalNavProvider>
          <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
            <ThemeProvider direction={direction} systemMode={systemMode}>
              {children}
            </ThemeProvider>
          </SettingsProvider>
        </VerticalNavProvider>
      </ModalContextProvider>
    </NextAuthProvider>
  )
}

export default Providers
