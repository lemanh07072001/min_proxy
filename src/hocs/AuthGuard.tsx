// Type Imports
import type { Locale } from '@/configs/configi18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// Utils
import { validateServerSessionBasic } from '@/utils/serverSessionValidation'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  // Validate session cơ bản (không gọi API) để test
  const session = await validateServerSessionBasic()

  if (session) {
    return <>{children}</>
  }

      // Nếu session không hợp lệ, hiển thị AuthRedirect
      return <AuthRedirect lang={locale}>{null}</AuthRedirect>
}
