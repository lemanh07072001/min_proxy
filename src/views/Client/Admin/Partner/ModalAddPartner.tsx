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

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'

import { useCreatePartner, useUpdatePartner } from '@/hooks/apis/usePartners'
import { toast } from 'react-toastify'

interface ModalAddPartnerProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  partnerData?: any
}

export default function ModalAddPartner({ open, onClose, type, partnerData }: ModalAddPartnerProps) {
  const createMutation = useCreatePartner()
  const updateMutation = useUpdatePartner(partnerData?.id)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      token_api: '',
      partner_code: '',
      order: '',
      status: 'active'
    }
  })

  useEffect(() => {
    if (open && type === 'edit' && partnerData) {
      console.log('Partner data for edit:', partnerData)
      reset({
        title: partnerData.title || partnerData.name || '',
        token_api: partnerData.token_api || partnerData.token || partnerData.api_token || '',
        partner_code: partnerData.partner_code || partnerData.code || partnerData.partnerCode || '',
        order: partnerData.order || partnerData.order_number || '',
        status: partnerData.status || 'active'
      })
    } else if (open && type === 'create') {
      reset({
        title: '',
        token_api: '',
        partner_code: '',
        order: '',
        status: 'active'
      })
    }
  }, [open, type, partnerData, reset])

  const onSubmit = (data: any) => {
    if (type === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Thêm đối tác thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm đối tác')
        }
      })
    } else {
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Cập nhật đối tác thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đối tác')
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
          {type === 'create' ? 'Thêm mới đối tác' : 'Cập nhật đối tác'}
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
                rules={{ required: 'Tên đối tác là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Tên đối tác'
                    placeholder='Nhập tên đối tác'
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
                name='partner_code'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Partner Code'
                    placeholder='Nhập partner code'
                    error={!!errors.partner_code}
                    helperText={errors.partner_code?.message}
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
