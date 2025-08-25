'use client'

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Globe,
  Loader,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  XCircle
} from 'lucide-react'

import './styles.css'

import React, { useState } from 'react'

import MenuItem from '@mui/material/MenuItem'

import { InputAdornment } from '@mui/material'

import { useIsMutating, useMutation } from '@tanstack/react-query'

import axios from 'axios'

import { useTheme } from '@mui/material/styles'

import Button from '@mui/material/Button'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'
import { LoadingButton } from '@mui/lab'

// Tạo schema validation bằng Yup
const schema = yup.object().shape({
  format_proxy: yup.string().required('Vui lòng chọn định dạng proxy'),
  protocol: yup.string().required('Vui lòng chọn giao thức'),
  list_proxy: yup.string().required('Vui lòng nhập danh sách proxy')
})

const checkProxyApi = async (proxyData: any) => {
  const { data } = await axios.post('/api/check-proxy', proxyData)

  return data
}

interface CheckProxyFormProps {
  onItemListChange: (items: string[]) => void;
  onCheckedProxy: (items: string[]) => void;
}

export default function CheckProxyForm({onItemListChange, onCheckedProxy } : CheckProxyFormProps) {
  const [successProxies, setSuccessProxies] = useState([]);
  const [errorProxies, setErrorProxies] = useState([]);

  const theme = useTheme()

  // Đếm số lượng mutation có key là ['check-proxy'] đang chạy
  const pendingMutations = useIsMutating({ mutationKey: ['check-proxy'] });

  // isLoading sẽ là true nếu có ít nhất 1 mutation đang chạy
  const isLoading = pendingMutations > 0;

  const mutation = useMutation({
    mutationKey: ['check-proxy'],
    mutationFn: checkProxyApi,
    onSuccess: (dataFromApi) => {
      // Khi một proxy được check thành công, `dataFromApi` là kết quả trả về.
      // Bây giờ, chúng ta gọi callback để báo cho component cha.
      onCheckedProxy(dataFromApi);
      handleProxyChecked(dataFromApi)
    },
    onError: (error, variables) => {
      const failedProxyData = {
        proxy: variables.list_proxy,
        responseTime: -1,
        status: 'error',
      };

      onCheckedProxy(failedProxyData);
      handleProxyChecked(failedProxyData)
    }
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

    // Tách và lọc các dòng trống
    const filteredLines = list_proxy.split('\n').filter(line => line.trim() !== '')

    // Cập nhật state để hiển thị trên UI
    const proxyObjectsArray = filteredLines.map((proxyString, index) => {
      const [host] = proxyString.split(':')

      return {
        id: index + 1,
        proxy : proxyString,
        ip : host,
        protocol: protocol,
        status : 'checking',
        responseTime: 'checking',
        type : format_proxy
      };
    });

    setSuccessProxies([]);
    setErrorProxies([]);

    // Gọi callback để báo cho component cha
    onItemListChange(proxyObjectsArray)

    filteredLines.forEach(proxy => {
      mutation.mutate({
        protocol,
        format_proxy,
        list_proxy: proxy
      })

    })
  }

  const handleProxyChecked = (checkedProxyResult) => {
    // Phân loại vào danh sách success hoặc error
    if (checkedProxyResult.status === 'success') {
      setSuccessProxies(prev => [...prev, checkedProxyResult.proxy]);
    } else {
      setErrorProxies(prev => [...prev, checkedProxyResult.proxy]);
    }
  };

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
          <LoadingButton
            variant='contained'
            color='warning'
            type='submit'
            fullWidth
            loading={isLoading}
            loadingIndicator={<Loader size={25} className="spinning-icon spinning-icon-loading " />}
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
          </LoadingButton>

          {/* Proxy đang hoạt động */}
          <div className='form-group-check'>
            <CustomTextField
              rows={4}
              multiline
              fullWidth
              name='proxy_success'
              id='proxy_success'
              value={successProxies.join('\n')}
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
            <button  type="button" className='copy-btn'>
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
              value={errorProxies.join('\n')}
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
            <CustomIconButton type="button" aria-label='capture screenshot' color='success' variant='contained' className='copy-btn'>
              <Copy size={14} />
            </CustomIconButton>
          </div>
        </div>
      </form>
    </>
  )
}
