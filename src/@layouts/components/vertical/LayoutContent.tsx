'use client'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled Component Imports
import StyledMain from '@layouts/styles/shared/StyledMain'

type LayoutContentProps = ChildrenType & {
  landingPage?: boolean // Thêm landingPage, dấu ? để nó là optional (không bắt buộc)
}

const LayoutContent = ({ children, landingPage = false }: LayoutContentProps) => {
  // Hooks
  const { settings } = useSettings()

  // Vars
  const contentCompact = settings.contentWidth === 'compact'
  const contentWide = settings.contentWidth === 'wide'

  return (
    <StyledMain
      isContentCompact={contentCompact}
      className={classnames(verticalLayoutClasses.content, 'flex-auto', {
        [`${verticalLayoutClasses.contentCompact} is-full`]: contentCompact,
        [verticalLayoutClasses.contentWide]: contentWide,
        'landing-page': landingPage // Nếu landingPage là true, thêm class 'landing-page'
      })}
    >
      {children}
    </StyledMain>
  )
}

export default LayoutContent
