'use client'

import { AlertCircle, CheckCircle, Clock, Copy, Globe, MapPin, RefreshCw, Search, Shield, XCircle } from 'lucide-react'

import './styles.css'

import React, { useState } from 'react'

import MenuItem from '@mui/material/MenuItem'

import { InputAdornment } from '@mui/material'

import { useMutation } from '@tanstack/react-query'

import axios from 'axios'

import { useTheme } from '@mui/material/styles'

import Button from '@mui/material/Button'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'

// Tạo schema validation bằng Yup
const schema = yup.object().shape({
  format_proxy: yup.string().required('Vui lòng chọn định dạng proxy'),
  protocol: yup.string().required('Vui lòng chọn giao thức'),
  list_proxy: yup.string().required('Vui lòng nhập danh sách proxy')
})

const checkProxyApi = async proxyData => {
  const { data } = await axios.post('/api/check-proxy', proxyData)

  return data
}

export default function CheckProxyForm() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState([])

  const theme = useTheme()

  const mutation = useMutation({
    mutationFn: checkProxyApi
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      format_proxy: 'host:port:username:password',
      protocol: 'http',
      list_proxy: ''
    }
  })

  // Hàm xử lý khi submit form
  const onSubmit = data => {
    const format_proxy = data.format_proxy
    const protocol = data.protocol
    const list_proxy = data.list_proxy

    mutation.mutate({
      protocol, // 'http' hoặc 'socks5'
      format_proxy,
      list_proxy
    })
  }

  console.log(mutation.data)

  const dataLocation = [
    {
      value: 'http',
      label: 'HTTP'
    },
    {
      value: 'socks5',
      label: 'SOCKS5'
    }
  ]

  const dataFormat = [
    {
      value: 'host:port:username:password',
      label: 'host:port:username:password'
    },
    {
      value: 'username:password@host:port',
      label: 'username:password@host:port'
    },
    {
      value: 'host:port@username:password',
      label: 'host:port@username:password'
    },
    {
      value: 'host:port',
      label: 'host:port'
    }
  ]

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='check-form-panel'>
        <div className='form-card'>
          <div className='form-header'>
            <h3>Kiểm tra thông tin Proxy</h3>
          </div>

          {/* Định dạng Proxy */}
          <div className='form-group-check'>
            <Controller
              name='format_proxy'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='host:port:username:password'
                  id='format_proxy'
                  error={Boolean(errors.format_proxy)}
                  helperText={errors.format_proxy?.message}
                  {...field}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Shield size={16} />
                      Định dạng Proxy
                    </span>
                  }
                  sx={{
                    // Nhắm đến thẻ label của component này
                    '& .MuiInputLabel-root': {
                      color: '#4a5568', // Đổi màu label thành màu cam
                      fontWeight: '600', // In đậm chữ
                      fontSize: '13px', // Thay đổi kích thước font
                      paddingBottom: '5px'
                    }
                  }}
                >
                  {dataFormat.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              )}
            />
          </div>

          {/* Giao thức */}
          <div className='form-group-check'>
            <Controller
              name='protocol'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='http'
                  id='locale'
                  error={Boolean(errors.protocol)}
                  helperText={errors.protocol?.message}
                  {...field}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Globe size={16} />
                      Giao thức
                    </span>
                  }
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: '#4a5568',
                      fontWeight: '600',
                      fontSize: '13px',
                      paddingBottom: '5px'
                    }
                  }}
                >
                  {dataLocation.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.label}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              )}
            />
          </div>

          {/* Danh sách proxies */}
          <div className='form-group-check'>
            <Controller
              name='list_proxy'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  rows={4}
                  multiline
                  fullWidth
                  placeholder='Nhập danh sách proxy, mỗi proxy một dòng...'
                  id='list_proxy'
                  error={Boolean(errors.list_proxy)}
                  helperText={errors.list_proxy?.message}
                  {...field}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={16} />
                      Danh sách proxy
                    </span>
                  }
                  sx={{
                    // Nhắm đến thẻ label của component này
                    '& .MuiInputLabel-root': {
                      color: '#4a5568', // Đổi màu label thành màu cam
                      fontWeight: '600', // In đậm chữ
                      fontSize: '13px', // Thay đổi kích thước font
                      paddingBottom: '5px'
                    }
                  }}
                />
              )}
            />
          </div>

          {/* Check Button */}
          <Button
            variant='contained'
            color='warning'
            type='submit'
            fullWidth
            sx={{
              background: 'var(--mui-palette-customCssVars-bgButtonPrimary)',
              padding: '16px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(252, 67, 54, 0.3)',
              marginBottom: '24px',
              width: '100%'
            }}
          >
            Kiểm tra
          </Button>

          {/* Proxy đang hoạt động */}
          <div className='form-group-check'>
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              name='proxy_success'
              id='proxy_success'
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle size={16} className='text-green-500' />
                  Proxy đang hoạt động
                </span>
              }
              sx={{
                // Nhắm đến thẻ label của component này
                '& .MuiInputLabel-root': {
                  color: '#4a5568', // Đổi màu label thành màu cam
                  fontWeight: '600', // In đậm chữ
                  fontSize: '13px', // Thay đổi kích thước font
                  paddingBottom: '5px'
                },
                '& .MuiInputBase-root': {
                  backgroundColor: `${theme.palette.customCssVars.bgSuccess200} !important`,
                  borderColor: `${theme.palette.customCssVars.borderSuccess200} !important`
                }
              }}
            />
            <button className='copy-btn'>
              <Copy size={14} />
            </button>
          </div>

          {/* Proxy ngưng hoạt động */}
          <div className='form-group-check'>
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              name='proxy_error'
              id='proxy_error'
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <XCircle size={16} className='text-red-500' />
                  Proxy ngưng hoạt động
                </span>
              }
              sx={{
                // Nhắm đến thẻ label của component này
                '& .MuiInputLabel-root': {
                  color: '#4a5568', // Đổi màu label thành màu cam
                  fontWeight: '600', // In đậm chữ
                  fontSize: '13px', // Thay đổi kích thước font
                  paddingBottom: '5px'
                },
                '& .MuiInputBase-root': {
                  backgroundColor: `${theme.palette.customCssVars.bgError200} !important`,
                  borderColor: `${theme.palette.customCssVars.borderError200} !important`
                }
              }}
            />
            <CustomIconButton aria-label='capture screenshot' color='success' variant='contained' className='copy-btn'>
              <Copy size={14} />
            </CustomIconButton>
          </div>
        </div>
      </form>
    </>
  )
}
