'use client'

// Next Imports
import Link from 'next/link'

import { Home, Compass, MapPin, Cloud } from 'lucide-react'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Styled Components
const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const NotFound = ({ mode }: { mode: SystemMode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='error-page'>
      <div className='stars'>
        <div className='star star-1'></div>
        <div className='star star-2'></div>
        <div className='star star-3'></div>
        <div className='star star-4'></div>
        <div className='star star-5'></div>
      </div>

      <div className='cloud cloud-1'>
        <div className='cloud-part'></div>
        <div className='cloud-part'></div>
        <div className='cloud-part'></div>
      </div>
      <div className='cloud cloud-2'>
        <div className='cloud-part'></div>
        <div className='cloud-part'></div>
        <div className='cloud-part'></div>
      </div>

      <div className='content'>
        <div className='error-number'>
          <div className='glow-effect'></div>
          <span className='number'>4</span>
          <div className='compass-wrapper'>
            <svg className='compass' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
              <circle cx='12' cy='12' r='10'></circle>
              <polygon points='16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76'></polygon>
            </svg>
            <svg className='map-pin' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
              <circle cx='12' cy='10' r='3'></circle>
            </svg>
          </div>
          <span className='number'>4</span>
        </div>

        <div className='error-code'>
          <div className='pulse-dot'></div>
          <span>ERROR_CODE: 404_NOT_FOUND</span>
        </div>
      </div>
    </div>
  )
}

export default NotFound
