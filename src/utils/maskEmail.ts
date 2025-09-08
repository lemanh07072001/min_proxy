export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@")

  if (localPart.length <= 2) {
    // Nếu tên local quá ngắn thì che hết
    return "*".repeat(localPart.length) + "@" + domain
  }

  const firstChar = localPart[0]
  const lastChar = localPart[localPart.length - 1]
  const masked = "*".repeat(localPart.length - 2)

  return `${firstChar}${masked}${lastChar}@${domain}`
}