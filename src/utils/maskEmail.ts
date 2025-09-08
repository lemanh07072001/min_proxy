function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '' // hoặc return email nguyên gốc

  const [localPart, domain] = email.split('@')

  if (localPart.length <= 2) {
    return '*'.repeat(localPart.length) + '@' + domain
  }

  const firstChar = localPart[0]
  const lastChar = localPart[localPart.length - 1]
  const masked = '*'.repeat(localPart.length - 2)

  return `${firstChar}${masked}${lastChar}@${domain}`
}
