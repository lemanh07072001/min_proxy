'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { X, Clock3, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_TYPE_LABELS } from '@/constants'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants/orderStatus'

interface Props {
  open: boolean
  onClose: () => void
  ticket: any
}

export default function TicketDetailDialog({ open, onClose, ticket }: Props) {
  if (!ticket) return null

  const statusLabel = TICKET_STATUS_LABELS[ticket.status] || 'Không xác định'
  const statusColor = TICKET_STATUS_COLORS[ticket.status] || 'default'

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        Chi tiết ticket
        <IconButton size='small' onClick={onClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{ticket.ticket_code}</span>
            <Chip label={statusLabel} color={statusColor as any} size='small' />
          </div>

          {/* Type */}
          <div>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Loại yêu cầu</span>
            <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{TICKET_TYPE_LABELS[ticket.type] || ticket.type}</p>
          </div>

          {/* Order */}
          {ticket.order && (
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Đơn hàng liên quan</span>
                <Chip
                  label={ORDER_STATUS_LABELS[ticket.order.status] || '?'}
                  color={(ORDER_STATUS_COLORS[ticket.order.status] || 'default') as any}
                  size='small'
                  sx={{ height: '22px', fontSize: '11px' }}
                />
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600 }}>{ticket.order.order_code}</p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
                Proxy: {ticket.order.delivered_quantity ?? '?'}/{ticket.order.quantity}
                {ticket.order.delivered_quantity != null && ticket.order.delivered_quantity < ticket.order.quantity && (
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>
                    {' '}(thiếu {ticket.order.quantity - ticket.order.delivered_quantity})
                  </span>
                )}
              </p>
              {ticket.order.total_amount && (
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Tổng: {new Intl.NumberFormat('vi-VN').format(ticket.order.total_amount)}đ
                </p>
              )}
            </div>
          )}

          {/* Message */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MessageSquare size={14} style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Nội dung</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ticket.message}</p>
          </div>

          {/* Admin response */}
          {ticket.admin_note && (
            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Phản hồi từ admin</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{ticket.admin_note}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                {ticket.resolved_by_user && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={12} />
                    <span>Xử lý bởi: {ticket.resolved_by_user.name}</span>
                  </div>
                )}
                {ticket.resolved_at && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock3 size={12} />
                    <span>Lúc: {formatDateTimeLocal(ticket.resolved_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tracking info */}
          {(ticket.assigned_to_user || ticket.processing_by_user) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b' }}>
              {ticket.assigned_to_user && (
                <span>Phụ trách: <strong>{ticket.assigned_to_user.name}</strong></span>
              )}
              {ticket.processing_by_user && (
                <span>Nhận xử lý: <strong>{ticket.processing_by_user.name}</strong>{ticket.processing_at && ` (${formatDateTimeLocal(ticket.processing_at)})`}</span>
              )}
            </div>
          )}

          {/* Created at */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
            <Clock3 size={12} />
            <span>Tạo lúc: {formatDateTimeLocal(ticket.created_at)}</span>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant='contained' sx={{ color: '#fff' }}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
