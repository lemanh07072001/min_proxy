/**
 * Predefined product tags with color coding.
 * Tags are purely visual labels — they do NOT control business logic (buy/sell).
 * The "Đóng" tag hides the product card from public listing.
 */

export interface TagStyle {
  bgColor: string
  textColor: string
  borderColor: string
  gradient?: string
  icon?: string
  hidden?: boolean
}

export const TAG_CONFIG: Record<string, TagStyle> = {
  'Ổn định':       { bgColor: '#22c55e', textColor: '#fff', borderColor: '#16a34a', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', icon: '🛡️' },
  'Nhanh':         { bgColor: '#10b981', textColor: '#fff', borderColor: '#059669', gradient: 'linear-gradient(135deg, #10b981, #059669)', icon: '⚡' },
  'Best Seller':   { bgColor: '#f59e0b', textColor: '#fff', borderColor: '#d97706', gradient: 'linear-gradient(135deg, #f59e0b, #e67e22)', icon: '🏆' },
  'Hot':           { bgColor: '#ef4444', textColor: '#fff', borderColor: '#dc2626', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔥' },
  'Phổ biến':      { bgColor: '#f97316', textColor: '#fff', borderColor: '#ea580c', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '🔥' },
  'Chậm':          { bgColor: '#eab308', textColor: '#fff', borderColor: '#ca8a04', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', icon: '⏳' },
  'Không ổn định': { bgColor: '#f97316', textColor: '#fff', borderColor: '#ea580c', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⚠️' },
  'Bảo trì':       { bgColor: '#ef4444', textColor: '#fff', borderColor: '#dc2626', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔧' },
  'Đóng':          { bgColor: '#94a3b8', textColor: '#fff', borderColor: '#64748b', hidden: true },
}

const DEFAULT_STYLE: TagStyle = { bgColor: '#64748b', textColor: '#fff', borderColor: '#475569' }

export const PREDEFINED_TAGS = Object.keys(TAG_CONFIG)

export function getTagStyle(label: string): TagStyle {
  return TAG_CONFIG[label.trim()] ?? DEFAULT_STYLE
}

export function shouldHideByTag(tagString?: string | null): boolean {
  if (!tagString) return false
  
return tagString.split(',').some(t => t.trim() === 'Đóng')
}

/** Convert country code (VN, US...) to flag emoji (🇻🇳, 🇺🇸...) */
export function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('')
}

/** Country code → Vietnamese name fallback */
const COUNTRY_NAMES: Record<string, string> = {
  vn: 'Việt Nam', us: 'Mỹ', kr: 'Hàn Quốc', jp: 'Nhật Bản', sg: 'Singapore',
  th: 'Thái Lan', id: 'Indonesia', my: 'Malaysia', ph: 'Philippines', in: 'Ấn Độ',
  cn: 'Trung Quốc', tw: 'Đài Loan', hk: 'Hồng Kông', de: 'Đức', gb: 'Anh',
  fr: 'Pháp', au: 'Úc', ca: 'Canada', br: 'Brazil', ru: 'Nga', ge: 'Georgia',
}

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code.toLowerCase()] || code.toUpperCase()
}
