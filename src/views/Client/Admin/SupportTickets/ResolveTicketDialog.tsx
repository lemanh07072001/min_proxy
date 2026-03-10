'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { TICKET_STATUS, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_TYPE_LABELS } from '@/constants'
import { ORDER_STATUS_LABELS_ADMIN, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import { useResolveTicket } from '@/hooks/apis/useTickets'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface Props {
  open: boolean
  onClose: () => void
  ticket: any
}

export default function ResolveTicketDialog({ open, onClose, ticket }: Props) {
  const [adminNote, setAdminNote] = useState('')
  const [status, setStatus] = useState<number>(TICKET_STATUS.RESOLVED)

  const resolveTicket = useResolveTicket()

  const handleSubmit = () => {
    if (!adminNote.trim()) {
      toast.error('Vui lòng nhập ghi chú xử lý')
      
return
    }

    resolveTicket.mutate(
      { id: ticket.id, admin_note: adminNote.trim(), status },
      {
        onSuccess: () => {
          toast.success('Đã xử lý ticket!')
          setAdminNote('')
          setStatus(TICKET_STATUS.RESOLVED)
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }

  if (!ticket) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        Xử lý ticket
        <IconButton size='small' onClick={onClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {/* Ticket info */}
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600 }}>{ticket.ticket_code}</span>
            <Chip
              label={TICKET_STATUS_LABELS[ticket.status] || '?'}
              color={(TICKET_STATUS_COLORS[ticket.status] || 'default') as any}
              size='small'
            />
          </div>
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>
            Loại: {TICKET_TYPE_LABELS[ticket.type] || ticket.type}
          </p>
          {ticket.user && (
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>
              User: {ticket.user.name} ({ticket.user.email})
            </p>
          )}
          {ticket.order && (
            <div style={{ margin: '4px 0', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Đơn: {ticket.order.order_code}</span>
                <Chip
                  label={ORDER_STATUS_LABELS_ADMIN[ticket.order.status] || '?'}
                  color={(ORDER_STATUS_COLORS[ticket.order.status] || 'default') as any}
                  size='small'
                  sx={{ height: '20px', fontSize: '11px' }}
                />
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Proxy: {ticket.order.delivered_quantity ?? '?'}/{ticket.order.quantity}
                {ticket.order.delivered_quantity != null && ticket.order.delivered_quantity < ticket.order.quantity && (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>
                    {' '}(thiếu {ticket.order.quantity - ticket.order.delivered_quantity})
                  </span>
                )}
              </p>
            </div>
          )}
          <p style={{ margin: '4px 0', fontSize: '13px', color: '#64748b' }}>
            Tạo lúc: {formatDateTimeLocal(ticket.created_at)}
          </p>
          {(ticket.assigned_to_user || ticket.processing_by_user) && (
            <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ticket.assigned_to_user && (
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Phụ trách: <strong>{ticket.assigned_to_user.name}</strong>
                </span>
              )}
              {ticket.processing_by_user && (
                <span style={{ fontSize: '12px', color: '#3b82f6' }}>
                  Nhận xử lý: <strong>{ticket.processing_by_user.name}</strong>
                  {ticket.processing_at && ` (${formatDateTimeLocal(ticket.processing_at)})`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* User message */}
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Nội dung từ user</span>
          <p style={{ margin: '4px 0', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{ticket.message}</p>
        </div>

        {/* Admin note */}
        <CustomTextField
          fullWidth
          multiline
          rows={3}
          label='Ghi chú xử lý'
          placeholder='Nhập ghi chú xử lý cho ticket này...'
          value={adminNote}
          onChange={e => setAdminNote(e.target.value)}
          inputProps={{ maxLength: 2000 }}
        />

        {/* Status */}
        <CustomTextField
          select
          fullWidth
          label='Trạng thái'
          value={status}
          onChange={e => setStatus(Number(e.target.value))}
          size='small'
        >
          <MenuItem value={TICKET_STATUS.RESOLVED}>Đã giải quyết</MenuItem>
          <MenuItem value={TICKET_STATUS.CLOSED}>Đóng</MenuItem>
        </CustomTextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color='inherit' disabled={resolveTicket.isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='success'
          disabled={resolveTicket.isPending || !adminNote.trim()}
          startIcon={resolveTicket.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          sx={{ color: '#fff' }}
        >
          {resolveTicket.isPending ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
