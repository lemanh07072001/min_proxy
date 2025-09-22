// Type Imports
import type { Locale } from '@/configs/configi18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// Utils
import { validateServerSessionWithAPI } from '@/utils/serverSessionValidation'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  // Validate session với API check để đảm bảo token còn valid
  const session = await validateServerSessionWithAPI()

  if (session) {
    return <>{children}</>
  }

      // Nếu session không hợp lệ, hiển thị AuthRedirect
      return <AuthRedirect lang={locale}>{null}</AuthRedirect>
}
