'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import { useRouter } from 'next/navigation'

// Next Imports

// MUI Imports
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Hook Imports
import { signOut, useSession } from 'next-auth/react'

import Box from '@mui/material/Box'

import { useSettings } from '@core/hooks/useSettings'

import ConfirmDialog from '@components/confirm-modal/ConfirmDialog'

import { maskEmail } from '@/utils/maskEmail'

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Fallback to useSession nếu không có session từ props (backward compatibility)
  const session = useSession()

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleConfirmLogout = async () => {
    console.log('Hành động XÓA đã được xác nhận!')
    setOpenConfirm(false)
    await signOut({ redirect: false })
    router.replace('/overview')
    window.location.reload()
  }

  return (
    <>
      <Box sx={{ cursor: 'pointer' }} onClick={handleDropdownOpen}>
        <Badge
          ref={anchorRef}
          overlap='circular'
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          className='mis-2'
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar
              ref={anchorRef}
              alt='John Doe'
              src='/images/avatars/1.png'
              className='cursor-pointer bs-[24px] is-[24px]'
            />
            <Typography
              sx={{
                fontWeight: '500',
                display: {
                  xs: 'none',
                  lg: 'block'
                }
              }}
            >
              {session?.data?.user?.email ? maskEmail(session?.data?.user?.email) : 'NoData'}
            </Typography>
          </Box>
        </Badge>
        <Popper
          open={open}
          transition
          disablePortal
          placement='bottom-end'
          anchorEl={anchorRef.current}
          className='min-is-[240px] !mbs-3 z-[1]'
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
              }}
            >
              <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
                <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                  <MenuList>
                    <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                      <Avatar alt='John Doe' src='/images/avatars/1.png' />
                      <div className='flex items-start flex-col'>
                        <Typography className='font-medium' color='text.primary'>
                          {session?.data?.user?.name}
                        </Typography>
                        <Typography variant='caption'>{session?.data?.user?.email}</Typography>
                      </div>
                    </div>
                    <Divider className='mlb-1' />
                    <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='tabler-user' />
                      <Typography color='text.primary'>My Profile</Typography>
                    </MenuItem>
                    <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='tabler-settings' />
                      <Typography color='text.primary'>Settings</Typography>
                    </MenuItem>
                    <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='tabler-currency-dollar' />
                      <Typography color='text.primary'>Pricing</Typography>
                    </MenuItem>
                    <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e)}>
                      <i className='tabler-help-circle' />
                      <Typography color='text.primary'>FAQ</Typography>
                    </MenuItem>
                    <div className='flex items-center plb-2 pli-3'>
                      <Button
                        fullWidth
                        variant='contained'
                        color='error'
                        size='small'
                        endIcon={<i className='tabler-logout' />}
                        onClick={() => setOpenConfirm(true)}
                        sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                      >
                        Logout
                      </Button>
                    </div>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmLogout}
        title='Xác nhận đăng xuất' // <-- THAY ĐỔI Ở ĐÂY
        confirmText='Đăng xuất'
        cancelText='Hủy bỏ'
      >
        Bạn có chắc chắn muốn kết thúc phiên làm việc và đăng xuất khỏi tài khoản này không?
      </ConfirmDialog>
    </>
  )
}

export default UserDropdown
