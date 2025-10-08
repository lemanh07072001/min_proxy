// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

import { Box } from '@mui/material'

import DialogCloseButton from '@components/modals/DialogCloseButton'
import useAxiosAuth from '@/hocs/useAxiosAuth'
import { useCopy } from '@/app/hooks/useCopy'

interface DetailModalProps {
  isOpen: boolean
  handleClose: () => void
  apiKey: string
}

const DetailProxy = ({ isOpen, handleClose, apiKey }: DetailModalProps) => {
  const axiosAuth = useAxiosAuth()
  const [proxyData, setProxyData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, copy] = useCopy()

  useEffect(() => {
    if (!isOpen || !apiKey) return

    const fetchProxyData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await axiosAuth.get(`/get-proxy-rotating/${apiKey}`)

        setProxyData(res.data?.data ? (Array.isArray(res.data.data) ? res.data.data : [res.data.data]) : [])
      } catch (err: any) {
        console.error('Lỗi khi lấy proxy:', err)
        setError('Không thể tải dữ liệu proxy')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProxyData()

    // Cleanup khi đóng modal => reset data
    return () => {
      setProxyData([])
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen, apiKey])

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={isOpen}
        closeAfterTransition={true}
        PaperProps={{ sx: { overflow: 'visible', position: 'relative' } }}
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Thông tin Proxy
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>

        <DialogContent>
          {proxyData.length > 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700}>HTTP:</Typography>
                <Typography
                  sx={{
                    background: '#e7e7e7',
                    padding: '3px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={() => copy(String(proxyData[0]['http'] ?? ''))}
                >
                  {proxyData[0]['http']}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700}>SOCKS5:</Typography>
                <Typography
                  sx={{
                    background: '#e7e7e7',
                    padding: '3px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={() => copy(String(proxyData[0]['socks5'] ?? ''))}
                >
                  {proxyData[0]['socks5']}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700}>Địa chỉ IP:</Typography>
                <Typography
                  sx={{
                    background: '#e7e7e7',
                    padding: '3px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                  onClick={() => copy(String(proxyData[0]['realIpAddress'] ?? ''))}
                >
                  {proxyData[0]['realIpAddress']}
                </Typography>
              </Box>
            </Box>
          ) : (
            !isLoading && <Typography>Không có dữ liệu</Typography>
          )}
        </DialogContent>

        {/* ✅ Backdrop phủ toàn modal */}
        <Backdrop
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            color: '#fff',
            backgroundColor: 'rgba(210, 210, 210, 0.4)',
            zIndex: theme => theme.zIndex.drawer + 2
          }}
          open={isLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Dialog>
    </>
  )
}

export default DetailProxy
