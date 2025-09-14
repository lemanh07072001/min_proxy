import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'

interface ResetModalProps {
  open: boolean
  onClose: () => void
}

export default function ResetModal({ open, onClose }: ResetModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      closeAfterTransition={false}
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Nhập email để nhận liên kết đặt lại mật khẩu.
        </DialogContentText>
        {/* Nội dung form reset password của bạn đặt ở đây */}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
