'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  CircularProgress
} from '@mui/material'

import { useGenerateQrCode } from '@/hooks/apis/usePartners'
import { toast } from 'react-toastify'

interface QrCodeDialogProps {
  open: boolean
  onClose: () => void
  partner: any
  amount?: string
}

export default function QrCodeDialog({ open, onClose, partner, amount }: QrCodeDialogProps) {
  const generateQrCodeMutation = useGenerateQrCode()
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Gửi dữ liệu lên server khi mở dialog và có đủ thông tin
  useEffect(() => {
    if (open && partner && amount && Number(amount) > 0) {
      const partnerCode = partner?.partner_code || partner?.code || ''
      
      if (partnerCode) {
        setQrCodeUrl(null) // Reset URL khi tạo mới
        generateQrCodeMutation.mutate(
          {
            partner_code: partnerCode,
            amount: amount
          },
          {
            onSuccess: (data) => {
              
              const qrUrl = data?.data?.image
              if (qrUrl) {
                if(data?.data?.type === 'image'){
                    setQrCodeUrl(qrUrl)
                }else{
                    window.open(qrUrl, 'noopener,noreferrer')
                }
                
              } else {
                console.error('QR code URL not found in response:', data)
                toast.error('Không tìm thấy URL QR code từ server')
              }
            },
            onError: (error: any) => {
              console.error('Error generating QR code:', error)
              toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo QR code')
              setQrCodeUrl(null)
            }
          }
        )
      }
    } else {
      setQrCodeUrl(null)
    }
  }, [open, partner, amount])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='qr-code-dialog-title'
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle id='qr-code-dialog-title'>
        QR Code nạp tiền - {partner?.title || partner?.name || ''}
      </DialogTitle>
      <DialogContent>
        {partner ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
            {amount && (
              <DialogContentText 
                sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '1.1rem',
                }}
                className='text-primary'
              >
                Số tiền: {new Intl.NumberFormat('vi-VN').format(Number(amount))} đ
              </DialogContentText>
            )}
            {generateQrCodeMutation.isPending ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress />
                <DialogContentText sx={{ textAlign: 'center' }}>
                  Đang tạo QR code...
                </DialogContentText>
              </Box>
            ) : qrCodeUrl ? (
              <>
                <img
                  src={qrCodeUrl}
                  alt='QR Code'
                  style={{
                    width: 300,
                    height: 300,
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: 8,
                    backgroundColor: '#fff'
                  }}
                />
                <DialogContentText sx={{ textAlign: 'center', mt: 1 }}>
                  Quét QR code để nạp tiền cho đối tác
                </DialogContentText>
                {partner?.account_number && (
                  <DialogContentText sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
                    Số tài khoản: <strong>{partner.account_number}</strong>
                  </DialogContentText>
                )}
              </>
            ) : (
              <DialogContentText sx={{ textAlign: 'center', color: 'error.main' }}>
                {generateQrCodeMutation.isError
                  ? 'Có lỗi xảy ra khi tạo QR code'
                  : 'Chưa có thông tin để tạo QR code'}
              </DialogContentText>
            )}
          </Box>
        ) : (
          <DialogContentText>Đang tải...</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' sx={{ color: '#fff' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

