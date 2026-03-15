'use client'

import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import { useAdjustBalance } from '@/hooks/apis/useAdminUsers'

interface ModalBalanceAdjustProps {
  open: boolean
  onClose: () => void
  userData?: any
}

const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

export default function ModalBalanceAdjust({ open, onClose, userData }: ModalBalanceAdjustProps) {
  const [type, setType] = useState<'add' | 'subtract'>('add')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const adjustMutation = useAdjustBalance()

  useEffect(() => {
    if (open) {
      setType('add')
      setAmount('')
      setDescription('')
    }
  }, [open])

  const handleSubmit = () => {
    if (!userData?.id) return

    const numAmount = Number(amount)

    if (!numAmount || numAmount <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ')
      
return
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập lý do')
      
return
    }

    const finalAmount = type === 'subtract' ? -numAmount : numAmount

    adjustMutation.mutate(
      { userId: userData.id, amount: finalAmount, description: description.trim() },
      {
        onSuccess: (data) => {
          const newBalance = data?.new_balance

          toast.success(
            `${type === 'add' ? 'Cộng' : 'Trừ'} ${new Intl.NumberFormat('vi-VN').format(numAmount)}đ thành công. Số dư mới: ${new Intl.NumberFormat('vi-VN').format(newBalance ?? 0)}đ`
          )
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Typography variant='h5' component='span'>
          Điều chỉnh số dư
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <Typography variant='body2' color='text.secondary'>
            User: <strong>{userData?.name}</strong> ({userData?.email})
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Số dư hiện tại: <strong style={{ color: '#059669' }}>{formatVND(userData?.sodu ?? 0)}</strong>
          </Typography>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Typography variant='body2' sx={{ mb: 1 }}>
            Loại thao tác
          </Typography>
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={(_, val) => val && setType(val)}
            size='small'
            fullWidth
          >
            <ToggleButton value='add' color='success'>
              Cộng tiền
            </ToggleButton>
            <ToggleButton value='subtract' color='error'>
              Trừ tiền
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <TextField
          fullWidth
          label='Số tiền'
          type='text'
          value={amount}
          onChange={e => {
            const value = e.target.value.replace(/[^0-9]/g, '')

            setAmount(value)
          }}
          InputProps={{
            endAdornment: <span style={{ marginLeft: 8 }}>đ</span>
          }}
          helperText={amount ? `Số tiền: ${new Intl.NumberFormat('vi-VN').format(Number(amount))} đ` : ''}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label='Lý do'
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder='Nhập lý do cộng/trừ tiền...'
          required
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={adjustMutation.isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color={type === 'add' ? 'success' : 'error'}
          disabled={adjustMutation.isPending || !amount || !description.trim()}
          sx={{ color: '#fff' }}
        >
          {adjustMutation.isPending
            ? 'Đang xử lý...'
            : type === 'add'
              ? 'Cộng tiền'
              : 'Trừ tiền'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
