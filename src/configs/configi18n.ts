export const i18n = {
  defaultLocale: 'vi',
  locales: ['vi', 'en', 'cn', 'ko', 'ja', 'th'],
  langDirection: {
    vi: 'ltr',
    en: 'ltr',
    cn: 'ltr',
    ko: 'ltr',
    ja: 'ltr',
    th: 'ltr'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
