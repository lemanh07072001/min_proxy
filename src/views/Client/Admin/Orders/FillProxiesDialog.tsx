'use client'

import { useState, useRef } from 'react'

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Alert, Chip, Typography, Box
} from '@mui/material'
import { Upload, PlusCircle, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

import { useFillProxies } from '@/hooks/apis/useOrders'

interface FillProxiesDialogProps {
  order: any // { id, order_code, quantity, delivered_quantity, proxy_type, service_name }
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Dialog admin thêm proxy thủ công cho đơn thiếu (in_use_partial)
 *
 * Format nhập:
 *   Static không auth : ip:port           (vd: 1.2.3.4:8080)
 *   Static có auth    : ip:port:user:pass  (vd: 1.2.3.4:8080:alice:secret)
 *   Rotating key only : rotating_key_string
 *   Rotating + IP     : rotating_key ip:port  (cách nhau bằng space)
 */
export default function FillProxiesDialog({ order, onClose, onSuccess }: FillProxiesDialogProps) {
  const [inputText, setInputText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mutation = useFillProxies()

  const isRotating = order?.proxy_type?.toLowerCase?.() === 'rotating'
  const missing = (order?.quantity ?? 0) - (order?.delivered_quantity ?? 0)

  const parsedLines = inputText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l !== '')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return
    const reader = new FileReader()

    reader.onload = ev => {
      const text = ev.target?.result as string

      setInputText(prev => (prev ? prev + '\n' + text.trim() : text.trim()))
    }

    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSubmit = () => {
    if (parsedLines.length === 0) {
      toast.error('Chưa nhập proxy nào')

      return
    }

    mutation.mutate(
      { orderId: order.id, lines: parsedLines },
      {
        onSuccess: (data: any) => {
          toast.success(data?.message || 'Thêm proxy thành công')

          if (data?.data?.skipped?.length) {
            toast.warning(`${data.data.skipped.length} dòng bị bỏ qua do định dạng sai`)
          }

          onSuccess?.()
          onClose()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }

  return (
    <Dialog open onClose={onClose} maxWidth='sm' fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlusCircle size={20} />
          Thêm proxy thủ công
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Order info */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip label={`Đơn: ${order?.order_code}`} size='small' />
          <Chip label={`Dịch vụ: ${order?.service_name}`} size='small' variant='outlined' />
          <Chip
            label={`Thiếu: ${missing} proxy`}
            size='small'
            color='error'
          />
          <Chip
            label={isRotating ? 'Xoay' : 'Tĩnh'}
            size='small'
            color={isRotating ? 'info' : 'default'}
          />
        </Box>

        {/* Format hint */}
        <Alert severity='info' sx={{ mb: 2, fontSize: '12px' }}>
          {isRotating ? (
            <>
              <strong>Proxy xoay</strong> — mỗi dòng 1 proxy:<br />
              <code>rotating_key_string</code><br />
              <code>rotating_key_string ip:port</code> &nbsp;(nếu có IP trung gian)
            </>
          ) : (
            <>
              <strong>Proxy tĩnh</strong> — mỗi dòng 1 proxy:<br />
              <code>ip:port</code> &nbsp;(không có auth)<br />
              <code>ip:port:username:password</code> &nbsp;(có auth)
            </>
          )}
        </Alert>

        {/* Textarea */}
        <TextField
          multiline
          rows={10}
          fullWidth
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={isRotating
            ? 'abc123key\nabc456key 203.0.113.1:3128\n...'
            : '1.2.3.4:8080\n5.6.7.8:3128:user:pass\n...'
          }
          inputProps={{ style: { fontFamily: 'monospace', fontSize: '13px' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant='caption' color='text.secondary'>
            {parsedLines.length > 0
              ? `${parsedLines.length} dòng — tối đa ${missing} slot trống`
              : 'Nhập hoặc upload file .txt'}
          </Typography>
          <Button
            size='small'
            startIcon={<Upload size={14} />}
            onClick={() => fileInputRef.current?.click()}
            variant='outlined'
          >
            Upload .txt
          </Button>
          <input
            type='file'
            accept='.txt,text/plain'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color='inherit' disabled={mutation.isPending}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          disabled={mutation.isPending || parsedLines.length === 0}
          startIcon={<FileText size={16} />}
        >
          {mutation.isPending ? 'Đang lưu...' : `Thêm ${parsedLines.length > 0 ? parsedLines.length : ''} proxy`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
