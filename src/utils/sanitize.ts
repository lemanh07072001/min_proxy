let _DOMPurify: any = null

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html

  if (!_DOMPurify) {
    _DOMPurify = require('dompurify')
  }

  return _DOMPurify.sanitize(html)
}
