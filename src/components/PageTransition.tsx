'use client'

/**
 * PageTransition — pass-through wrapper.
 * Không thêm DOM node → không gây hydration mismatch.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
