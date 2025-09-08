'use client'

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import Image from 'next/image'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Flags
import flagEn from '@/../public/images/flags/united-states-of-america.png'
import flagCh from '@/../public/images/flags/china.png'
import flagVi from '@/../public/images/flags/vietnam.png'

type LanguageDataType = {
  langCode: Locale
  langName: string
  flag: any
}

const getLocalePath = (pathName: string, locale: string) => {
  if (!pathName) return '/'
  const segments = pathName.split('/')

  segments[1] = locale

  return segments.join('/')
}

// Vars
const languageData: LanguageDataType[] = [
  {
    langCode: 'en',
    langName: 'English',
    flag: flagEn
  },
  {
    langCode: 'cn',
    langName: 'Chinna',
    flag: flagCh
  },
  {
    langCode: 'vi',
    langName: 'Tiếng việt',
    flag: flagVi
  }
]

const LanguageDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const pathName = usePathname()
  const { settings } = useSettings()
  const { lang } = useParams()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const currentLanguage = languageData.find(locale => locale.langCode === lang)

  console.log(currentLanguage.langName)

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          borderRadius: '5px',
          '&:hover': {
            borderRadius: '5px'
          }
        }}
      >
        <div className='flex items-center gap-2'>
          {/* Phần hiển thị cờ hoặc icon ngôn ngữ */}
          {currentLanguage ? (
            <>
              <Image
                src={currentLanguage.flag}
                alt={currentLanguage.langName}
                width={22}
                height={22}
                className='rounded-full'
              />
              <span className='text-sm font-semibold'>{currentLanguage.langName}</span>
            </>
          ) : (
            <i className='tabler-language' />
          )}

          {/* Icon mũi tên thay đổi theo state 'open' */}
          <i style={{ fontSize: '16px' }} className={open ? 'tabler-chevron-up' : 'tabler-chevron-down'} />
        </div>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  {languageData.map(locale => (
                    <MenuItem
                      key={locale.langCode}
                      component={Link}
                      href={getLocalePath(pathName, locale.langCode)}
                      onClick={handleClose}
                      selected={lang === locale.langCode}
                    >
                      <div>
                        <Image className='me-2' src={locale.flag} width={20} height={20} alt='Picture of the author' />
                        {locale.langName}
                      </div>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default LanguageDropdown
