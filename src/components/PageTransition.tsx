'use client'

/**
 * PageTransition — wrapper đơn giản, để Next.js App Router tự handle navigation.
 * Không dùng custom pending state hay display:none — tránh xung đột với router.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
