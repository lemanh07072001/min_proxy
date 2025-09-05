// FILE: components/QrCodeDisplayDialog.tsx

import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { Alert, AlertTitle } from '@mui/lab'
import { Copy, QrCode } from 'lucide-react'

import Button from '@mui/material/Button'

import CustomIconButton from '@core/components/mui/IconButton'

import { useCopy } from '@/app/hooks/useCopy'

// Thông tin ngân hàng có thể được định nghĩa ở đây hoặc truyền từ ngoài vào
const BANK_INFO = {
  bankName: 'Vietcombank',
  accountNumber: '1056968673',
  accountName: 'LUONG VAN THUY',
  note: 'ck 0335641332'
}

const formatCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '')

  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

interface QrCodeDisplayDialogProps {
  isOpen: boolean
  handleClose: () => void
  qrDataUrl: string | null
  amount: string // Số tiền chưa format (e.g., '10000')
  rechargeAmount: string // Số tiền đã format (e.g., '10,000')
}

export default function QrCodeDisplayDialog({
  isOpen,
  handleClose,
  qrDataUrl,
  amount,
  rechargeAmount
}: QrCodeDisplayDialogProps) {
  if (!qrDataUrl) return null

  const [, copy] = useCopy()

  const handleCopyAll = () => {
    // Ghép các chuỗi lại theo đúng định dạng bạn muốn
    const textToCopy = `${BANK_INFO.accountNumber} - ${BANK_INFO.accountName} - ${amount} - ${BANK_INFO.note}`

    // Gọi hàm copy từ hook
    copy(textToCopy)
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='qr-dialog'
      open={isOpen}
      maxWidth={'md'}
      fullWidth={true}
      PaperProps={{ sx: { overflow: 'hidden' } }}
    >
      <DialogTitle
        id='qr-dialog-title'
        sx={{
          background: 'var(--primary-gradient)',
          padding: theme => theme.spacing(4)
        }}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <Typography
            variant='h5'
            component='span'
            sx={{ color: 'white', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          >
            <QrCode size={20} className='me-2' />
            Quét mã để thanh toán
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: theme => theme.spacing(4),
          '&.MuiDialogContent-root': {
            padding: '12px'
          }
        }}
      >
        <Box component='section'>
          <div className='row'>
            <div className='col-12 col-lg-6 order-1 order-lg-0'>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                {/* Thông tin chuyển khoản */}
                <InfoRow label='Ngân hàng' value={BANK_INFO.bankName} />
                <InfoRow label='Số tài khoản' value={BANK_INFO.accountNumber} isCopy={true} copy={copy} />
                <InfoRow label='Chủ tài khoản' value={BANK_INFO.accountName} isCopy={true} copy={copy} />
                <InfoRow label='Số tiền cần thanh toán' value={`${rechargeAmount}đ`} isCopy={true} copy={copy} />
                <InfoRow label='Nội dung chuyển khoản' value={BANK_INFO.note} isCopy={true} copy={copy} />
              </Box>
            </div>

            <div className='col-12 col-lg-6 mt-3 mt-lg-0 order-0 order-lg-1 d-flex justify-content-center align-items-center'>
              <img src={qrDataUrl} alt='VietQR Code' style={{ width: '300px', height: 'auto' }} />
            </div>
          </div>
        </Box>
        <Alert severity='error' icon={false} sx={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertTitle sx={{ color: '#991b1b', fontWeight: '600' }}>Lưu ý quan trọng:</AlertTitle>
          <ul className='text-red-600 text-sm ps-3 mb-0'>
            <li>
              Chuyển đúng số tiền: <strong>{formatCurrency(amount)} VNĐ</strong>
            </li>
            <li>
              Nhập đúng nội dung: <strong>{BANK_INFO.note}</strong>
            </li>
            <li>Tiền sẽ được cộng vào tài khoản sau 1-5 phút</li>
            <li>Liên hệ hỗ trợ nếu sau 10 phút chưa nhận được tiền</li>
          </ul>
        </Alert>

        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row'
            },
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)'
            },
            gap: '10px'
          }}
        >
          <Button
            variant='tonal'
            fullWidth
            color='secondary'
            onClick={handleClose}
            sx={{
              padding: '12px 16px'
            }}
          >
            Đóng
          </Button>

          <Button
            variant='tonal'
            fullWidth
            sx={{
              padding: '12px 16px'
            }}
            onClick={handleCopyAll}
          >
            <QrCode size={16} className='me-2' /> Sao chép tất cả
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

// Component phụ để hiển thị thông tin
const InfoRow = ({
  label,
  value,
  isCopy,
  copy
}: {
  label: string
  value: string
  isCopy: boolean
  copy?: (text: string) => void
}) => (
  <div className='flex flex-column gap-1'>
    <Typography component='div' sx={{ fontSize: '16px' }}>
      {label}
    </Typography>
    <Typography
      component='div'
      sx={{
        fontSize: '17px',
        fontWeight: 'bold'
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
        {isCopy && (
          <CustomIconButton aria-label='capture screenshot' color='primary' size='small' onClick={() => copy(value)}>
            <Copy size={16} />
          </CustomIconButton>
        )}
      </Box>
    </Typography>
  </div>
)
