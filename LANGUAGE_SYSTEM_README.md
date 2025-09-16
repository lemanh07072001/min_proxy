# 🌐 Hệ thống Ngôn ngữ (Language System)

## 📋 Tổng quan

Hệ thống ngôn ngữ hỗ trợ 5 ngôn ngữ: Tiếng Việt, English, 中文, 한국어, 日本語 với URL-based routing.

## 🏗️ Cấu trúc

### Files chính:
- `src/configs/configi18n.ts` - Cấu hình ngôn ngữ chính
- `src/configs/i18n.ts` - Cấu hình i18next
- `src/utils/languageUtils.ts` - Utilities cho ngôn ngữ
- `src/hooks/useLanguageSync.tsx` - Hook đồng bộ ngôn ngữ
- `src/components/language-selector/LanguageSelect.tsx` - Component chọn ngôn ngữ
- `src/locales/` - Thư mục chứa file dịch

### Ngôn ngữ được hỗ trợ:
- `vi` - Tiếng Việt 🇻🇳
- `en` - English 🇺🇸  
- `cn` - 中文 🇨🇳
- `ko` - 한국어 🇰🇷
- `ja` - 日本語 🇯🇵

## 🚀 Cách sử dụng

### 1. Sử dụng LanguageSelector

```tsx
import LanguageSelect from '@/components/language-selector/LanguageSelect'

function MyComponent() {
  return (
    <div>
      <LanguageSelect />
    </div>
  )
}
```

### 2. Sử dụng useLanguageSwitcher

```tsx
import { useLanguageSwitcher } from '@/utils/languageUtils'

function MyComponent() {
  const { currentLocale, switchLanguage } = useLanguageSwitcher()
  
  return (
    <div>
      <p>Current language: {currentLocale}</p>
      <button onClick={() => switchLanguage('en')}>
        Switch to English
      </button>
    </div>
  )
}
```

### 3. Sử dụng useTranslation

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('home.title')}</p>
    </div>
  )
}
```

## 🔧 Cấu hình

### Thêm ngôn ngữ mới:

1. **Cập nhật `src/configs/configi18n.ts`:**
```typescript
export const i18n = {
  defaultLocale: 'vi',
  locales: ['vi', 'en', 'cn', 'ko', 'ja', 'new-lang'], // Thêm ngôn ngữ mới
  langDirection: {
    vi: 'ltr',
    en: 'ltr',
    cn: 'ltr',
    ko: 'ltr',
    ja: 'ltr',
    'new-lang': 'ltr' // Thêm direction
  }
}
```

2. **Cập nhật `src/data/languages/languagesData.ts`:**
```typescript
const Languages = [
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'cn', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'new-lang', name: 'New Language', flag: '🏳️' } // Thêm ngôn ngữ mới
]
```

3. **Tạo file locale mới `src/locales/new-lang.json`:**
```json
{
  "welcome": "Welcome message",
  "home": {
    "title": "Home",
    "description": "Home description"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "register": "Register"
  },
  "common": {
    "yes": "Yes",
    "no": "No"
  }
}
```

4. **Cập nhật `src/configs/i18n.ts`:**
```typescript
import newLang from '@/locales/new-lang.json'

// Thêm vào resources
resources: { 
  en: { translation: en }, 
  vi: { translation: vi }, 
  cn: { translation: cn },
  ko: { translation: ko },
  ja: { translation: ja },
  'new-lang': { translation: newLang } // Thêm resource mới
}
```

5. **Cập nhật `next.config.ts`:**
```typescript
{
  source: '/((?!(?:vi|en|cn|ko|ja|new-lang)\\b)):path', // Thêm vào regex
  destination: '/vi/:path',
  permanent: false
}
```

## 🌐 URL Routing

### Format URL:
- `/vi/page` - Tiếng Việt
- `/en/page` - English
- `/cn/page` - 中文
- `/ko/page` - 한국어
- `/ja/page` - 日本語

### Redirect rules:
- `/` → `/vi` (default)
- `/invalid-lang/page` → `/vi/page` (fallback)

## 🔄 Cách hoạt động

1. **URL Detection**: `getCurrentLocale()` lấy ngôn ngữ từ URL
2. **Language Sync**: `useLanguageSync` hook đồng bộ với i18n
3. **Translation**: `useTranslation` hook cung cấp hàm `t()`
4. **Language Switch**: `useLanguageSwitcher` thay đổi URL

## 📝 Best Practices

1. **Luôn sử dụng `t()` function** cho text có thể dịch
2. **Đặt key có cấu trúc** như `home.title`, `auth.login`
3. **Sử dụng fallback** cho các key không tồn tại
4. **Test tất cả ngôn ngữ** khi thêm tính năng mới
5. **Giữ file locale đồng bộ** giữa các ngôn ngữ

## 🐛 Troubleshooting

### Ngôn ngữ không đồng bộ:
- Kiểm tra URL có đúng format không
- Kiểm tra file locale có tồn tại không
- Kiểm tra console có lỗi không

### Translation không hiển thị:
- Kiểm tra key có đúng không
- Kiểm tra file locale có key đó không
- Kiểm tra i18n có được khởi tạo không

### LanguageSelector không hoạt động:
- Kiểm tra `useLanguageSwitcher` có được import đúng không
- Kiểm tra URL có thay đổi không
- Kiểm tra `useLanguageSync` có hoạt động không
