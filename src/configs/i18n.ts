export const i18n = {
  defaultLocale: 'vi',
  locales: ['en', 'cn', 'vi'],
  langDirection: {
    en: 'ltr',
    cn: 'ltr',
    vi: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
