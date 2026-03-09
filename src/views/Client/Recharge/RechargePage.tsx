'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import { useSelector } from 'react-redux'

import {
  Wallet,
  QrCode,
  Clock,
  Copy,
  Loader,
  Clock3,
  CircleAlert,
  Trash2
} from 'lucide-react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { InputAdornment, LinearProgress, Tab, Tabs, Chip } from '@mui/material'
import Pagination from '@mui/material/Pagination'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel
} from '@tanstack/react-table'

import { useQuery } from '@tanstack/react-query'

import CustomTextField from '@core/components/mui/TextField'

import { useCreateBankQr, usePendingBankQr, useCancelBankQr, type PendingBankQr } from '@/hooks/apis/useBankQr'
import { useUpdateTransferName } from '@/hooks/apis/useTransferName'
import { useDepositHistory } from '@/hooks/apis/useDeponsitHistory'
import { useCopy } from '@/app/hooks/useCopy'
import { formatDateTimeLocal } from '@/utils/formatDate'
import useAxiosAuth from '@/hocs/useAxiosAuth'

import type { RootState } from '@/store'

const denominations = ['50000', '100000', '200000', '500000', '1000000']
const EXPIRE_SECONDS = 600

const BANK_INFO = {
  bankCode: '970436',
  bankName: 'Vietcombank',
  accountNumber: '1056968673',
  accountName: 'LUONG VAN THUY'
}

export default function RechargePage() {
  const { user } = useSelector((state: RootState) => state.user)
  const [tabIndex, setTabIndex] = useState(0)

  // Transfer name (chỉ dùng khi chưa cấu hình)
  const [transferNameInput, setTransferNameInput] = useState('')
  const [transferNameError, setTransferNameError] = useState('')
  const updateTransferName = useUpdateTransferName()

  // Recharge form
  const [rechargeAmount, setRechargeAmount] = useState('50,000')
  const [amount, setAmount] = useState('50000')
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [createdRecord, setCreatedRecord] = useState<PendingBankQr | null>(null)

  const createBankQr = useCreateBankQr()
  const cancelBankQr = useCancelBankQr()
  const { data: pendingData, refetch: refetchPending } = usePendingBankQr(true, true)
  const [, copy] = useCopy()

  const pendingRecord = pendingData?.data ?? createdRecord
  const hasPending = !!pendingRecord
  const transferConfig = user?.transfer_config
  const hasTransferName = !!transferConfig?.name && !!transferConfig?.key

  // Countdown timer
  useEffect(() => {
    if (!pendingRecord?.expires_at) {
      setCountdown(0)
      return
    }

    const calcRemaining = () => {
      const expiresAt = new Date(pendingRecord.expires_at).getTime()
      const now = Date.now()
      return Math.max(0, Math.floor((expiresAt - now) / 1000))
    }

    setCountdown(calcRemaining())

    const timer = setInterval(() => {
      const remaining = calcRemaining()
      setCountdown(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
        refetchPending()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [pendingRecord?.expires_at, refetchPending])

  // Khi server đã xác nhận record, không cần createdRecord nữa
  useEffect(() => {
    if (pendingData?.data && createdRecord) {
      setCreatedRecord(null)
    }
  }, [pendingData?.data, createdRecord])

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const changeInputAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(event.target.value)
    const rawValue = event.target.value.replace(/[^0-9]/g, '')
    setAmount(rawValue)
    setRechargeAmount(formatted)
  }

  const handleAmountSelect = (selectedAmount: string) => {
    if (hasPending) return
    const formatted = formatCurrency(selectedAmount)
    setRechargeAmount(formatted)
    const rawValue = selectedAmount.replace(/[^0-9]/g, '')
    setAmount(rawValue)
  }

  const handleCreateQrCode = async () => {
    if (hasPending) return

    setIsGeneratingQR(true)
    try {
      const result = await createBankQr.mutateAsync({ amount: Number(amount) })
      if (result.success && result.data) {
        setCreatedRecord(result.data)
        refetchPending()
      }
    } catch (error: any) {
      const errorData = error?.response?.data
      if (errorData?.data) {
        setCreatedRecord(errorData.data)
        refetchPending()
      }
      console.error('Lỗi khi tạo QR:', error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleSaveTransferName = async () => {
    if (!transferNameInput.trim() || transferNameInput.trim().length < 3) return

    setTransferNameError('')

    try {
      await updateTransferName.mutateAsync(transferNameInput.trim())
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Lỗi khi lưu tên chuyển tiền.'
      setTransferNameError(msg)
    }
  }

  const getQrUrl = () => {
    if (!pendingRecord) return ''
    const addInfo = pendingRecord.note || pendingRecord.transaction_code
    return `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?amount=${pendingRecord.amount}&addInfo=${encodeURIComponent(addInfo)}`
  }

  const handleCancelPending = async () => {
    if (!pendingRecord) return
    try {
      await cancelBankQr.mutateAsync(pendingRecord.id)
      setCreatedRecord(null)
      refetchPending()
    } catch (error) {
      console.error('Lỗi khi hủy giao dịch:', error)
    }
  }

  const handleCopyAll = () => {
    if (!pendingRecord) return
    const textToCopy = `${BANK_INFO.accountNumber} - ${BANK_INFO.accountName} - ${pendingRecord.amount} - ${pendingRecord.note || pendingRecord.transaction_code}`
    copy(textToCopy)
  }

  const isButtonDisabled = !amount || Number(amount) <= 0 || isGeneratingQR || hasPending
  const progressPercent = hasPending ? (countdown / EXPIRE_SECONDS) * 100 : 0

  return (
    <div className='table-container'>
      <div className='orders-content'>
        <div className='table-toolbar'>
          <div className='header-left'>
            <div className='page-icon'>
              <Wallet size={17} />
            </div>
            <div>
              <h5 className='mb-0 font-semibold'>Nạp tiền</h5>
            </div>
          </div>
        </div>

        <Box sx={{ padding: { xs: '12px', md: '20px' }, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ===== Chưa cấu hình tên → hiện form setup ===== */}
          {!hasTransferName && (
            <Box
              sx={{
                background: '#fff',
                borderRadius: '10px',
                border: '1px solid var(--mui-palette-divider, #e2e8f0)',
                padding: '20px'
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'var(--mui-palette-text-primary, #1e293b)', mb: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleAlert size={16} color='var(--primary-color)' />
                Cấu hình tên người chuyển tiền
              </Typography>
              <Typography sx={{ fontSize: '13px', color: 'var(--mui-palette-text-secondary, #64748b)', mb: 2, lineHeight: 1.5 }}>
                Bạn cần nhập tên chủ tài khoản ngân hàng trước khi nạp tiền. Tên này sẽ được dùng cố định cho tất cả giao dịch.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <CustomTextField
                  placeholder='VD: Nguyen Van A'
                  value={transferNameInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferNameInput(e.target.value)}
                  size='small'
                  sx={{ '& .MuiInputBase-root': { fontSize: '14px' } }}
                />
                <Typography sx={{ fontSize: '11px', color: 'var(--mui-palette-text-disabled, #94a3b8)', lineHeight: 1.4 }}>
                  Hệ thống tự động bỏ dấu và viết hoa. Tên sau khi lưu sẽ không thể thay đổi.
                </Typography>
                {transferNameError && (
                  <Box
                    sx={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#991b1b',
                      lineHeight: 1.4
                    }}
                  >
                    {transferNameError}
                  </Box>
                )}
                <Button
                  variant='contained'
                  onClick={handleSaveTransferName}
                  disabled={!transferNameInput.trim() || transferNameInput.trim().length < 3 || updateTransferName.isPending}
                  sx={{ fontSize: '13px', textTransform: 'none', color: 'white', borderRadius: '10px', py: 1.2, alignSelf: 'flex-start', px: 4 }}
                >
                  {updateTransferName.isPending ? <Loader size={14} className='spinning-icon me-2' /> : null}
                  Xác nhận
                </Button>
              </Box>
            </Box>
          )}

          {/* ===== Form nạp tiền / QR (chỉ hiện khi đã cấu hình tên) ===== */}
          {hasTransferName && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: hasPending ? '1fr 1fr' : '1fr' },
              gap: '16px'
            }}
          >
            {/* FORM NHẬP SỐ TIỀN */}
            {!hasPending && (
              <Box
                sx={{
                  background: 'var(--mui-palette-background-paper, #fff)',
                  borderRadius: '10px',
                  border: '1px solid var(--mui-palette-divider, #e2e8f0)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'var(--mui-palette-text-primary, #1e293b)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <QrCode size={16} color='var(--primary-color)' />
                  Nạp tiền bằng chuyển khoản ngân hàng
                </Typography>

                <CustomTextField
                  label='Số tiền nạp (VNĐ)'
                  placeholder='10,000'
                  type='text'
                  value={rechargeAmount}
                  onInput={changeInputAmount}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='start' sx={{ '& .MuiTypography-root': { fontWeight: 'bold', fontSize: '13px' } }}>
                          VND
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': { padding: '4px', fontSize: '15px', fontWeight: 'bold' },
                    '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600 }
                  }}
                />

                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '13px', color: 'var(--mui-palette-text-secondary, #475569)', mb: 1 }}>Chọn nhanh:</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 1 }}>
                    {denominations.map((denominationValue, key) => (
                      <BoxAmount
                        key={key}
                        handleSelectAmount={handleAmountSelect}
                        amount={denominationValue}
                        isActive={denominationValue === amount}
                      />
                    ))}
                  </Box>
                </Box>

                <Typography sx={{ fontSize: '12px', color: '#dc2626', lineHeight: 1.5 }}>
                  Sai nội dung hoặc 10 phút không lên tiền, vui lòng liên hệ hỗ trợ để kiểm tra.
                </Typography>

                <Button
                  onClick={handleCreateQrCode}
                  disabled={isButtonDisabled}
                  variant='contained'
                  fullWidth
                  sx={{
                    padding: '12px 16px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '10px',
                    '&.Mui-disabled': { backgroundColor: 'var(--mui-palette-action-disabledBackground, #f1f5f9)', color: 'var(--mui-palette-text-disabled, #94a3b8)', cursor: 'not-allowed !important' }
                  }}
                >
                  {isGeneratingQR ? (
                    <>
                      <Loader size={15} className='spinning-icon me-2' /> Đang tạo QR...
                    </>
                  ) : (
                    <>
                      <QrCode size={15} className='me-2' /> Tạo QR Bank
                    </>
                  )}
                </Button>
              </Box>
            )}

            {/* KHI CÓ PENDING: Cột trái = thông tin bank, Cột phải = QR */}
            {hasPending && pendingRecord && (
              <>
                {/* Thông tin chuyển khoản */}
                <Box
                  sx={{
                    background: 'var(--mui-palette-background-paper, #fff)',
                    borderRadius: '10px',
                    border: '1px solid var(--mui-palette-divider, #e2e8f0)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header countdown */}
                  <Box sx={{ background: 'var(--mui-palette-background-default, #f8fafc)', borderBottom: '1px solid var(--mui-palette-divider, #e2e8f0)', padding: '14px 16px', paddingBottom: '10px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ color: 'var(--mui-palette-text-secondary, #64748b)', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> Thời gian còn lại
                      </Typography>
                      <Typography
                        sx={{
                          color: countdown <= 60 ? '#dc2626' : '#1e293b',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          fontFamily: 'monospace'
                        }}
                      >
                        {formatCountdown(countdown)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={progressPercent}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          backgroundColor: countdown <= 60 ? '#dc2626' : 'var(--primary-color)',
                          transition: 'width 1s linear'
                        }
                      }}
                    />
                  </Box>

                  {/* Bank info */}
                  <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', color: 'var(--primary-color)' }}>
                      {formatCurrency(String(pendingRecord.amount))} VNĐ
                    </Typography>
                    <InfoRow label='Ngân hàng' value={BANK_INFO.bankName} />
                    <InfoRow label='Số tài khoản' value={BANK_INFO.accountNumber} copy={copy} />
                    <InfoRow label='Chủ tài khoản' value={BANK_INFO.accountName} copy={copy} />
                    <InfoRow
                      label='Nội dung chuyển khoản'
                      value={pendingRecord.note || pendingRecord.transaction_code}
                      copy={copy}
                      highlight
                    />

                    <Typography sx={{ fontSize: '11px', color: '#dc2626', lineHeight: 1.5, mt: 0.5 }}>
                      Chuyển đúng số tiền và nội dung. Tiền sẽ được cộng sau 1-5 phút. Liên hệ hỗ trợ nếu sau 10 phút chưa nhận được.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant='tonal'
                        fullWidth
                        onClick={handleCopyAll}
                        sx={{ padding: '10px', fontSize: '13px', textTransform: 'none', borderRadius: '10px' }}
                      >
                        <Copy size={14} className='me-2' /> Sao chép tất cả
                      </Button>
                      <Button
                        variant='outlined'
                        fullWidth
                        onClick={handleCancelPending}
                        disabled={cancelBankQr.isPending}
                        sx={{
                          padding: '10px',
                          fontSize: '13px',
                          textTransform: 'none',
                          borderRadius: '10px',
                          color: '#dc2626',
                          borderColor: '#fecaca',
                          '&:hover': { backgroundColor: '#fef2f2', borderColor: '#dc2626' }
                        }}
                      >
                        {cancelBankQr.isPending ? <Loader size={14} className='spinning-icon' /> : 'Hủy giao dịch'}
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* QR Code */}
                <Box
                  sx={{
                    background: 'var(--mui-palette-background-paper, #fff)',
                    borderRadius: '10px',
                    border: '1px solid var(--mui-palette-divider, #e2e8f0)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                >
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1.5, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mui-palette-text-primary, #1e293b)' }}>
                    <QrCode size={15} color='var(--primary-color)' /> Quét mã để thanh toán
                  </Typography>
                  <img
                    src={getQrUrl()}
                    alt='VietQR Code'
                    style={{ width: '100%', maxWidth: '280px', height: 'auto', borderRadius: '8px' }}
                  />
                </Box>
              </>
            )}
          </Box>
          )}

          {/* ===== PHẦN DƯỚI: TABS ===== */}
          <Box
            sx={{
              background: 'var(--mui-palette-background-paper, #fff)',
              borderRadius: '12px',
              border: '1px solid var(--mui-palette-divider, #e2e8f0)',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              sx={{
                borderBottom: '1px solid var(--mui-palette-divider, #e2e8f0)',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 }
              }}
            >
              <Tab label='Lịch sử nạp tiền' />
              <Tab label='Lịch sử giao dịch' />
            </Tabs>

            <Box sx={{ padding: '16px' }}>
              {tabIndex === 0 && <DepositHistoryTab />}
              {tabIndex === 1 && <TransactionHistoryTab />}
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  )
}

// ======== Sub-components ========

const BoxAmount = ({
  amount,
  handleSelectAmount,
  isActive
}: {
  amount: string
  handleSelectAmount: (selectedAmount: string) => void
  isActive: boolean
}) => {
  const numericValue = amount.replace(/\D/g, '')
  const data = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return (
    <Box
      onClick={() => handleSelectAmount(numericValue)}
      sx={{
        padding: '10px 8px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '13px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? '#fff7ed' : '#fff',
        border: isActive ? '1.5px solid var(--primary-color)' : '1px solid #e5e7eb',
        color: isActive ? 'var(--primary-color)' : '#374151',
        boxShadow: isActive ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
        '&:hover': {
          border: '1.5px solid var(--primary-color)',
          backgroundColor: '#fff7ed',
          color: 'var(--primary-color)',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }
      }}
    >
      {data}
    </Box>
  )
}

const InfoRow = ({
  label,
  value,
  copy,
  highlight
}: {
  label: string
  value: string
  copy?: (text: string) => void
  highlight?: boolean
}) => (
  <div className='flex flex-column gap-0'>
    <Typography component='div' sx={{ fontSize: '12px', color: 'var(--mui-palette-text-disabled, #94a3b8)' }}>
      {label}
    </Typography>
    <Typography
      component='div'
      sx={{
        fontSize: highlight ? '14px' : '13px',
        fontWeight: 600,
        color: highlight ? 'var(--primary-color)' : '#1e293b'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {value}
        {copy && (
          <Button size='small' variant='text' onClick={() => copy(value)} sx={{ minWidth: 'auto', p: '2px' }}>
            <Copy size={12} />
          </Button>
        )}
      </Box>
    </Typography>
  </div>
)

// ======== Tab: Lịch sử nạp tiền ========
function DepositHistoryTab() {
  const { data: deposits = [], isLoading, refetch: refetchDeposits } = useDepositHistory()
  const cancelBankQr = useCancelBankQr()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDeleteDeposit = async (id: number) => {
    setDeletingId(id)
    try {
      await cancelBankQr.mutateAsync(id)
      refetchDeposits()
    } catch (error) {
      console.error('Lỗi khi xóa giao dịch:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo(
    () => [
      {
        header: 'ID',
        size: 60,
        cell: ({ row }: any) => <span className='text-sm'>#{row.original.id}</span>
      },
      {
        header: 'Số tiền',
        size: 120,
        cell: ({ row }: any) => {
          const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
          return <span className='text-sm font-bold'>{formatter.format(row.original.amount || 0)}</span>
        }
      },
      {
        header: 'Mã GD',
        size: 180,
        cell: ({ row }: any) => (
          <span className='text-sm text-gray-600'>{row.original.transaction_code || row.original.tid || '-'}</span>
        )
      },
      {
        header: 'Mô tả',
        size: 200,
        cell: ({ row }: any) => (
          <span className='text-sm text-gray-600'>{row.original.description || row.original.note || '-'}</span>
        )
      },
      {
        header: 'Trạng thái',
        size: 120,
        cell: ({ row }: any) => {
          const status = row.original.status
          if (status === 'success') return <Chip label='Thành công' size='small' color='success' />
          if (status === 'pending') return <Chip label='Đang chờ' size='small' color='warning' />
          if (status === 'failed') return <Chip label='Thất bại' size='small' color='error' />
          return <Chip label={status || '-'} size='small' />
        }
      },
      {
        header: 'Ngày',
        size: 150,
        cell: ({ row }: any) => (
          <div className='d-flex align-items-center gap-1'>
            <Clock3 size={14} />
            <span style={{ marginTop: '2px' }}>{row.original.created_at ? formatDateTimeLocal(row.original.created_at) : '-'}</span>
          </div>
        )
      },
      {
        header: '',
        id: 'actions',
        size: 60,
        cell: ({ row }: any) => {
          const status = row.original.status
          if (status !== 'pending') return null
          const isDeleting = deletingId === row.original.id
          return (
            <Button
              size='small'
              variant='text'
              onClick={() => handleDeleteDeposit(row.original.id)}
              disabled={isDeleting}
              sx={{
                minWidth: 'auto',
                p: '4px',
                color: 'var(--mui-palette-text-disabled, #94a3b8)',
                '&:hover': { color: '#dc2626', backgroundColor: '#fef2f2' }
              }}
              title='Xóa giao dịch'
            >
              {isDeleting ? <Loader size={14} className='spinning-icon' /> : <Trash2 size={14} />}
            </Button>
          )
        }
      }
    ],
    [deletingId]
  )

  const table = useReactTable({
    data: deposits,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return <DataTable table={table} columns={columns} isLoading={isLoading} data={deposits} />
}

// ======== Tab: Lịch sử giao dịch ========
function TransactionHistoryTab() {
  const axiosAuth = useAxiosAuth()

  const { data: dataOrders = [], isLoading } = useQuery({
    queryKey: ['getTransactionHistory'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-transaction-history')
      return res.data ?? []
    }
  })

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const columns = useMemo(
    () => [
      {
        header: 'Lịch sử giao dịch',
        size: 400,
        cell: ({ row }: any) => {
          if (row.original?.type === 'NAPTIEN') {
            return (
              <div>
                <Chip label='Nạp' size='small' color='success' />
                <span className='font-sm ms-2'>Nạp tiền thành công!</span>
              </div>
            )
          } else if (row.original.type === 'TRUTIEN') {
            return (
              <div>
                <Chip label='Tiêu' size='small' color='primary' style={{ color: '#fff' }} />
                <span className='font-sm ms-2'>Trừ tiền thành công!</span>
              </div>
            )
          } else if (row.original.type === 'BUY') {
            return (
              <div>
                <Chip label='Mua' size='small' color='info' style={{ color: '#fff' }} />
                <span className='font-sm ms-2'>{row.original.noidung}</span>
              </div>
            )
          } else if (row.original.type === 'REFUND') {
            return (
              <div>
                <Chip label='Hoàn' size='small' color='error' style={{ color: '#fff' }} />
                <span className='font-sm ms-2'>{row.original.noidung}</span>
              </div>
            )
          }
        }
      },
      {
        size: 100,
        header: 'Số trước',
        cell: ({ row }: any) => {
          const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
          return <span className='text-sm text-gray-500 font-bold'>{formatter.format(row.original.sotientruoc)}</span>
        }
      },
      {
        size: 100,
        header: 'Số tiền',
        cell: ({ row }: any) => {
          const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
          return <span className='text-sm text-gray-500 font-bold'>{formatter.format(row.original.sotienthaydoi)}</span>
        }
      },
      {
        size: 100,
        header: 'Số tiền sau',
        cell: ({ row }: any) => {
          const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
          return <span className='text-sm text-gray-500 font-bold'>{formatter.format(row.original.sotiensau)}</span>
        }
      },
      {
        header: 'Thời gian',
        size: 100,
        cell: ({ row }: any) => (
          <div className='d-flex align-items-center gap-1'>
            <Clock3 size={14} />
            <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.created_at)}</div>
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: dataOrders,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return <DataTable table={table} columns={columns} isLoading={isLoading} data={dataOrders} />
}

// ======== Shared DataTable ========
function DataTable({ table, columns, isLoading, data }: { table: any; columns: any[]; isLoading: boolean; data: any[] }) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  return (
    <div className='table-container'>
      <div className='table-wrapper'>
        <table className='data-table' style={isLoading || data.length === 0 ? { height: '100%' } : {}}>
          <thead className='table-header'>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th style={{ width: header.getSize() }} className='table-header th' key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className='py-10 text-center'>
                  <div className='loader-wrapper'>
                    <div className='loader'>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <p className='loading-text'>Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='py-10 text-center'>
                  <div className='flex flex-col items-center justify-center'>
                    <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                    <p className='mt-4 text-gray-500'>Không có dữ liệu</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: any) => (
                <tr className='table-row' key={row.id}>
                  {row.getVisibleCells().map((cell: any) => (
                    <td className='table-cell' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRows > 0 && (
        <div className='pagination-container'>
          <div className='pagination-wrapper'>
            <div className='pagination-info'>
              <div className='page-size-select'>
                <span className='text-sm text-gray'>Kích cỡ trang</span>
                <div className='page-size-select-wrapper'>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e: any) => table.setPageSize(Number(e.target.value))}
                    className='page-size-select'
                  >
                    <option value='10'>10</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                  </select>
                  <div className='select-arrow'>
                    <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <span>
                  {startRow} - {endRow} của {totalRows} hàng
                </span>
              </div>
            </div>
            <div className='pagination-buttons'>
              <Pagination
                count={table.getPageCount()}
                shape='rounded'
                variant='outlined'
                color='primary'
                page={table.getState().pagination.pageIndex + 1}
                onChange={(_: any, page: number) => table.setPageIndex(page - 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
