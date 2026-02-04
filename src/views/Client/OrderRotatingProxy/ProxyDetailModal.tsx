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
  proxy: {
    status?: string
    message?: string
    proxy?: string
    ip?: string
    lastRotate?: string
    timeRemaining?: number
  } | null
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

              {/* Status Message */}
              {proxy.message && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: proxy.status === 'success' ? 'success.50' : 'warning.50',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: proxy.status === 'success' ? 'success.300' : 'warning.300'
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: 500 }}>
                    {proxy.message}
                  </Typography>
                </Box>
              )}

              {/* Proxy Information */}
              {proxy.proxy && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Proxy:
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
                        {proxy.proxy}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.proxy!, 'Đã copy proxy!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>
                </Box>
              )}

              {/* Current IP */}
              {proxy.ip && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    IP hiện tại:
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
                          fontSize: '0.9rem'
                        }}
                      >
                        {proxy.ip}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        startIcon={<Copy size={14} />}
                        onClick={() => copy(proxy.ip!, 'Đã copy IP!')}
                      >
                        Copy
                      </Button>
                    </div>
                  </Box>
                </Box>
              )}

              {/* Last Rotate Time */}
              {proxy.lastRotate && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Lần xoay cuối:
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
                    <div className='flex items-center gap-1'>
                      <Clock3 size={16} />
                      <Typography variant='body1' sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {formatDateTimeLocal(proxy.lastRotate)}
                      </Typography>
                    </div>
                  </Box>
                </Box>
              )}

              {/* Time Remaining */}
              {proxy.timeRemaining !== undefined && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Thời gian còn lại:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'orange.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'orange.300'
                    }}
                  >
                    <div className='flex items-center gap-1'>
                      <Clock size={16} />
                      <Typography variant='body1' sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {proxy.timeRemaining}s
                      </Typography>
                    </div>
                  </Box>
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
