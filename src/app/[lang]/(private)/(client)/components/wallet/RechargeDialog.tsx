import { useEffect, useState } from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment } from '@mui/material'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Alert, AlertTitle } from '@mui/lab'

import { CircleAlert, Loader, QrCode } from 'lucide-react'

import Image from 'next/image'

import Box from '@mui/material/Box'

import CustomTextField from '@core/components/mui/TextField'




interface RechargeDialogProps {
  isOpen: boolean
  handleClose: () => void
}

export default function RechargeDialog({ isOpen, handleClose } : RechargeDialogProps) {
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [amount, setAmount] = useState('')
  const [qrData, setQrData] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const BANK_INFO = {
    bankCode: 'vcb',
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    accountNumber: '0010000000000',
    accountName: 'Nguyen Van A',
    note : 'ck 0335641332'
  };

  useEffect( () => {
    if (!isOpen) {
      setQrData(null)
      setRechargeAmount('')
      setAmount('')
    }
  }, [isOpen])


  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const changeInputAmount = async (event :any) => {
    const formatted = formatCurrency(event.target.value);
    const rawValue = event.target.value.replace(/[^0-9]/g, '');

    setAmount( rawValue)

    setRechargeAmount(formatted);


  }

  const handleQrCode = () => {
    setIsGeneratingQR(true);

    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?addInfo=${encodeURIComponent(BANK_INFO.note)}`;

    setQrData(qrUrl);


    setTimeout(() => {
      setIsGeneratingQR(false);
      setIsQRModalOpen(true);
    }, 2000);
  }

  const handleCloseQrCode = () => {
    setIsQRModalOpen(false);
  }

  // Điều kiện để bật/tắt nút
  const isButtonDisabled = Number(rechargeAmount) <= 0;

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='recharge-dialog'
        open={isOpen}
        maxWidth={'sm'}
        fullWidth={true}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'hidden' } }}

      >
        <DialogTitle
          id='recharge-dialog'
          sx={{
            display: 'flex',
            gap:'10px',
            flexDirection: 'column',
            background: 'var(--primary-gradient)',
            padding: theme => theme.spacing(4)
          }}
        >
          <div className="d-flex justify-content-between align-content-center">
            <Typography
              variant='h5'
              component='span'
              sx={{
                fontWeight: 'bold',
                fontSize: '18px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <QrCode size={20} className="me-2"/>
              Nạp tiền thanh toán
            </Typography>

            <IconButton
              onClick={handleClose}
              disableRipple
              sx={{
                color: 'white',

              }}
            >
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
              paddingY: theme => theme.spacing(4),
              paddingX: theme => theme.spacing(8)
            }
          }}
        >
          <>
            <Alert
              variant='outlined'
            >
              Nạp tiền bằng cách chuyển khoản ngân hàng
            </Alert>

            <CustomTextField
              label='Số tiền nạp (VNĐ)'
              placeholder='10,000'
              type='text'
              value={rechargeAmount}
              onInput={changeInputAmount}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='start'>
                      VND
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                '& .MuiInputBase-root' : {
                  padding: '5px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                },
                '& .MuiInputLabel-root' : {
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '10px'
                }

              }}
            />

            <Alert
              severity='warning'
              sx={{
                fontSize:'13px',
                background:'#fffbeb',
                border:'1px solid #fde68a'
              }}
            >
              <AlertTitle
                sx={{
                  fontSize:'15px',
                  color:'#9f5729',
                  fontWeight:'600'
                }}
              >
                QR thanh toán sẽ được tạo sau 1-3 phút
              </AlertTitle>
              Vui lòng chờ hệ thống xử lý yêu cầu của bạn
            </Alert>

            <Alert
              severity='error'
              sx={{
                fontSize:'13px',
                background:'#fef2f2',
                border:'1px solid #fecaca'
              }}
            >
              <AlertTitle
                sx={{
                  fontSize:'15px',
                  color:'#991b1b',
                  fontWeight:'600'
                }}
              >
                Lưu ý quan trọng
              </AlertTitle>
              Sai nội dung hoặc 10 phút không lên tiền, vui lòng liên hệ hỗ trợ để kiểm tra
            </Alert>

            {isGeneratingQR ? (
              <Button
                disabled={true}
                variant='contained'
                fullWidth
                sx={{
                  padding: '12px 16px',
                  color: 'white',
                  '&.MuiButtonBase-root-MuiButton-root, &.Mui-disabled': {
                    backgroundColor: '#dfe0e1',
                    cursor: 'not-allowed !important',
                  }
                }}
              >
                <Loader size={16} className="spinning-icon me-2"/>
                Đang tạo QR...
              </Button>
            ):(
              <Button
                onClick={handleQrCode}
                disabled={isButtonDisabled}
                variant='contained'
                fullWidth
                sx={{
                  padding: '12px 16px',
                  color: 'white',
                  '&.MuiButtonBase-root-MuiButton-root, &.Mui-disabled': {
                    backgroundColor: '#dfe0e1',
                    cursor: 'not-allowed !important',
                  }
                }}
              >
                <QrCode size={16} className="me-2"/>
                Tạo QR Bank
              </Button>
            )}

          </>
        </DialogContent>

        <DialogActions>

        </DialogActions>
      </Dialog>

        {/* Modal Qr Code */}
        <Dialog
          onClose={handleCloseQrCode}
          aria-labelledby='qr-dialog'
          open={isQRModalOpen}
          maxWidth={'md'}
          fullWidth={true}
          closeAfterTransition={false}
          PaperProps={{ sx: { overflow: 'hidden' } }}
        >
          <DialogTitle
            id='ar-dialog'
            sx={{
              display: 'flex',
              gap:'10px',
              flexDirection: 'column',
              background: 'var(--primary-gradient)',
              padding: theme => theme.spacing(4)
            }}
          >
            <div className="d-flex justify-content-between align-content-center">
              <Typography
                variant='h5'
                component='span'
                sx={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <QrCode size={20} className="me-2"/>
                Nạp tiền thanh toán
              </Typography>

              <IconButton
                onClick={handleCloseQrCode}
                disableRipple
                sx={{
                  color: 'white',

                }}
              >
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
                padding: theme => theme.spacing(4),
              }
            }}
          >
            <>
              <Box component="section" >
                <div className="row ">
                  <div className="col-12 col-lg-6 order-1 order-lg-0">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {/* BankName */}
                      <div className="flex flex-column gap-1">
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                          }}
                        >
                          <div>
                            Ngân hàng
                          </div>
                        </Typography>
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '17px',
                            fontWeight: 'bold'
                          }}
                        >
                          {BANK_INFO['bankName']}
                        </Typography>
                      </div>

                      {/* AccountNumber */}
                      <div className="flex flex-column gap-1">
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                          }}
                        >
                          <div>
                            Số tài khoản
                          </div>
                        </Typography>
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '17px',
                            fontWeight: 'bold'
                          }}
                        >
                          {BANK_INFO['accountNumber']}
                        </Typography>
                      </div>

                      {/* AccountName */}
                      <div className="flex flex-column gap-1">
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                          }}
                        >
                          <div>
                            Chủ tài khoản
                          </div>
                        </Typography>
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '17px',
                            fontWeight: 'bold'
                          }}
                        >
                          {BANK_INFO['accountName']}
                        </Typography>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-column gap-1">
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                          }}
                        >
                          <div>
                            Số tền cần thanh toán
                          </div>
                        </Typography>
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '17px',
                            fontWeight: 'bold'
                          }}
                        >
                          {rechargeAmount}đ
                        </Typography>
                      </div>

                      {/* Note */}
                      <div className="flex flex-column gap-1">
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '16px',
                            fontWeight: '400'
                          }}
                        >
                          <div>
                            Nội dung chuyển khoản
                          </div>
                        </Typography>
                        <Typography
                          component='div'
                          sx={{
                            fontSize: '17px',
                            fontWeight: 'bold'
                          }}
                        >
                          {BANK_INFO['note']}
                        </Typography>
                      </div>
                    </Box>
                  </div>

                  <div className="col-12 col-lg-6 mt-3 mt-lg-0 order-0 order-lg-1">
                    <div className="d-flex justify-content-center align-content-center">
                      <img src={qrData} alt="VietQR Code" style={{ width: '300px', height: 'auto' }} />
                    </div>
                  </div>
                </div>
              </Box>
              <Alert
                severity='error'
                icon={false}
                sx={{
                  fontSize:'13px',
                  background:'#fef2f2',
                  border:'1px solid #fecaca'
                }}
              >
                <AlertTitle
                  sx={{
                    fontSize:'13px',
                    color:'#991b1b',
                    fontWeight:'600'
                  }}
                >
                  Lưu ý quan trọng:
                </AlertTitle>
                <ul className="text-red-600 text-sm ">
                  <li>• Chuyển đúng số tiền: <strong>{formatCurrency(amount)} VNĐ</strong></li>
                  <li>• Nhập đúng nội dung: <strong>{BANK_INFO.note}</strong></li>
                  <li>• Tiền sẽ được cộng vào tài khoản sau 1-5 phút</li>
                  <li>• Liên hệ hỗ trợ nếu sau 10 phút chưa nhận được tiền</li>
                </ul>
              </Alert>


            </>
          </DialogContent>

          <DialogActions>

          </DialogActions>
        </Dialog>
    </>
  )
}