// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Vuexy - MUI Next.js Admin Dashboard Template',
  description:
    'Vuexy - MUI Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Nếu locale không nằm trong danh sách thì 404
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound()
  // }

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='vi' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
