import { useMediaQuery } from '@mui/material'

import breakpoints from '@/configs/breakpoints'

export function useResponsive() {
  const isMobile = useMediaQuery(`(max-width:${breakpoints.sm - 1}px)`)
  const isTablet = useMediaQuery(`(min-width:${breakpoints.sm}px) and (max-width:${breakpoints.md - 1}px)`)
  const isDesktop = useMediaQuery(`(min-width:${breakpoints.md}px)`)

  return { isMobile, isTablet, isDesktop }
}
