// FILE: components/RechargeInputDialog.tsx

import { useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogTitle, InputAdornment, Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Alert, AlertTitle } from '@mui/lab'

import { Loader, QrCode } from 'lucide-react'

import { useSession } from 'next-auth/react'

import CustomTextField from '@core/components/mui/TextField'

import { getBankNumber } from '@/utils/bankInfo'

const denominations = ['50000', '100000', '200000', '500000', '1000000']

interface RechargeInputDialogProps {
  isOpen: boolean
  handleClose: () => void
  onGenerateQr: (data: { qrUrl: string; amount: string; rechargeAmount: string }) => void
}

export default function RechargeInputDialog({ isOpen, handleClose, onGenerateQr }: RechargeInputDialogProps) {
  const [rechargeAmount, setRechargeAmount] = useState('50,000') // State amount format
  const [amount, setAmount] = useState('50000') // State amount
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user?.id ?? ''

  const BANK_INFO = getBankNumber(userId)

  useEffect(() => {
    if (!isOpen) {
      setRechargeAmount('50,000')
      setAmount('50000')
      setIsGeneratingQR(false)
    }
  }, [isOpen])

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const changeInputAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(event.target.value)
    const rawValue = event.target.value.replace(/[^0-9]/g, '')

    setAmount(rawValue)

    setRechargeAmount(formatted)
  }

  const handleCreateQrCode = () => {
    setIsGeneratingQR(true)
    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(BANK_INFO.note)}`

    console.log(qrUrl)

    // Giả lập thời gian chờ tạo QR
    setTimeout(() => {
      onGenerateQr({ qrUrl, amount, rechargeAmount })
      handleClose() // Tự động đóng dialog này sau khi tạo QR
    }, 2000)
  }

  const isButtonDisabled = !amount || Number(amount) <= 0 || isGeneratingQR

  const handleAmountSelect = (amount: string) => {
    const formatted = formatCurrency(amount)

    setRechargeAmount(formatted)

    const rawValue = amount.replace(/[^0-9]/g, '')

    setAmount(rawValue)
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby='recharge-dialog' open={isOpen} maxWidth={'sm'} fullWidth={true}>
      <DialogTitle
        id='recharge-dialog-title'
        sx={{ background: 'var(--primary-gradient)', padding: theme => theme.spacing(4) }}
      >
        <div className='d-flex justify-content-between align-items-center'>
          <Typography
            variant='h5'
            component='span'
            sx={{ color: 'white', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          >
            <QrCode size={20} className='me-2' />
            Nạp tiền thanh toán
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <i className='tabler-x' />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        sx={{
          padding: theme => theme.spacing(4),
          gap: theme => theme.spacing(4),
          display: 'flex',
          flexDirection: 'column',
          '&.MuiDialogContent-root': {
            padding: '12px'
          }
        }}
      >
        <Alert variant='outlined'>Nạp tiền bằng cách chuyển khoản ngân hàng</Alert>
        <CustomTextField
          label='Số tiền nạp (VNĐ)'
          placeholder='10,000'
          type='text'
          value={rechargeAmount}
          onInput={changeInputAmount}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position='start'
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 'bold'
                    }
                  }}
                >
                  VND
                </InputAdornment>
              )
            }
          }}
          sx={{
            '& .MuiInputBase-root': {
              padding: '5px',
              fontSize: '16px',
              fontWeight: 'bold'
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }
          }}
        />

        <Box>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '10px'
            }}
          >
            Chọn nhanh:
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 2
            }}
          >
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
        <Alert
          severity='warning'
          sx={{
            fontSize: '13px',
            background: '#fffbeb',
            border: '1px solid #fde68a'
          }}
        >
          <AlertTitle
            sx={{
              fontSize: '15px',
              color: '#9f5729',
              fontWeight: '600'
            }}
          >
            QR thanh toán sẽ được tạo sau 1-3 phút
          </AlertTitle>
          Vui lòng chờ hệ thống xử lý yêu cầu của bạn
        </Alert>

        <Alert
          severity='error'
          sx={{
            fontSize: '13px',
            background: '#fef2f2',
            border: '1px solid #fecaca'
          }}
        >
          <AlertTitle
            sx={{
              fontSize: '15px',
              color: '#991b1b',
              fontWeight: '600'
            }}
          >
            Lưu ý quan trọng
          </AlertTitle>
          Sai nội dung hoặc 10 phút không lên tiền, vui lòng liên hệ hỗ trợ để kiểm tra
        </Alert>

        <Button
          onClick={handleCreateQrCode}
          disabled={isButtonDisabled}
          variant='contained'
          fullWidth
          sx={{
            padding: '12px 16px',
            color: 'white',
            '&.MuiButtonBase-root-MuiButton-root, &.Mui-disabled': {
              backgroundColor: '#dfe0e1',
              cursor: 'not-allowed !important'
            }
          }}
        >
          {isGeneratingQR ? (
            <>
              <Loader size={16} className='spinning-icon me-2' /> Đang tạo QR...
            </>
          ) : (
            <>
              <QrCode size={16} className='me-2' /> Tạo QR Bank
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

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
    <Typography
      onClick={() => handleSelectAmount(numericValue)}
      sx={{
        padding: '10px 12px',
        borderRadius: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',

        backgroundColor: isActive ? '#f9f1ed' : '#f3f4f6',
        border: isActive ? '1px solid var(--primary-color)' : '1px solid #e5e7eb',
        color: isActive ? 'var(--primary-color)' : 'inherit',
        '&:hover': {
          border: '1px solid var(--primary-color)',
          backgroundColor: '#f9f1ed',
          color: 'var(--primary-color)'
        }
      }}
    >
      {data}
    </Typography>
  )
}
