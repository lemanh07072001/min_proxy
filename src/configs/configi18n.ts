export const i18n = {
  defaultLocale: 'vi',
  locales: ['vi', 'en', 'cn', 'ko', 'ja'],
  langDirection: {
    vi: 'ltr',
    en: 'ltr',
    cn: 'ltr',
    ko: 'ltr',
    ja: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
