// React Imports
import { useEffect, useState } from 'react'

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

import { CheckCheck, Copy } from 'lucide-react'

import TimeProxyDie from './TimeProxyDie'

import DialogCloseButton from '@components/modals/DialogCloseButton'
import useAxiosAuth from '@/hooks/useAxiosAuth'
import { useCopy } from '@/app/hooks/useCopy'

interface DetailModalProps {
  isOpen: boolean
  handleClose: () => void
  apiKey: string
}

const DetailProxy = ({ isOpen, handleClose, apiKey }: DetailModalProps) => {
  const axiosAuth = useAxiosAuth()
  const [proxyData, setProxyData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHttpCopied, copyHttp] = useCopy()
  const [isSocksCopied, copySocks] = useCopy()
  const [isIpCopied, copyIp] = useCopy()

  const fetchProxyData = async () => {
    if (!apiKey) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await axiosAuth.post('/api/proxies/new', { key: apiKey })

      setProxyData(res.data?.data ?? null)
    } catch (err: any) {
      console.error('Lỗi khi lấy proxy:', err)
      setError('Không thể tải dữ liệu proxy')
      setProxyData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isOpen || !apiKey) return
    fetchProxyData()

    // Cleanup khi đóng modal => reset data
    return () => {
      setProxyData(null)
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
          {error && (
            <Typography color='error' sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {proxyData ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {(proxyData?.http || proxyData?.HTTP) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      HTTP
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.http ?? proxyData.HTTP ?? '-'}
                        readOnly
                        className='w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                      <button
                        onClick={() => copyHttp(String(proxyData.http ?? proxyData.HTTP ?? ''))}
                        className='absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-slate-200 rounded-lg transition-colors group'
                        title='Copy to clipboard'
                      >
                        {isHttpCopied ? (
                          <CheckCheck className='w-4 h-4 text-emerald-600' />
                        ) : (
                          <Copy className='w-4 h-4 text-slate-500 group-hover:text-slate-700' />
                        )}
                      </button>
                    </div>
                  </div>
                </Box>
              )}


              {(proxyData?.socks5 || proxyData?.SOCKS5) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      SOCKS5
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.socks5 ?? proxyData.SOCKS5 ?? '-'}
                        readOnly
                        className='w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                      <button
                        onClick={() => copySocks(String(proxyData.socks5 ?? proxyData.SOCKS5 ?? ''))}
                        className='absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-slate-200 rounded-lg transition-colors group'
                        title='Copy to clipboard'
                      >
                        {isSocksCopied ? (
                          <CheckCheck className='w-4 h-4 text-emerald-600' />
                        ) : (
                          <Copy className='w-4 h-4 text-slate-500 group-hover:text-slate-700' />
                        )}
                      </button>
                    </div>
                  </div>
                </Box>
              )}


              {proxyData?.realIpAddress && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      Địa chỉ IP
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.realIpAddress}
                        readOnly
                        className='w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                      <button
                        onClick={() => copyIp(String(proxyData.realIpAddress))}
                        className='absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-slate-200 rounded-lg transition-colors group'
                        title='Copy to clipboard'
                      >
                        {isIpCopied ? (
                          <CheckCheck className='w-4 h-4 text-emerald-600' />
                        ) : (
                          <Copy className='w-4 h-4 text-slate-500 group-hover:text-slate-700' />
                        )}
                      </button>
                    </div>
                  </div>
                </Box>
              )}

              {proxyData?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      Vị trí
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.location}
                        readOnly
                        className='w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                      <button
                        onClick={() => copyIp(String(proxyData.location))}
                        className='absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-slate-200 rounded-lg transition-colors group'
                        title='Copy to clipboard'
                      >
                        {isIpCopied ? (
                          <CheckCheck className='w-4 h-4 text-emerald-600' />
                        ) : (
                          <Copy className='w-4 h-4 text-slate-500 group-hover:text-slate-700' />
                        )}
                      </button>
                    </div>
                  </div>
                </Box>
              )}

              {proxyData?.network && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      Nhà mạng
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.network}
                        readOnly
                        className='w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                      <button
                        onClick={() => copyIp(String(proxyData.network))}
                        className='absolute right-2 top-1/2 -translate-y-1/2 p-2.5 hover:bg-slate-200 rounded-lg transition-colors group'
                        title='Copy to clipboard'
                      >
                        {isIpCopied ? (
                          <CheckCheck className='w-4 h-4 text-emerald-600' />
                        ) : (
                          <Copy className='w-4 h-4 text-slate-500 group-hover:text-slate-700' />
                        )}
                      </button>
                    </div>
                  </div>
                </Box>
              )}

              {proxyData?.message && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div className='group w-full'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3'>
                      Thông báo
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={proxyData.message}
                        readOnly
                        className='w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all'
                      />
                    </div>
                  </div>
                </Box>
              )}

              {/*<TimeProxyDie expiresAt={proxyData?.time_die ?? 0} />*/}

            </Box>
          ) : (
            !isLoading && !error && <Typography>Không có dữ liệu</Typography>
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
