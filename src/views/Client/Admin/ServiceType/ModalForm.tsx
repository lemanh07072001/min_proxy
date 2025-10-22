'use client'

import { useState, useEffect } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

interface ModalFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  mode?: string
}

export default function ModalForm({ open, onClose, mode, onSubmit }: ModalFormProps) {
  const handleSubmit = () => {
    onSubmit({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSubmit}>
          {mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
