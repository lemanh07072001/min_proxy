'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import { Copy, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import { useRegenerateCredentials } from '@/hooks/apis/useAdminResellers'

interface ModalCredentialsProps {
  open: boolean
  onClose: () => void
  reseller?: any
}

export default function ModalCredentials({ open, onClose, reseller }: ModalCredentialsProps) {
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)

  const regenerateMutation = useRegenerateCredentials()

  const profile = reseller?.reseller_profile

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã copy ${label}`)
  }

  const handleRegenerate = () => {
    if (!reseller?.id) return

    regenerateMutation.mutate(reseller.id, {
      onSuccess: () => {
        toast.success('Đã tạo API key mới')
        setConfirmRegenerate(false)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>
        <Typography variant='h5' component='span'>
          API Key
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
          <Typography variant='body2' color='text.secondary'>
            Reseller: <strong>{reseller?.name}</strong> ({reseller?.email})
          </Typography>
          {profile?.company_name && (
            <Typography variant='body2' color='text.secondary'>
              Company: <strong>{profile.company_name}</strong>
            </Typography>
          )}
        </div>

        <TextField
          fullWidth
          label='API Key'
          value={reseller?.api_key || ''}
          slotProps={{
            input: {
              readOnly: true,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton size='small' onClick={() => handleCopy(reseller?.api_key || '', 'API Key')}>
                    <Copy size={16} />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
          sx={{ mb: 2 }}
        />

        {!confirmRegenerate ? (
          <Button
            variant='outlined'
            color='warning'
            startIcon={<RefreshCw size={16} />}
            onClick={() => setConfirmRegenerate(true)}
            size='small'
          >
            Tạo lại API Key
          </Button>
        ) : (
          <div style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8 }}>
            <Typography variant='body2' color='warning.main' sx={{ mb: 1 }}>
              API key cũ sẽ ngừng hoạt động ngay lập tức. Site con sẽ cần cập nhật lại.
            </Typography>
            <Button
              variant='contained'
              color='warning'
              size='small'
              onClick={handleRegenerate}
              disabled={regenerateMutation.isPending}
              sx={{ mr: 1 }}
            >
              {regenerateMutation.isPending ? 'Đang xử lý...' : 'Xác nhận tạo lại'}
            </Button>
            <Button
              variant='tonal'
              color='secondary'
              size='small'
              onClick={() => setConfirmRegenerate(false)}
            >
              Hủy
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
