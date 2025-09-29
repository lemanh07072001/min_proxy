// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Style Imports - CSS Variables phải được import đầu tiên
import '@/app/css-variables.css'
import '@/app/globals.css'
import '@/app/shared-layout.css' // CSS chung cho cả private và public
import '@/app/root.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

import { Figtree } from 'next/font/google'

import { headers } from 'next/headers'

import { usePathname } from 'next/navigation'

// Utils
import { getServerUserData } from '@/utils/serverSessionValidation'

import type { Metadata } from 'next'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import { getServerSession } from 'next-auth'

import { i18n } from '@/configs/configi18n'

import '@/app/[lang]/(landing-page)/main.css'

import type { Locale } from '@/configs/configi18n'

import type { ChildrenType } from '@core/types'

import TanstackProvider from '@/components/TanstackProvider'

import { getSystemMode } from '@core/utils/serverHelpers'
import TranslationWrapper from '@/hocs/TranslationWrapper'

import { ModalContextProvider } from '@/app/contexts/ModalContext'

import { authOptions } from '@/libs/auth'

import I18nextProvider from '@/app/i18n-provider'

import StoreProvider from '@/components/StoreProvider'
import { setUser, getUser, addBalance } from '@/store/userSlice'

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap'
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  icons: { icon: '/images/logo/MKT_PROXY_2.png' },
  description: 'MKTProxy cung cấp giải pháp proxy IPV4 sạch, tốc độ cao, độ ổn định tuyệt đối. Chuyên dùng cho nuôi nick, marketing đa kênh, làm SEO và scraping dữ liệu.',

  openGraph: {
    title: `MKTProxy - Proxy Dân Cư & Datacenter Tốc Độ Cao, Giá Rẻ`,
    description: 'Giải pháp proxy tốc độ cao, IP sạch cho các chiến dịch marketing, SEO và nuôi tài khoản. Bảo mật tuyệt đối. Dùng thử ngay!',
    url: 'https://mktproxy.com', // Thay bằng domain chính thức của bạn
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: '/images/social-og-image.jpg', // Tạo một ảnh đẹp (1200x630px)
        width: 1200,
        height: 630,
        alt: 'MKTProxy - Proxy Dân Cư Giá Rẻ',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  // Cấu hình Twitter Card (quan trọng cho Twitter)
  twitter: {
    card: 'summary_large_image',
    title: `MKTProxy - Proxy Dân Cư & Datacenter Tốc Độ Cao, Giá Rẻ`,
    description: 'Proxy IPV4/IPV6 sạch cho marketing và SEO. Tốc độ cao, giá rẻ.',

    images: ['/images/social-og-image.jpg'],
  },
}

export const revalidate = 0 //

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: Locale }> }) => {
  const { children } = props

  const params = await props.params

  const headersList = await headers()
  const systemMode = await getSystemMode()

  const direction = i18n.langDirection[params.lang]

  // ✅ Sử dụng server-side utility để lấy user data
  const user = await getServerUserData()

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <html id='__next' lang={params.lang} dir={direction} className={figtree.variable} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <I18nextProvider locale={params.lang}>
            <TanstackProvider>
              <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
              <StoreProvider initialUser={user}>
                {children}
              </StoreProvider>
            </TanstackProvider>
          </I18nextProvider>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
