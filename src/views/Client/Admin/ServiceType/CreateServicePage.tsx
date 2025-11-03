'use client'

import { useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControlLabel,
  Switch
} from '@mui/material'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { ArrowLeft } from 'lucide-react'

import useAxiosAuth from '@/hocs/useAxiosAuth'
import CustomTextField from '@/@core/components/mui/TextField'

export default function CreateServicePage() {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const axiosAuth = useAxiosAuth()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    cost_price: '',
    price: '',
    status: 'active',
    partner_id: '',
    type: '',
    ip_version: '',
    api_type: 'buy_api'
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.post('/create-service-type', data)

      return res.data
    },
    onSuccess: () => {
      toast.success('Thêm dịch vụ thành công!')
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      router.push(`/${locale}/admin/service-type`)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    }
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.cost_price || !formData.price) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')

      return
    }

    createMutation.mutate(formData)
  }

  return (
    <Card className='orders-content'>
      <CardHeader
        title={
          <div className='flex items-center gap-3'>
            <Button
              variant='outlined'
              size='small'
              startIcon={<ArrowLeft size={16} />}
              onClick={() => router.push(`/${locale}/admin/service-type`)}
            >
              Quay lại
            </Button>
            <Typography variant='h5'>Thêm dịch vụ mới</Typography>
          </div>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth label='Tên dịch vụ' placeholder='Placeholder' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth label='Api Partner' placeholder='Placeholder' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth type='number' label='Giá nhập' placeholder='Placeholder' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField fullWidth type='number' label='Giá bán' placeholder='Placeholder' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                value={formData.api_type}
                onChange={e => handleChange('api_type', e.target.value)}
                id='select-type-api'
                label='Loại Api'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={'get_api'}>Get Api</MenuItem>
                <MenuItem value={'buy_api'}>Buy Api</MenuItem>
                <MenuItem value={'extend_api'}>Gia hạn Api</MenuItem>
                <MenuItem value={'change_security_api'}>Bảo mật Api</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                id='select-time'
                label='Thời gian hiện thị'
                defaultValue='1'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={1}>Ngày</MenuItem>
                <MenuItem value={7}>Tuần</MenuItem>
                <MenuItem value={30}>Tháng</MenuItem>
                <MenuItem value={90}>3 Tháng</MenuItem>
                <MenuItem value={180}>6 Tháng</MenuItem>
                <MenuItem value={360}>1 Năm</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                id='select-type'
                label='Type'
                defaultValue='0'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={0}>STATIC</MenuItem>
                <MenuItem value={1}>ROTATING</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                id='select-status'
                label='Trạng thái'
                defaultValue='active'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={'active'}>ACTIVE</MenuItem>
                <MenuItem value={'inactive'}>INACTIVE</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                id='select-proxy_type'
                label='Proxy Type'
                defaultValue='residential'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={'residential'}>Dân cư</MenuItem>
                <MenuItem value={'datacenter'}>Datacenter</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                select
                id='select-proxy_type'
                label='Ip Version'
                defaultValue='ipv4'
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Without label' }
                }}
              >
                <MenuItem value={'ipv4'}>V4</MenuItem>
                <MenuItem value={'ipv6'}>V6</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField rows={6} fullWidth multiline label='Body Api' id='textarea-outlined-static' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    select
                    id='select-partner'
                    label='Đối tác'
                    slotProps={{
                      select: { displayEmpty: true },
                      htmlInput: { 'aria-label': 'Without label' }
                    }}
                  >
                    <MenuItem value={'residential'}>Dân cư</MenuItem>
                    <MenuItem value={'datacenter'}>Datacenter</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel control={<Switch />} label='Hiện thị thời gian' />
                  <FormControlLabel control={<Switch />} label='Hiện thị user/pass' />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className='flex gap-3 justify-end'>
                <Button variant='outlined' onClick={() => router.push(`/${locale}/admin/service-type`)}>
                  Hủy
                </Button>
                <Button type='submit' variant='contained' disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Đang xử lý...' : 'Thêm mới'}
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
