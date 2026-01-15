'use client'

import { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

const STORAGE_KEY = 'globalNoticeSuppressUntil'
const TWO_HOURS_MS = 2 * 60 * 60 * 1000

export default function GlobalNoticeModal() {
  const [open, setOpen] = useState(false)
  const [dontShow, setDontShow] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      const suppressUntil = raw ? Number(raw) : 0
      const now = Date.now()

      setOpen(!(suppressUntil && suppressUntil > now))
    } catch {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    try {
      if (dontShow) {
        const until = Date.now() + TWO_HOURS_MS

        localStorage.setItem(STORAGE_KEY, String(until))
      }
    } catch {}

    setOpen(false)
  }

  if (!open) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Typography variant='h6'>Thông báo</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body2'>
          Đây là thông báo toàn hệ thống. Bạn có thể tắt hiển thị trong 2 giờ tiếp theo.
        </Typography>
        <FormControlLabel
          sx={{ mt: 2 }}
          control={<Checkbox checked={dontShow} onChange={e => setDontShow(e.target.checked)} />}
          label='Không hiện lại trong 2 giờ'
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={handleClose}>Đã hiểu</Button>
      </DialogActions>
    </Dialog>
  )
}


