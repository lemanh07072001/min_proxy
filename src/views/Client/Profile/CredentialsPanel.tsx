'use client'

import { useState } from 'react'

import { Copy, Check, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import { useMyCredentials } from '@/hooks/apis/useMyCredentials'

export default function CredentialsPanel() {
  const { data, isLoading, error } = useMyCredentials()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(field)
    toast.success(`Đã copy ${field}`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (isLoading) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <Skeleton variant='rectangular' height={300} sx={{ borderRadius: 2 }} />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
        <Alert severity='error'>
          Không thể tải thông tin credentials. Tài khoản chưa được thiết lập reseller.
        </Alert>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-semibold text-gray-900'>API Credentials</h2>
        <Chip
          label={data.status === 1 ? 'Active' : 'Suspended'}
          color={data.status === 1 ? 'success' : 'error'}
          size='small'
        />
      </div>

      {data.status === 0 && (
        <Alert severity='error' sx={{ mb: 3 }}>
          Tài khoản reseller đang bị tạm ngưng. Liên hệ admin site mẹ để kích hoạt lại.
        </Alert>
      )}

      <div className='space-y-4'>
        {/* API Key */}
        <CredentialField
          label='API Key'
          value={data.api_key}
          copied={copiedField === 'API Key'}
          onCopy={() => handleCopy(data.api_key, 'API Key')}
        />

        {/* API Secret */}
        <div>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5, fontWeight: 500 }}>
            API Secret
          </Typography>
          <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
            <code className='flex-1 text-sm text-gray-800 font-mono break-all'>
              {showSecret ? data.api_secret : '\u2022'.repeat(40)}
            </code>
            <button
              onClick={() => setShowSecret(!showSecret)}
              className='p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500'
              title={showSecret ? 'Ẩn' : 'Hiện'}
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => handleCopy(data.api_secret, 'API Secret')}
              className='p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500'
              title='Copy'
            >
              {copiedField === 'API Secret' ? <Check size={16} className='text-green-600' /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Thông tin thêm */}
        {(data.company_name || data.domain) && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
            {data.company_name && (
              <InfoField label='Công ty' value={data.company_name} />
            )}
            {data.domain && (
              <InfoField label='Domain' value={data.domain} />
            )}
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <InfoField label='Markup mặc định' value={`${data.default_markup_percent}%`} />
          {data.allowed_ips && data.allowed_ips.length > 0 && (
            <div>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5, fontWeight: 500 }}>
                IP được phép
              </Typography>
              <div className='flex gap-1 flex-wrap'>
                {data.allowed_ips.map((ip, i) => (
                  <Chip key={i} label={ip} size='small' variant='outlined' />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Alert severity='info' sx={{ mt: 4 }}>
        Sử dụng API Key và Secret này để cấu hình kết nối nhà cung cấp trên site con.
        Vào <strong>Admin &gt; Cài đặt &gt; Kết nối nhà cung cấp</strong> và nhập thông tin trên.
      </Alert>
    </div>
  )
}

function CredentialField({ label, value, copied, onCopy }: {
  label: string
  value: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <div className='flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200'>
        <code className='flex-1 text-sm text-gray-800 font-mono break-all'>{value}</code>
        <button
          onClick={onCopy}
          className='p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-500'
          title='Copy'
        >
          {copied ? <Check size={16} className='text-green-600' /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <div className='bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 text-sm text-gray-800'>
        {value}
      </div>
    </div>
  )
}
