import { usePathname, useRouter } from 'next/navigation'
import { i18n } from '@/configs/configi18n'

export type Locale = typeof i18n.locales[number]

/**
 * Tạo đường dẫn mới với ngôn ngữ được chỉ định
 * @param pathname - Đường dẫn hiện tại
 * @param locale - Ngôn ngữ mới
 * @returns Đường dẫn mới với ngôn ngữ được chỉ định
 */
export const getLocalePath = (pathname: string, locale: Locale): string => {
  // Loại bỏ ngôn ngữ hiện tại khỏi pathname
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
  
  // Tạo đường dẫn mới với ngôn ngữ mới
  return `/${locale}${pathWithoutLocale}`
}

/**
 * Lấy ngôn ngữ hiện tại từ pathname
 * @param pathname - Đường dẫn hiện tại
 * @returns Ngôn ngữ hiện tại hoặc default locale
 */
export const getCurrentLocale = (pathname: string): Locale => {
  const segments = pathname.split('/')
  const locale = segments[1] as Locale
  
  return i18n.locales.includes(locale) ? locale : i18n.defaultLocale
}

/**
 * Hook để chuyển đổi ngôn ngữ
 * @returns Object chứa các function để thao tác với ngôn ngữ
 */
export const useLanguageSwitcher = () => {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentLocale = getCurrentLocale(pathname)
  
  const switchLanguage = (locale: Locale) => {
    const newPath = getLocalePath(pathname, locale)
    router.push(newPath, { scroll: false })
  }
  
  return {
    currentLocale,
    switchLanguage,
    getLocalePath: (locale: Locale) => getLocalePath(pathname, locale)
  }
}
