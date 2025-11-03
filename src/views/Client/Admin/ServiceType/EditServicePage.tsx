'use client'

import { useState, useEffect } from 'react'

import { useRouter, useParams } from 'next/navigation'

import { Card, CardContent, CardHeader, Grid, TextField, MenuItem, Button, Typography } from '@mui/material'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toast } from 'react-toastify'

import { ArrowLeft } from 'lucide-react'

import useAxiosAuth from '@/hocs/useAxiosAuth'

interface EditServicePageProps {
  serviceId: string
}

export default function EditServicePage({ serviceId }: EditServicePageProps) {
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

  // Fetch service data
  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service-type', serviceId],
    queryFn: async () => {
      const res = await axiosAuth.get(`/get-service-type/${serviceId}`)

      return res.data.data
    },
    enabled: !!serviceId
  })

  // Load data vào form khi fetch xong
  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || '',
        cost_price: serviceData.cost_price || '',
        price: serviceData.price || '',
        status: serviceData.status || 'active',
        partner_id: serviceData.partner_id || '',
        type: serviceData.type || '',
        ip_version: serviceData.ip_version || ''
      })
    }
  }, [serviceData])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.put(`/update-service-type/${serviceId}`, data)

      return res.data
    },
    onSuccess: () => {
      toast.success('Cập nhật dịch vụ thành công!')
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      queryClient.invalidateQueries({ queryKey: ['service-type', serviceId] })
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

    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className='p-6'>
        <Card>
          <CardContent>
            <div className='flex justify-center items-center py-10'>
              <div className='loader-wrapper'>
                <div className='loader'>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <p className='loading-text'>Đang tải dữ liệu...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <Card>
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
              <Typography variant='h5'>Chỉnh sửa dịch vụ</Typography>
            </div>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Tên dịch vụ'
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Giá vốn'
                  type='number'
                  value={formData.cost_price}
                  onChange={e => handleChange('cost_price', e.target.value)}
                  required
                />
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
                  <Button type='submit' variant='contained' disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Đang xử lý...' : 'Cập nhật'}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
