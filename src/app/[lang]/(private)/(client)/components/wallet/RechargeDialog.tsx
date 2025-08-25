import { useEffect, useState } from 'react'

import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment } from '@mui/material'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { Alert } from '@mui/lab'

import { CircleAlert, QrCode } from 'lucide-react'

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
  const [isQrCode, setQrCode] = useState(false)
  const [qrData, setQrData] = useState(null);

  const BANK_INFO = {
    bankCode: 'vcb',
    bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam',
    accountNumber: '0010000000000',
    accountName: 'Nguyen Van A',
    note : 'ck 0335641332'
  };

  useEffect(() => {
    if (!isOpen) {
      setQrCode(false)
      setQrData(null)
      setRechargeAmount('')
      setAmount('')
    }
  }, [isOpen])


  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const changeInputAmount = (event :any) => {
    const formatted = formatCurrency(event.target.value);
    const rawValue = event.target.value.replace(/[^0-9]/g, '');

    setAmount( rawValue)

    setRechargeAmount(formatted);
  }

  const handleQrCode = () => {
    setQrCode(true)

    const qrUrl = `https://img.vietqr.io/image/${BANK_INFO.bankCode}-${BANK_INFO.accountNumber}-compact2.png?addInfo=${encodeURIComponent(BANK_INFO.note)}`;

    setQrData(qrUrl);
  }

  // Điều kiện để bật/tắt nút
  const isButtonDisabled = Number(rechargeAmount) <= 0;

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='recharge-dialog'
        open={isOpen}
        maxWidth={'md'}
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
          {!isQrCode ? (
            <>
              <Alert
                variant='outlined'
              >
                Nạp tiền bằng cách chuyển khoản ngân hàng
              </Alert>

              <div className="d-flex flex-column gap-2">
                <Typography
                  variant='h5'
                  component='span'
                  sx={{
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'red',
                    fontWeight: '200'
                  }}
                >
                  <CircleAlert size={16} className="me-2"/>
                  Vui lòng tạo QR thanh toán nhận tiền sau 1-3 phút
                </Typography>

                <Typography
                  variant='h5'
                  component='span'
                  sx={{
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'red',
                    fontWeight: '200'
                  }}
                >
                  <CircleAlert size={16} className="me-2"/>
                  Sai nội dung hoặc 10 phút không lên tiền cần liên hệ để kiểm tra
                </Typography>
              </div>

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
                <QrCode size={16}/>
                Tạo QR Bank
              </Button>
            </>
          ) : (
            <>
              <Box component="section" >
                <div className="row ">
                  <div className="col-12 col-lg-6 ">
                    <div className="flex flex-column gap-3">
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
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 ">

                    <img src={qrData} alt="VietQR Code" style={{ width: '100%', height: 'auto' }} />
                  </div>
                </div>
              </Box>

            </>
          )}


        </DialogContent>

        <DialogActions>

        </DialogActions>
      </Dialog>
    </>
  )
}