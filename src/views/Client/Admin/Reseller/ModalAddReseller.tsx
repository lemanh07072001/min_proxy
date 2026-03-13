'use client'

import { useEffect, useState, useMemo } from 'react'

import { useForm, Controller } from 'react-hook-form'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid2 from '@mui/material/Grid2'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { useCreateReseller, useUpdateReseller } from '@/hooks/apis/useAdminResellers'
import { useAdminUsers } from '@/hooks/apis/useAdminUsers'

interface ModalAddResellerProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  resellerData?: any
}

export default function ModalAddReseller({ open, onClose, type, resellerData }: ModalAddResellerProps) {
  const [userMode, setUserMode] = useState<'new' | 'existing'>('new')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userSearchInput, setUserSearchInput] = useState('')

  const createMutation = useCreateReseller()
  const updateMutation = useUpdateReseller()

  // Fetch danh sách user khi chọn mode "User có sẵn"
  const { data: usersResponse, isLoading: usersLoading } = useAdminUsers({
    page: 1,
    per_page: 500,
    search: userSearchInput || undefined
  })

  // Lọc bỏ user đã là reseller (role=2) và admin (role=0)
  const availableUsers = useMemo(() => {
    const allUsers = usersResponse?.data ?? []

    return allUsers.filter((u: any) => {
      const role = u.role ?? u.attributes?.role
      // role accessor trả string, raw trả number — check cả 2
      return role !== 2 && role !== 'reseller' && role !== 0 && role !== 'admin'
    })
  }, [usersResponse])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      user_id: '',
      name: '',
      email: '',
      password: '',
      domain: '',
      company_name: '',
      default_markup_percent: '15',
      allowed_ips: '',
      note: ''
    }
  })

  useEffect(() => {
    if (open && type === 'edit' && resellerData) {
      const profile = resellerData.reseller_profile

      reset({
        user_id: '',
        name: resellerData.name || '',
        email: resellerData.email || '',
        password: '',
        domain: profile?.domain || '',
        company_name: profile?.company_name || '',
        default_markup_percent: String(profile?.default_markup_percent ?? '15'),
        allowed_ips: profile?.allowed_ips?.join(', ') || '',
        note: profile?.note || ''
      })
    } else if (open && type === 'create') {
      setUserMode('new')
      setSelectedUser(null)
      setUserSearchInput('')

      reset({
        user_id: '',
        name: '',
        email: '',
        password: '',
        domain: '',
        company_name: '',
        default_markup_percent: '15',
        allowed_ips: '',
        note: ''
      })
    }
  }, [open, type, resellerData, reset])

  const onSubmit = (data: any) => {
    const payload: any = {
      domain: data.domain || null,
      company_name: data.company_name || null,
      default_markup_percent: Number(data.default_markup_percent) || 15,
      allowed_ips: data.allowed_ips
        ? data.allowed_ips.split(',').map((ip: string) => ip.trim()).filter(Boolean)
        : null,
      note: data.note || null
    }

    if (type === 'create') {
      if (userMode === 'existing') {
        if (!selectedUser) {
          toast.error('Vui lòng chọn user')

          return
        }

        payload.user_id = selectedUser.id
      } else {
        payload.name = data.name
        payload.email = data.email
        if (data.password) payload.password = data.password
      }

      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Tạo reseller thành công!')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo reseller')
        }
      })
    } else {
      updateMutation.mutate(
        { userId: resellerData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật reseller thành công!')
            onClose()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật')
          }
        }
      )
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

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
          {type === 'create' ? 'Thêm Reseller' : 'Cập nhật Reseller'}
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {type === 'create' && (
            <>
              <Typography variant='body2' sx={{ mb: 1, mt: 1 }}>
                Nguồn user
              </Typography>
              <ToggleButtonGroup
                value={userMode}
                exclusive
                onChange={(_, val) => {
                  if (val) {
                    setUserMode(val)
                    setSelectedUser(null)
                  }
                }}
                size='small'
                sx={{ mb: 2 }}
              >
                <ToggleButton value='new'>Tạo user mới</ToggleButton>
                <ToggleButton value='existing'>User có sẵn</ToggleButton>
              </ToggleButtonGroup>
            </>
          )}

          <Grid2 container spacing={3}>
            {/* Chọn user có sẵn - Autocomplete search */}
            {type === 'create' && userMode === 'existing' && (
              <Grid2 size={{ xs: 12 }}>
                <Autocomplete
                  value={selectedUser}
                  onChange={(_, newValue) => setSelectedUser(newValue)}
                  inputValue={userSearchInput}
                  onInputChange={(_, newInput) => setUserSearchInput(newInput)}
                  options={availableUsers}
                  loading={usersLoading}
                  getOptionLabel={(option: any) => `${option.name} (${option.email})`}
                  getOptionKey={(option: any) => option.id}
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option.id}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{option.name}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {option.email} — ID: {option.id} — Số dư: {new Intl.NumberFormat('vi-VN').format(option.sodu ?? 0)}đ
                        </div>
                      </div>
                    </li>
                  )}
                  noOptionsText='Không tìm thấy user'
                  loadingText='Đang tải...'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Chọn user *'
                      placeholder='Tìm theo tên hoặc email...'
                      error={!selectedUser && !!errors.user_id}
                      helperText='Chỉ hiển thị user thường (không phải admin/reseller)'
                    />
                  )}
                />
              </Grid2>
            )}

            {/* Tạo user mới */}
            {type === 'create' && userMode === 'new' && (
              <>
                <Grid2 size={{ xs: 12, sm: 6 }}>
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
                <Grid2 size={{ xs: 12, sm: 6 }}>
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
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Mật khẩu'
                        placeholder='Để trống = changeme123'
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid2>
              </>
            )}

            {/* Profile fields - always show */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='company_name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tên công ty'
                    placeholder='Nhập tên công ty'
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='domain'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Domain'
                    placeholder='site-con.com'
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='default_markup_percent'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Markup mặc định (%)'
                    placeholder='15'
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='allowed_ips'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='IP cho phép'
                    placeholder='1.2.3.4, 5.6.7.8 (để trống = cho phép tất cả)'
                    helperText='Danh sách IP cách nhau bằng dấu phẩy. Để trống nếu không giới hạn.'
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='note'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Ghi chú'
                    placeholder='Ghi chú nội bộ...'
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid2>
          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={isPending}
          sx={{ color: '#fff' }}
        >
          {isPending ? 'Đang xử lý...' : type === 'create' ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
