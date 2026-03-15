'use client'

import { useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'

import { useCreateProvider, useUpdateProvider } from '@/hooks/apis/useProviders'

interface ModalAddProviderProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  providerData?: any
}

export default function ModalAddProvider({ open, onClose, type, providerData }: ModalAddProviderProps) {
  const createMutation = useCreateProvider()
  const updateMutation = useUpdateProvider(providerData?.id)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      token_api: '',
      provider_code: '',
      order: '',
      status: 'active'
    }
  })

  useEffect(() => {
    if (open && type === 'edit' && providerData) {
      console.log('Provider data for edit:', providerData)
      reset({
        title: providerData.title || providerData.name || '',
        token_api: providerData.token_api || providerData.token || providerData.api_token || '',
        provider_code: providerData.provider_code || providerData.code || providerData.providerCode || '',
        order: providerData.order || providerData.order_number || '',
        status: providerData.status || 'active'
      })
    } else if (open && type === 'create') {
      reset({
        title: '',
        token_api: '',
        provider_code: '',
        order: '',
        status: 'active'
      })
    }
  }, [open, type, providerData, reset])

  const onSubmit = (data: any) => {
    if (type === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Thêm nhà cung cấp thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm nhà cung cấp')
        }
      })
    } else {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Cập nhật nhà cung cấp thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhà cung cấp')
        }
      })
    }
  }

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth={true}
      maxWidth='md'
    >
      <DialogTitle id='customized-dialog-title'>
        <Typography variant='h5' component='span'>
          {type === 'create' ? 'Thêm mới nhà cung cấp' : 'Cập nhật nhà cung cấp'}
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
                name='title'
                control={control}
                rules={{ required: 'Tên nhà cung cấp là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Tên nhà cung cấp'
                    placeholder='Nhập tên nhà cung cấp'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='status'
                control={control}
                rules={{ required: 'Trạng thái là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    select
                    label='Trạng thái'
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    slotProps={{
                      select: { displayEmpty: true },
                      htmlInput: { 'aria-label': 'Without label' }
                    }}
                  >
                    <MenuItem value='active'>ACTIVE</MenuItem>
                    <MenuItem value='inactive'>INACTIVE</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='token_api'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Token API'
                    placeholder='Nhập token API'
                    error={!!errors.token_api}
                    helperText={errors.token_api?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='provider_code'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Provider Code'
                    placeholder='Nhập provider code'
                    error={!!errors.provider_code}
                    helperText={errors.provider_code?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='order'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Order'
                    placeholder='Nhập thứ tự'
                    error={!!errors.order}
                    helperText={errors.order?.message}
                  />
                )}
              />
            </Grid2>
          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant='tonal'
          color='secondary'
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={createMutation.isPending || updateMutation.isPending}
          sx={{ color: '#fff' }}
        >
          {createMutation.isPending || updateMutation.isPending
            ? 'Đang xử lý...'
            : type === 'create'
              ? 'Thêm mới'
              : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
