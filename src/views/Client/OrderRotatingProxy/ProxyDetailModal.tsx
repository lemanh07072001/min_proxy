'use client'

import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material'
import { X, Copy, Clock, Clock3 } from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'

interface ProxyDetailModalProps {
  open: boolean
  onClose: () => void
  proxy: null
}

const ProxyDetailModal: React.FC<ProxyDetailModalProps> = ({ open, onClose, proxy }) => {
  const [, copy] = useCopy()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label='Đang hoạt động' size='small' color='success' />
      case 'EXPRIRED':
        return <Chip label='Tạm dừng' size='small' color='error' />
      default:
        return <Chip label='Không xác định' size='small' color='secondary' />
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent dividers sx={{ padding: 3 }}>
        {proxy ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Box
                id='customized-dialog-title'
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  position: 'relative',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '17px',
                    marginBottom: '10px'
                  }}
                  variant='body2'
                  color='text.secondary'
                >
                  Thông tin proxy
                </Typography>
                <Button
                  onClick={onClose}
                  disableRipple
                  sx={{
                    fontSize: '20px'
                  }}
                >
                  <i className='tabler-x' />
                </Button>
              </Box>

              {/* HTTP Proxy */}
              {proxy.proxys?.http && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    HTTP Proxy:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300'
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Typography
                        variant='body1'
                        sx={{
                          flex: 1,
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          fontSize: '0.9rem'
                        }}
                      >
                        {proxy.proxys.http}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.proxys.http, 'Đã copy HTTP proxy!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>
                </Box>
              )}

              {/* SOCKS5 Proxy */}
              {proxy.proxys?.socks5 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    SOCKS5 Proxy:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300'
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Typography
                        variant='body1'
                        sx={{
                          flex: 1,
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          fontSize: '0.9rem'
                        }}
                      >
                        {proxy.proxys.socks5}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.proxys.socks5, 'Đã copy SOCKS5 proxy!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>
                </Box>
              )}

              {/* Demo Proxy Information */}
              {!proxy.proxys?.http && !proxy.proxys?.socks5 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    HTTP Proxy:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      mb: 2
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Typography
                        variant='body1'
                        sx={{
                          flex: 1,
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          fontSize: '0.9rem'
                        }}
                      >
                        {proxy.http}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.http, 'Đã copy HTTP proxy!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>

                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    SOCKS5 Proxy:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      mb: 2
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <Typography
                        variant='body1'
                        sx={{
                          flex: 1,
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          fontSize: '0.9rem'
                        }}
                      >
                        {proxy.socks5}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.socks5, 'Đã copy SOCKS5 proxy!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>
                </Box>
              )}

              {/* No proxy data */}
              {!proxy && !proxy.http && !proxy.socks5 && (
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant='body1' color='text.secondary'>
                    📭 Chưa có thông tin proxy
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant='body1' color='text.secondary'>
              Không có dữ liệu proxy
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ProxyDetailModal
