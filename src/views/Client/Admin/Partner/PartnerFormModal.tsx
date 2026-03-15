'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import { Plus, Trash2 } from 'lucide-react'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { useCreatePartner, useUpdatePartner } from '@/hooks/apis/usePartners'

interface PartnerFormModalProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  partnerData?: any
}

export default function PartnerFormModal({ open, onClose, type, partnerData }: PartnerFormModalProps) {
  const createMutation = useCreatePartner()
  const updateMutation = useUpdatePartner(partnerData?.id)

  const [descriptions, setDescriptions] = useState<string[]>([''])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      subtitle: '',
      link: '',
      order: '0',
      status: 'active'
    }
  })

  useEffect(() => {
    if (open && type === 'edit' && partnerData) {
      reset({
        name: partnerData.name || '',
        subtitle: partnerData.subtitle || '',
        link: partnerData.link || '',
        order: String(partnerData.order ?? 0),
        status: partnerData.status || 'active'
      })
      setDescriptions(partnerData.description?.length ? partnerData.description : [''])
      setLogoFile(null)
      setLogoPreview(null)
    } else if (open && type === 'create') {
      reset({ name: '', subtitle: '', link: '', order: '0', status: 'active' })
      setDescriptions([''])
      setLogoFile(null)
      setLogoPreview(null)
    }
  }, [open, type, partnerData, reset])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setLogoFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setLogoPreview(null)
    }
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('subtitle', data.subtitle || '')
    if (data.link) formData.append('link', data.link)
    formData.append('order', data.order || '0')
    formData.append('status', data.status)

    const filteredDescs = descriptions.filter(d => d.trim())
    filteredDescs.forEach((desc, i) => {
      formData.append(`description[${i}]`, desc)
    })

    if (logoFile) {
      formData.append('logo', logoFile)
    }

    const mutation = type === 'create' ? createMutation : updateMutation

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success(type === 'create' ? 'Thêm đối tác thành công!' : 'Cập nhật đối tác thành công!')
        onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>
        <Typography variant='h5' component='span'>
          {type === 'create' ? 'Thêm đối tác mới' : 'Cập nhật đối tác'}
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
                rules={{ required: 'Tên đối tác là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Tên đối tác'
                    placeholder='VD: Viettel Telecom'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='subtitle'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tiêu đề phụ'
                    placeholder='VD: Tập đoàn Công nghiệp - Viễn thông Quân đội'
                  />
                )}
              />
            </Grid2>

            {/* Descriptions - dynamic list */}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>Mô tả</Typography>
              {descriptions.map((desc, index) => (
                <div key={index} className='flex gap-2 mb-2'>
                  <CustomTextField
                    fullWidth
                    value={desc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newDescs = [...descriptions]
                      newDescs[index] = e.target.value
                      setDescriptions(newDescs)
                    }}
                    placeholder={`Dòng mô tả ${index + 1}`}
                  />
                  {descriptions.length > 1 && (
                    <IconButton size='small' color='error' onClick={() => setDescriptions(descriptions.filter((_, i) => i !== index))}>
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </div>
              ))}
              <Button size='small' startIcon={<Plus size={14} />} onClick={() => setDescriptions([...descriptions, ''])}>
                Thêm dòng
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='link'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth label='Link website' placeholder='https://...' />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label='Trạng thái'>
                    <MenuItem value='active'>ACTIVE</MenuItem>
                    <MenuItem value='inactive'>INACTIVE</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <Controller
                name='order'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth type='number' label='Thứ tự' />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>Logo</Typography>
              <input type='file' accept='image/*' onChange={handleLogoChange} />
              <div className='mt-2 flex items-center gap-4'>
                {/* Preview ảnh mới chọn */}
                {logoPreview && (
                  <div>
                    <Typography variant='caption' color='textSecondary'>Ảnh mới:</Typography>
                    <img src={logoPreview} alt='Preview' style={{ maxHeight: 60, objectFit: 'contain', display: 'block', marginTop: 4 }} />
                  </div>
                )}
                {/* Ảnh hiện tại (chỉ hiện khi edit và chưa chọn ảnh mới) */}
                {partnerData?.logo_url && !logoPreview && (
                  <div>
                    <Typography variant='caption' color='textSecondary'>Ảnh hiện tại:</Typography>
                    <img src={partnerData.logo_url} alt='Current logo' style={{ maxHeight: 60, objectFit: 'contain', display: 'block', marginTop: 4 }} />
                  </div>
                )}
              </div>
            </Grid2>
          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={createMutation.isPending || updateMutation.isPending}>
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
            : type === 'create' ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
