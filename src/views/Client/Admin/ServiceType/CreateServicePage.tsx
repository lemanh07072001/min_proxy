'use client'

import { useState } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Card, CardContent, CardHeader, Grid, TextField, MenuItem, Button, Typography } from '@mui/material'

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
    ip_version: ''
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
              <CustomTextField fullWidth type='number' label='Giá đối tốc' placeholder='Placeholder' />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Giá bán'
                type='number'
                value={formData.price}
                onChange={e => handleChange('price', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label='Trạng thái'
                value={formData.status}
                onChange={e => handleChange('status', e.target.value)}
              >
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Partner ID'
                type='number'
                value={formData.partner_id}
                onChange={e => handleChange('partner_id', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Type'
                value={formData.type}
                onChange={e => handleChange('type', e.target.value)}
                placeholder='VD: ROTATING, STATIC'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='IP Version'
                value={formData.ip_version}
                onChange={e => handleChange('ip_version', e.target.value)}
                placeholder='VD: IPv4, IPv6'
              />
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
