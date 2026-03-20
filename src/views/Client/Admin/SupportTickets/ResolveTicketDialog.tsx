'use client'

import { useState, useRef } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { X, Loader2, ShieldCheck, UserCheck, Send, Image as ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { TICKET_STATUS, TICKET_STATUS_LABELS, TICKET_STATUS_COLORS, TICKET_TYPE_LABELS } from '@/constants/ticketStatus'
import { ORDER_STATUS_LABELS_ADMIN, ORDER_STATUS_COLORS } from '@/constants/orderStatus'
import { useResolveTicket, useAdminReply } from '@/hooks/apis/useTickets'
import { formatDateTimeLocal } from '@/utils/formatDate'

function resolveUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '')

  return apiBase ? `${apiBase}${path}` : path
}

interface Props {
  open: boolean
  onClose: () => void
  ticket: any
}

export default function ResolveTicketDialog({ open, onClose, ticket }: Props) {
  const [adminNote, setAdminNote] = useState('')
  const [status, setStatus] = useState<number>(TICKET_STATUS.RESOLVED)
  const [replyText, setReplyText] = useState('')
  const [replyImage, setReplyImage] = useState<File | null>(null)
  const [replyPreview, setReplyPreview] = useState('')
  const [fullImage, setFullImage] = useState('')
  const [localReplies, setLocalReplies] = useState<any[]>([])

  // Reset local replies khi ticket đổi
  const ticketId = ticket?.id
  const [prevTicketId, setPrevTicketId] = useState<number | null>(null)

  if (ticketId && ticketId !== prevTicketId) {
    setPrevTicketId(ticketId)
    setLocalReplies([])
  }
  const fileRef = useRef<HTMLInputElement>(null)

  const resolveTicket = useResolveTicket()
  const adminReply = useAdminReply()

  if (!ticket) return null

  // Merge server replies + local (mới gửi, chưa invalidate)
  const serverReplies = ticket.replies || []
  const serverIds = new Set(serverReplies.map((r: any) => r.id))
  const replies = [...serverReplies, ...localReplies.filter(r => !serverIds.has(r.id))]
  const isClosed = [TICKET_STATUS.RESOLVED, TICKET_STATUS.CLOSED, TICKET_STATUS.REJECTED].includes(ticket.status)

  const handleReply = () => {
    if (!replyText.trim()) return
    const formData = new FormData()

    formData.append('message', replyText.trim())

    if (replyImage) formData.append('image', replyImage)

    adminReply.mutate({ ticketId: ticket.id, data: formData }, {
      onSuccess: (res: any) => {
        const newReply = res?.data

        if (newReply) {
          setLocalReplies(prev => [...prev, newReply])
        }

        setReplyText('')
        setReplyImage(null)
        setReplyPreview('')
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Lỗi')
    })
  }

  const handleResolve = () => {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <span>
          {ticket.ticket_code}
          <Chip label={TICKET_STATUS_LABELS[ticket.status] || '?'} color={(TICKET_STATUS_COLORS[ticket.status] || 'default') as any} size='small' sx={{ ml: 1, height: 22, fontSize: '11px' }} />
        </span>
        <IconButton size='small' onClick={onClose}><X size={18} /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <div style={{ display: 'flex', height: '60vh' }}>
          {/* Left: ticket info */}
          <div style={{ width: 300, borderRight: '1px solid #e2e8f0', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {TICKET_TYPE_LABELS[ticket.type] || ticket.type} · {formatDateTimeLocal(ticket.created_at)}
            </div>
            {ticket.user && (
              <div style={{ fontSize: '13px' }}>
                <strong>{ticket.user.name}</strong>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{ticket.user.email}</div>
                {ticket.user.sodu !== undefined && (
                  <div style={{ fontSize: '12px', color: '#3b82f6' }}>Số dư: {Number(ticket.user.sodu).toLocaleString('vi-VN')}đ</div>
                )}
              </div>
            )}
            {ticket.deposit && (
              <div style={{ padding: '8px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>Lệnh nạp #{ticket.deposit.id}</div>
                <div>{Number(ticket.deposit.amount).toLocaleString('vi-VN')}đ</div>
                {ticket.deposit.transaction_code && <div>{ticket.deposit.transaction_code}</div>}
                <div style={{ color: '#64748b' }}>{formatDateTimeLocal(ticket.deposit.created_at)}</div>
              </div>
            )}
            {ticket.order && (
              <div style={{ padding: '8px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '12px' }}>
                <div style={{ fontWeight: 600 }}>{ticket.order.order_code}</div>
                <div>Proxy: {ticket.order.delivered_quantity ?? '?'}/{ticket.order.quantity}</div>
                <Chip
                  label={ORDER_STATUS_LABELS_ADMIN[ticket.order.status] || '?'}
                  color={(ORDER_STATUS_COLORS[ticket.order.status] || 'default') as any}
                  size='small' sx={{ mt: 0.5, height: 20, fontSize: '10px' }}
                />
              </div>
            )}
            {ticket.image_url && (
              <img src={resolveUrl(ticket.image_url)} alt='' style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setFullImage(resolveUrl(ticket.image_url))} />
            )}

            {/* Resolve form */}
            {!isClosed && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 'auto' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: 6 }}>Đóng ticket</div>
                <CustomTextField
                  fullWidth multiline rows={2} size='small'
                  label='Ghi chú'
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <CustomTextField
                  select fullWidth size='small'
                  label='Trạng thái'
                  value={status}
                  onChange={e => setStatus(Number(e.target.value))}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value={TICKET_STATUS.RESOLVED}>Đã giải quyết</MenuItem>
                  <MenuItem value={TICKET_STATUS.REJECTED}>Từ chối</MenuItem>
                  <MenuItem value={TICKET_STATUS.CLOSED}>Đóng</MenuItem>
                </CustomTextField>
                <Button
                  fullWidth size='small' variant='contained' color='success'
                  onClick={handleResolve}
                  disabled={resolveTicket.isPending || !adminNote.trim()}
                  startIcon={resolveTicket.isPending ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  sx={{ color: '#fff', textTransform: 'none' }}
                >
                  {resolveTicket.isPending ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
              </div>
            )}
          </div>

          {/* Right: conversation thread */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
              {/* Original message */}
              <div style={{ marginBottom: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, marginBottom: 4 }}>
                  {ticket.user?.name || 'User'} · {formatDateTimeLocal(ticket.created_at)}
                </div>
                <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{ticket.message}</p>
              </div>

              {/* Legacy admin_note */}
              {ticket.admin_note && replies.length === 0 && (
                <div style={{ marginBottom: 12, padding: '10px 12px', background: '#f0fdf4', borderRadius: 10 }}>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>
                    Admin{ticket.resolved_by_user ? ` · ${ticket.resolved_by_user.name}` : ''} · {formatDateTimeLocal(ticket.resolved_at)}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap' }}>{ticket.admin_note}</p>
                </div>
              )}

              {/* Replies — chat bubble style */}
              {replies.map((r: any) => (
                <div key={r.id} style={{ display: 'flex', justifyContent: r.is_admin ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    maxWidth: '80%', padding: '8px 12px',
                    background: r.is_admin ? '#dcfce7' : '#f1f5f9',
                    borderRadius: r.is_admin ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, fontSize: '11px' }}>
                      {r.is_admin ? <ShieldCheck size={11} style={{ color: '#16a34a' }} /> : <UserCheck size={11} style={{ color: '#3b82f6' }} />}
                      <strong style={{ color: r.is_admin ? '#16a34a' : '#3b82f6' }}>{r.user?.name || (r.is_admin ? 'Admin' : 'User')}</strong>
                      <span style={{ color: '#94a3b8' }}>{formatDateTimeLocal(r.created_at)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{r.message}</p>
                    {r.image_url && (
                      <img src={resolveUrl(r.image_url)} alt='' style={{ maxHeight: 120, borderRadius: 8, marginTop: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }} onClick={() => setFullImage(resolveUrl(r.image_url))} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin reply input */}
            {!isClosed && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#fafbfc' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder='Phản hồi cho khách hàng...'
                    maxLength={2000}
                    style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <IconButton size='small' onClick={() => fileRef.current?.click()} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }} title='Đính kèm ảnh'>
                      <ImageIcon size={16} />
                    </IconButton>
                    <Button size='small' variant='contained' onClick={handleReply} disabled={adminReply.isPending || !replyText.trim()} sx={{ minWidth: 36, p: '6px', color: '#fff' }}>
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
                {replyPreview && (
                  <div style={{ position: 'relative', display: 'inline-block', marginTop: 8 }}>
                    <img src={replyPreview} alt='' style={{ maxHeight: 80, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                    <IconButton size='small' onClick={() => { setReplyImage(null); setReplyPreview('') }} sx={{ position: 'absolute', top: -6, right: -6, bgcolor: '#fff', border: '1px solid #e2e8f0', width: 20, height: 20 }}>
                      <Trash2 size={10} />
                    </IconButton>
                  </div>
                )}
                <input ref={fileRef} type='file' hidden accept='image/png,image/jpeg,image/jpg,image/gif,image/webp' onChange={e => {
                  const f = e.target.files?.[0]

                  if (f) {
                    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

                    if (!allowed.includes(f.type)) { toast.error('Chỉ chấp nhận ảnh PNG, JPG, GIF, WebP'); e.target.value = ''; return }
                    if (f.size > 2 * 1024 * 1024) { toast.error('Ảnh tối đa 2MB'); e.target.value = ''; return }
                    setReplyImage(f); setReplyPreview(URL.createObjectURL(f))
                  }
                  e.target.value = ''
                }} />
              </div>
            )}
          </div>
        </div>

        {/* Image fullscreen overlay */}
        {fullImage && (
          <div
            onClick={() => setFullImage('')}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <img src={fullImage} alt='' style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
