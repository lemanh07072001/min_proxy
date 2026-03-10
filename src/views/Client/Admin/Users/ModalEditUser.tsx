'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid2 from '@mui/material/Grid2'

import DialogCloseButton from '@/components/modals/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { useUpdateUser } from '@/hooks/apis/useAdminUsers'
import { toast } from 'react-toastify'

interface ModalEditUserProps {
  open: boolean
  onClose: () => void
  userData?: any
}

export default function ModalEditUser({ open, onClose, userData }: ModalEditUserProps) {
  const updateMutation = useUpdateUser()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  })

  useEffect(() => {
    if (open && userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      })
    }
  }, [open, userData, reset])

  const onSubmit = (data: any) => {
    if (!userData?.id) return

    updateMutation.mutate(
      { userId: userData.id, data },
      {
        onSuccess: () => {
          toast.success('Cập nhật thông tin user thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
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
          Cập nhật thông tin user
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={3} sx={{ mt: 1 }}>
            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'Tên là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Họ tên'
                    placeholder='Nhập họ tên'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: 'Email là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Email'
                    placeholder='Nhập email'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Số điện thoại'
                    placeholder='Nhập SĐT'
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Địa chỉ'
                    placeholder='Nhập địa chỉ'
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid2>
          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={updateMutation.isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={updateMutation.isPending}
          sx={{ color: '#fff' }}
        >
          {updateMutation.isPending ? 'Đang xử lý...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
