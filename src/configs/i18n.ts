import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { i18n as appI18n } from '@/configs/configi18n'
import en from '@/data/dictionaries/en.json'
import vi from '@/data/dictionaries/vi.json'
import cn from '@/data/dictionaries/cn.json'
import ko from '@/data/dictionaries/ko.json'
import ja from '@/data/dictionaries/ja.json'

// Khởi tạo i18n
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { 
      en: { translation: en }, 
      vi: { translation: vi }, 
      cn: { translation: cn },
      ko: { translation: ko },
      ja: { translation: ja }
    },
    lng: appI18n.defaultLocale,
    fallbackLng: appI18n.defaultLocale,
    supportedLngs: appI18n.locales,
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false
    },
    debug: false,

    // Đảm bảo có thể thay đổi ngôn ngữ
    saveMissing: false,
    missingKeyHandler: false,

    // Force reload when language changes
    reloadOnPrerender: true
  })
}

export default i18n
