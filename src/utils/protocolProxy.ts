export const protocols = [
  { id: 'http', name: 'HTTP', description: 'HTTP Protocol' },
  { id: 'socks5', name: 'SOCKS5', description: 'SOCKS5 Protocol' }
]

/**
 * Lấy chuỗi proxy chính từ proxy object.
 * Format mới: { value, protocol, ip, port, ... }
 * Format cũ:  { http, socks5, loaiproxy, ip, port, ... }
 */
export function extractProxyValue(proxys: any): string {
  if (!proxys || typeof proxys !== 'object') return ''

  // Format mới
  if (proxys.value) return String(proxys.value)

  // Format cũ — lấy http hoặc socks5
  const val = proxys.http ?? proxys.HTTP ?? proxys.socks5 ?? proxys.SOCKS5
  if (val) return String(val)

  // Fallback: first non-metadata value
  const skip = new Set(['loaiproxy', 'protocol', 'ip', 'port', 'user', 'pass', 'username', 'password'])
  for (const [key, v] of Object.entries(proxys)) {
    if (!skip.has(key) && typeof v === 'string' && v) return v
  }

  return ''
}

/**
 * Lấy protocol từ proxy object.
 * Format mới: proxys.protocol
 * Format cũ:  proxys.loaiproxy hoặc suy từ keys
 */
export function extractProtocol(proxys: any): string {
  if (!proxys || typeof proxys !== 'object') return ''

  // Format mới
  if (proxys.protocol) return String(proxys.protocol).toUpperCase()

  // Format cũ
  if (proxys.loaiproxy) return String(proxys.loaiproxy).toUpperCase()

  // Fallback: first key (http/socks5/HTTP/SOCKS5)
  const firstKey = Object.keys(proxys)[0]
  return firstKey?.toUpperCase() || ''
}

/**
 * Lấy chuỗi proxy cho export — ưu tiên theo protocol được chọn.
 */
export function getProxyString(item: any, protocol?: 'http' | 'socks5'): string {
  const p = item.proxy || item.proxys
  if (!p || typeof p !== 'object') return item.key || item.api_key || ''

  // Format mới
  if (p.value) return String(p.value)

  // Format cũ
  if (protocol === 'socks5') return p.socks5 || p.SOCKS5 || p.http || p.HTTP || ''
  return p.http || p.HTTP || p.socks5 || p.SOCKS5 || ''
}
