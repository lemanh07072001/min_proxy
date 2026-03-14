'use client'

import { useState } from 'react'

import { Copy, Check, RefreshCw, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { useMyCredentials, useRegenerateMyCredentials } from '@/hooks/apis/useMyCredentials'

export default function CredentialsPanel() {
  const { data, isLoading, error } = useMyCredentials()
  const regenerateMutation = useRegenerateMyCredentials()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    toast.success(`Đã copy ${field}`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleGenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Đã tạo API Key')
        setConfirmRegenerate(false)
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const handleRegenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Đã tạo API Key mới')
        setConfirmRegenerate(false)
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  if (isLoading) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <Skeleton variant='rectangular' height={200} sx={{ borderRadius: 2 }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <Alert severity='error'>Không thể tải thông tin API Key.</Alert>
      </div>
    )
  }

  // Chưa có API Key — hiển thị nút tạo
  if (!data?.api_key) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>API Key</h2>
        <Alert severity='info' sx={{ mb: 3 }}>
          Bạn chưa có API Key. Tạo API Key để sử dụng API mua proxy tự động.
        </Alert>
        <Button
          variant='contained'
          color='primary'
          startIcon={<Plus size={16} />}
          onClick={handleGenerate}
          disabled={regenerateMutation.isPending}
        >
          {regenerateMutation.isPending ? 'Đang tạo...' : 'Tạo API Key'}
        </Button>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6'>API Key</h2>

      <div className='space-y-4'>
        {/* API Key */}
        <div>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5, fontWeight: 500 }}>
            API Key
          </Typography>
          <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
            <code className='flex-1 text-sm text-gray-800 font-mono break-all'>{data.api_key}</code>
            <button
              onClick={() => handleCopy(data.api_key!, 'API Key')}
              className='p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500'
              title='Copy'
            >
              {copiedField === 'API Key' ? <Check size={16} className='text-green-600' /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Tạo lại API Key */}
        {!confirmRegenerate ? (
          <Button
            variant='outlined'
            color='warning'
            startIcon={<RefreshCw size={16} />}
            onClick={() => setConfirmRegenerate(true)}
            size='small'
          >
            Tạo lại API Key
          </Button>
        ) : (
          <div style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8 }}>
            <Typography variant='body2' color='warning.main' sx={{ mb: 1 }}>
              API Key cũ sẽ ngừng hoạt động ngay lập tức. Các hệ thống đang dùng key cũ sẽ cần cập nhật lại.
            </Typography>
            <Button
              variant='contained'
              color='warning'
              size='small'
              onClick={handleRegenerate}
              disabled={regenerateMutation.isPending}
              sx={{ mr: 1 }}
            >
              {regenerateMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
            <Button
              variant='tonal'
              color='secondary'
              size='small'
              onClick={() => setConfirmRegenerate(false)}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>

      <Alert severity='info' sx={{ mt: 4 }}>
        Sử dụng API Key này trong header <strong>X-API-Key</strong> để xác thực khi gọi API mua proxy.
      </Alert>
    </div>
  )
}
