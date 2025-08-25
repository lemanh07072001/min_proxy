// src/i18n/dictionaries.ts

import 'server-only' // Đảm bảo code này chỉ chạy trên server

type Locale = 'en' | 'vi'

// Định nghĩa các hàm tải từ điển
const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  vi: () => import('@/data/dictionaries/vi.json').then(module => module.default),
  cn: () => import('@/data/dictionaries/cn.json').then(module => module.default)
}

// Hàm để lấy từ điển dựa trên locale
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]() // Gọi hàm để tải và trả về nội dung JSON
}