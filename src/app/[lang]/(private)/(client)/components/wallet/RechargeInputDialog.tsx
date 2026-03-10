// FILE: components/RechargeInputDialog.tsx

import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogTitle, InputAdornment, Box, LinearProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Alert, AlertTitle } from '@mui/lab'

import { Copy, Loader, QrCode, Clock, CircleAlert } from 'lucide-react'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'

import { useCreateBankQr, usePendingBankQr, type PendingBankQr } from '@/hooks/apis/useBankQr'
import { useCopy } from '@/app/hooks/useCopy'

const denominations = ['50000', '100000', '200000', '500000', '1000000']
const EXPIRE_SECONDS = 600 // 10 phút

const BANK_INFO = {
  bankCode: '970436',
  bankName: 'Vietcombank',
  accountNumber: '1056968673',
  accountName: 'LUONG VAN THUY'
}

interface RechargeInputDialogProps {
  isOpen: boolean
  handleClose: () => void
}

export default function RechargeInputDialog({ isOpen, handleClose }: RechargeInputDialogProps) {
  const [rechargeAmount, setRechargeAmount] = useState('50,000')
  const [amount, setAmount] = useState('50000')
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [createdRecord, setCreatedRecord] = useState<PendingBankQr | null>(null)

  const createBankQr = useCreateBankQr()
  const { data: pendingData, refetch: refetchPending } = usePendingBankQr(isOpen, true)
  const [, copy] = useCopy()

  const pendingRecord = pendingData?.data ?? createdRecord
  const hasPending = !!pendingRecord

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

  // Khi server đã xác nhận record (pendingData có data), không cần createdRecord nữa
  useEffect(() => {
    if (pendingData?.data && createdRecord) {
      setCreatedRecord(null)
    }
  }, [pendingData?.data, createdRecord])

  useEffect(() => {
    if (!isOpen) {
      setRechargeAmount('50,000')
      setAmount('50000')
      setIsGeneratingQR(false)
      setCreatedRecord(null)
    }
  }, [isOpen])

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

  const isButtonDisabled = !amount || Number(amount) <= 0 || isGeneratingQR || hasPending

  const handleAmountSelect = (selectedAmount: string) => {
    if (hasPending) return

    const formatted = formatCurrency(selectedAmount)

    setRechargeAmount(formatted)

    const rawValue = selectedAmount.replace(/[^0-9]/g, '')

    setAmount(rawValue)
  }

  const getQrUrl = () => {
    if (!pendingRecord) return ''

    return `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?amount=${pendingRecord.amount}&addInfo=${encodeURIComponent(pendingRecord.transaction_code)}`
  }

  const handleCopyAll = () => {
    if (!pendingRecord) return

    const textToCopy = `${BANK_INFO.accountNumber} - ${BANK_INFO.accountName} - ${pendingRecord.amount} - ${pendingRecord.transaction_code}`

    copy(textToCopy)
  }

  const progressPercent = hasPending ? (countdown / EXPIRE_SECONDS) * 100 : 0

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='recharge-dialog'
      open={isOpen}
      maxWidth={hasPending ? 'md' : 'sm'}
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'hidden', transition: 'max-width 0.3s ease' } }}
    >
      {/* Header */}
      <DialogTitle
        id='recharge-dialog-title'
        sx={{
          background: 'var(--primary-gradient)',
          padding: theme => theme.spacing(4),
          paddingBottom: hasPending ? '12px' : undefined
        }}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <Typography
            variant='h5'
            component='span'
            sx={{ color: 'white', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          >
            <QrCode size={20} className='me-2' />
            {hasPending ? 'Quét mã để thanh toán' : 'Nạp tiền thanh toán'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <i className='tabler-x' />
          </IconButton>
        </div>

        {/* Số tiền nạp + Countdown progress bar trong header */}
        {hasPending && (
          <Box sx={{ mt: 1.5 }}>
            {/* Số tiền nạp nổi bật */}
            <Typography
              sx={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1
              }}
            >
              {formatCurrency(String(pendingRecord.amount))} VNĐ
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Clock size={14} />
                Thời gian còn lại
              </Typography>
              <Typography
                sx={{
                  color: countdown <= 60 ? '#fca5a5' : '#ffffff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}
              >
                {formatCountdown(countdown)}
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={progressPercent}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: countdown <= 60 ? '#fca5a5' : '#ffffff',
                  transition: 'width 1s linear'
                }
              }}
            />
          </Box>
        )}
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          '&.MuiDialogContent-root': {
            padding: '16px'
          }
        }}
      >
        {/* ===== FORM NHẬP SỐ TIỀN ===== */}
        {!hasPending && (
          <>
            {/* Hướng dẫn 3 bước */}
            <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[
                { step: '1', label: 'Tạo QR' },
                { step: '2', label: 'Chuyển khoản' },
                { step: '3', label: 'Nhận tiền' }
              ].map((item, i) => (
                <Box key={item.step} sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {i > 0 && <Typography sx={{ color: '#cbd5e1', fontSize: '12px', mx: 0.5 }}>→</Typography>}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--primary-gradient)' : '#e2e8f0',
                      color: i === 0 ? '#fff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? '#1e293b' : '#64748b' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Cảnh báo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#fffbeb',
                border: '1px solid #fde68a'
              }}
            >
              <CircleAlert size={14} color='#d97706' style={{ flexShrink: 0 }} />
              <Typography sx={{ fontSize: '12px', color: '#92400e', lineHeight: 1.4 }}>
                Phải tạo QR trước rồi mới chuyển khoản. Chuyển khoản không qua QR sẽ không được ghi nhận tự động.
              </Typography>
            </Box>

            <CustomTextField
              label='Số tiền nạp'
              placeholder='Nhập số tiền'
              type='text'
              value={rechargeAmount}
              onInput={changeInputAmount}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment
                      position='end'
                      sx={{ '& .MuiTypography-root': { fontWeight: 700, fontSize: '13px', color: '#94a3b8' } }}
                    >
                      VNĐ
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiInputBase-root': { padding: '4px 8px', fontSize: '16px', fontWeight: 700 },
                '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600 }
              }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {denominations.map((denominationValue, key) => (
                <BoxAmount
                  key={key}
                  handleSelectAmount={handleAmountSelect}
                  amount={denominationValue}
                  isActive={denominationValue === amount}
                />
              ))}
            </Box>

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
                '&.Mui-disabled': { backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed !important' }
              }}
            >
              {isGeneratingQR ? (
                <>
                  <Loader size={15} className='spinning-icon me-2' /> Đang tạo QR...
                </>
              ) : (
                <>
                  <QrCode size={15} className='me-2' /> Tạo mã QR thanh toán
                </>
              )}
            </Button>
          </>
        )}

        {/* ===== HIỂN THỊ QR + THÔNG TIN BANK ===== */}
        {hasPending && (
          <>
            <Box component='section'>
              <div className='row'>
                {/* Thông tin chuyển khoản - bên trái */}
                <div className='col-12 col-lg-6 order-1 order-lg-0'>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      height: '100%'
                    }}
                  >
                    <InfoRow label='Ngân hàng' value={BANK_INFO.bankName} />
                    <InfoRow label='Số tài khoản' value={BANK_INFO.accountNumber} copy={copy} />
                    <InfoRow label='Chủ tài khoản' value={BANK_INFO.accountName} copy={copy} />
                    <InfoRow
                      label='Số tiền cần thanh toán'
                      value={`${formatCurrency(String(pendingRecord.amount))}đ`}
                      copy={copy}
                      highlight
                    />
                    <InfoRow
                      label='Nội dung chuyển khoản'
                      value={pendingRecord.transaction_code}
                      copy={copy}
                      highlight
                    />
                  </Box>
                </div>

                {/* QR Code - bên phải */}
                <div className='col-12 col-lg-6 mt-3 mt-lg-0 order-0 order-lg-1 d-flex justify-content-center align-items-center'>
                  <img
                    src={getQrUrl()}
                    alt='VietQR Code'
                    style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </Box>

            {/* Lưu ý */}
            <Alert severity='error' icon={false} sx={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <AlertTitle sx={{ color: '#991b1b', fontWeight: '600' }}>Lưu ý quan trọng:</AlertTitle>
              <ul className='text-red-600 text-sm ps-3 mb-0'>
                <li>
                  Chuyển đúng số tiền: <strong>{formatCurrency(String(pendingRecord.amount))} VNĐ</strong>
                </li>
                <li>
                  Nhập đúng nội dung: <strong>{pendingRecord.transaction_code}</strong>
                </li>
                <li>Tiền sẽ được cộng vào tài khoản sau 1-5 phút</li>
                <li>Liên hệ hỗ trợ nếu sau 10 phút chưa nhận được tiền</li>
              </ul>
            </Alert>

            {/* Buttons */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '10px' }}>
              <Button
                variant='tonal'
                fullWidth
                color='secondary'
                onClick={handleClose}
                sx={{ padding: '12px 16px' }}
              >
                Đóng
              </Button>

              <Button
                variant='tonal'
                fullWidth
                onClick={handleCopyAll}
                sx={{ padding: '12px 16px' }}
              >
                <Copy size={16} className='me-2' /> Sao chép tất cả
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
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
  const num = Number(numericValue)
  const label = num >= 1_000_000 ? `${num / 1_000_000}tr` : `${num / 1_000}k`

  return (
    <Box
      onClick={() => handleSelectAmount(numericValue)}
      sx={{
        padding: '6px 14px',
        borderRadius: '20px',
        fontWeight: 600,
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        backgroundColor: isActive ? 'rgba(252, 67, 54, 0.08)' : '#f8fafc',
        border: isActive ? '1.5px solid var(--primary-color)' : '1.5px solid #e2e8f0',
        color: isActive ? 'var(--primary-color)' : '#475569',
        '&:hover': {
          borderColor: 'var(--primary-color)',
          backgroundColor: 'rgba(252, 67, 54, 0.05)',
          color: 'var(--primary-color)'
        }
      }}
    >
      {label}
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
  <div className='flex flex-column gap-1'>
    <Typography component='div' sx={{ fontSize: '14px', color: '#64748b' }}>
      {label}
    </Typography>
    <Typography
      component='div'
      sx={{
        fontSize: highlight ? '17px' : '16px',
        fontWeight: 'bold',
        color: highlight ? 'var(--primary-color)' : 'inherit'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {value}
        {copy && (
          <CustomIconButton aria-label='copy' color='primary' size='small' onClick={() => copy(value)}>
            <Copy size={14} />
          </CustomIconButton>
        )}
      </Box>
    </Typography>
  </div>
)
