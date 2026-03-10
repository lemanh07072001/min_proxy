'use client'

import { useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { TICKET_TYPES, TICKET_TYPE_LABELS } from '@/constants'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import { useCreateTicket } from '@/hooks/apis/useTickets'
import { useHistoryOrders } from '@/hooks/apis/useHistoryOrders'
import { formatDateTimeLocal } from '@/utils/formatDate'

interface Props {
  open: boolean
  onClose: () => void
}

// Các loại ticket cần chọn đơn hàng (bắt buộc)
const ORDER_REQUIRED_TYPES = [TICKET_TYPES.PARTIAL_PROXY, TICKET_TYPES.PROXY_ISSUE, TICKET_TYPES.REFUND_REQUEST]

export default function CreateTicketDialog({ open, onClose }: Props) {
  const [type, setType] = useState<string>(TICKET_TYPES.OTHER)
  const [orderId, setOrderId] = useState<string>('')
  const [message, setMessage] = useState('')

  const createTicket = useCreateTicket()

  const needsOrder = ORDER_REQUIRED_TYPES.includes(type as any)
  const { data: orders = [], isLoading: ordersLoading } = useHistoryOrders()

  const selectedOrder = orderId ? (orders as any[]).find((o: any) => String(o.id) === orderId) : null

  const handleTypeChange = (newType: string) => {
    setType(newType)

    // Xoá đơn hàng đã chọn khi đổi sang loại không cần
    if (!ORDER_REQUIRED_TYPES.includes(newType as any)) {
      setOrderId('')
    }
  }

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error('Vui lòng nhập nội dung')
      
return
    }

    if (needsOrder && !orderId) {
      toast.error('Vui lòng chọn đơn hàng liên quan')
      
return
    }

    createTicket.mutate(
      {
        type,
        message: message.trim(),
        ...(orderId ? { order_id: Number(orderId) } : {})
      },
      {
        onSuccess: () => {
          toast.success('Tạo ticket thành công!')
          setType(TICKET_TYPES.OTHER)
          setOrderId('')
          setMessage('')
          onClose()
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    )
  }

  const handleClose = () => {
    if (!createTicket.isPending) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        Tạo yêu cầu hỗ trợ
        <IconButton size='small' onClick={handleClose}>
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <CustomTextField
          select
          fullWidth
          label='Loại yêu cầu'
          value={type}
          onChange={e => handleTypeChange(e.target.value)}
          size='small'
        >
          {Object.entries(TICKET_TYPE_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </CustomTextField>

        {/* Chỉ hiện chọn đơn hàng khi loại ticket liên quan đến đơn */}
        {needsOrder && (
          <>
            {ordersLoading ? (
              <div style={{ fontSize: '13px', color: '#94a3b8', padding: '8px 0' }}>Đang tải danh sách đơn hàng...</div>
            ) : (orders as any[]).length === 0 ? (
              <div style={{ fontSize: '13px', color: '#ef4444', padding: '8px 12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                Bạn chưa có đơn hàng nào. Vui lòng chọn loại &quot;Khác&quot; để gửi yêu cầu hỗ trợ chung.
              </div>
            ) : (
              <CustomTextField
                select
                fullWidth
                label='Đơn hàng liên quan *'
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                size='small'
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value=''>
                  <em>— Chọn đơn hàng —</em>
                </MenuItem>
                {(orders as any[]).map((order: any) => (
                  <MenuItem key={order.id} value={String(order.id)}>
                    <ListItemText
                      primary={order.order_code}
                      secondary={`SL: ${order.quantity} · ${formatDateTimeLocal(order.buy_at)}`}
                      primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
                      secondaryTypographyProps={{ fontSize: '12px' }}
                    />
                    <Chip
                      label={ORDER_STATUS_LABELS[order.status] || '?'}
                      color={(ORDER_STATUS_COLORS[order.status] || 'default') as any}
                      size='small'
                      sx={{ ml: 1, height: '22px', fontSize: '11px' }}
                    />
                  </MenuItem>
                ))}
              </CustomTextField>
            )}

            {/* Chi tiết đơn hàng đã chọn */}
            {selectedOrder && (
              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{selectedOrder.order_code}</span>
                  <Chip
                    label={ORDER_STATUS_LABELS[selectedOrder.status] || '?'}
                    color={(ORDER_STATUS_COLORS[selectedOrder.status] || 'default') as any}
                    size='small'
                    sx={{ height: '22px', fontSize: '11px' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  SL: {selectedOrder.quantity} proxy
                  {selectedOrder.delivered_quantity != null && selectedOrder.delivered_quantity < selectedOrder.quantity && (
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>
                      {' '}(thiếu {selectedOrder.quantity - selectedOrder.delivered_quantity})
                    </span>
                  )}
                  {' · '}Giá: {new Intl.NumberFormat('vi-VN').format(selectedOrder.total_amount)}đ
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  Mua: {formatDateTimeLocal(selectedOrder.buy_at)}
                  {selectedOrder.expired_at && ` · HH: ${formatDateTimeLocal(selectedOrder.expired_at)}`}
                </div>
              </div>
            )}
          </>
        )}

        <CustomTextField
          fullWidth
          multiline
          rows={4}
          label='Nội dung'
          placeholder='Mô tả chi tiết vấn đề bạn gặp phải...'
          value={message}
          onChange={e => setMessage(e.target.value)}
          inputProps={{ maxLength: 2000 }}
          helperText={`${message.length}/2000`}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color='inherit' disabled={createTicket.isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={createTicket.isPending || !message.trim() || (needsOrder && !orderId)}
          startIcon={createTicket.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          sx={{ color: '#fff' }}
        >
          {createTicket.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
