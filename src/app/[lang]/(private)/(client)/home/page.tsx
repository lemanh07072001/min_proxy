'use client'

import { useState, useMemo, useEffect } from 'react'

import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Share2, Shield, Clock, X, ChevronLeft, ChevronRight, MessageCircle, Send, Youtube, ExternalLink } from 'lucide-react'
import { toast } from 'react-toastify'

import { useAnnouncements } from '@/hooks/apis/useAnnouncements'
import type { Announcement } from '@/hooks/apis/useAnnouncements'
import { useSidebarSettings } from '@/hooks/apis/useSidebarSettings'

const TYPE_MAP: Record<string, { label: string; color: string }> = {
  discount: { label: 'Giảm giá', color: '#22c55e' },
  new_product: { label: 'Sản phẩm mới', color: '#3b82f6' },
  price_change: { label: 'Thay đổi giá', color: '#f59e0b' },
  maintenance: { label: 'Bảo trì', color: '#ef4444' },
  general: { label: 'Chung', color: '#6b7280' }
}

function timeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

let _DOMPurify: any = null

function sanitize(html: string): string {
  if (typeof window === 'undefined') return ''

  if (!_DOMPurify) {
    _DOMPurify = require('dompurify')
  }

  return _DOMPurify.sanitize(html, {
    ADD_TAGS: ['img'],
    ADD_ATTR: ['src', 'alt', 'style', 'class']
  })
}

/* ─── Modal Cooldown (localStorage) ─── */
const MODAL_STORAGE_KEY = 'modal_announcements_dismissed'
const MODAL_COOLDOWN_MS = 30 * 60 * 1000 // 30 phút

function getDismissedMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(MODAL_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)

    // Xóa entries quá hạn
    const now = Date.now()
    const cleaned: Record<string, number> = {}

    for (const [id, ts] of Object.entries(parsed)) {
      if (typeof ts === 'number' && now - ts < MODAL_COOLDOWN_MS) {
        cleaned[id] = ts
      }
    }

    return cleaned
  } catch {
    return {}
  }
}

function dismissModals(ids: number[]) {
  const map = getDismissedMap()
  const now = Date.now()

  for (const id of ids) {
    map[String(id)] = now
  }

  localStorage.setItem(MODAL_STORAGE_KEY, JSON.stringify(map))
}

/* ─── Modal Popup Announcements ─── */
function ModalAnnouncements({ items }: { items: Announcement[] }) {
  const [open, setOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [pendingItems, setPendingItems] = useState<Announcement[]>([])

  useEffect(() => {
    if (typeof window === 'undefined' || items.length === 0) {
      setPendingItems([])

      return
    }

    const dismissed = getDismissedMap()
    const filtered = items.filter(item => !dismissed[String(item.id)])

    setPendingItems(filtered)

    if (filtered.length > 0) {
      setCurrentIdx(0)
      setDontShowAgain(false)
      setOpen(true)
    }
  }, [items])

  if (pendingItems.length === 0) return null

  const current = pendingItems[currentIdx]
  if (!current) return null

  const typeInfo = TYPE_MAP[current.type] || TYPE_MAP.general
  const html = sanitize(current.content)
  const hasMultiple = pendingItems.length > 1

  const handleClose = () => {
    if (dontShowAgain) {
      dismissModals(pendingItems.map(i => i.id))
    }

    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      closeAfterTransition={false}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 6 }}>
        <Chip
          label={typeInfo.label}
          size='small'
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: `${typeInfo.color}15`,
            color: typeInfo.color,
            border: `1px solid ${typeInfo.color}30`
          }}
        />
        <span style={{ fontSize: '16px', fontWeight: 700 }}>{current.title}</span>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          size='small'
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} />
          {timeAgo(current.published_at)}
        </div>
        <div
          className='announcement-content'
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={dontShowAgain}
              onChange={e => setDontShowAgain(e.target.checked)}
            />
          }
          label='Không hiển thị trong 30 phút'
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px', color: '#64748b' } }}
        />
        {hasMultiple ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              size='small'
              startIcon={<ChevronLeft size={16} />}
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(i => i - 1)}
            >
              Trước
            </Button>
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {currentIdx + 1} / {pendingItems.length}
            </span>
            <Button
              size='small'
              endIcon={<ChevronRight size={16} />}
              disabled={currentIdx === pendingItems.length - 1}
              onClick={() => setCurrentIdx(i => i + 1)}
            >
              Tiếp
            </Button>
          </div>
        ) : (
          <Button size='small' onClick={handleClose}>
            Đóng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

/* ─── Feed Post Card ─── */
function AnnouncementPost({ announcement }: { announcement: Announcement }) {
  const [showFull, setShowFull] = useState(false)
  const typeInfo = TYPE_MAP[announcement.type] || TYPE_MAP.general

  const sanitizedHTML = useMemo(() => sanitize(announcement.content), [announcement.content])
  const isLong = announcement.content.length > 500

  const handleShare = async () => {
    const textContent = announcement.content.replace(/<[^>]*>/g, '').trim()
    const shareText = `${announcement.title}\n\n${textContent}`

    if (navigator.share) {
      try {
        await navigator.share({ title: announcement.title, text: shareText })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      toast.success('Đã sao chép nội dung')
    }
  }

  return (
    <div className='announcement-post'>
      <div className='announcement-post-header'>
        <div className='announcement-avatar'>
          <Shield size={18} color='white' />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className='announcement-author'>Admin</span>
            <Chip
              label={typeInfo.label}
              size='small'
              sx={{
                height: '20px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: `${typeInfo.color}15`,
                color: typeInfo.color,
                border: `1px solid ${typeInfo.color}30`
              }}
            />
          </div>
          <div className='announcement-time'>
            <Clock size={12} />
            {timeAgo(announcement.published_at)}
          </div>
        </div>
      </div>

      <h3 className='announcement-post-title'>{announcement.title}</h3>

      <div
        className={`announcement-content ${isLong && !showFull ? 'announcement-content-collapsed' : ''}`}
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
      {isLong && !showFull && (
        <button className='announcement-see-more' onClick={() => setShowFull(true)}>
          Xem thêm
        </button>
      )}

      <div className='announcement-post-actions'>
        <button className='announcement-action-btn' onClick={handleShare}>
          <Share2 size={16} />
          Chia sẻ
        </button>
      </div>
    </div>
  )
}

/* ─── Sidebar Icon Map ─── */
const ICON_MAP: Record<string, typeof MessageCircle> = {
  zalo: MessageCircle,
  facebook: ExternalLink,
  telegram: Send,
  youtube: Youtube,
  other: ExternalLink
}

/* ─── Sidebar ─── */
function HomeSidebar() {
  const { data } = useSidebarSettings()

  const supportLinks = data?.support_links ?? []
  const youtubeVideos = data?.youtube_videos ?? []

  return (
    <div className='home-sidebar'>
      {supportLinks.length > 0 && (
        <div className='sidebar-card'>
          <h4 className='sidebar-card-title'>Bạn cần hỗ trợ?</h4>
          <div className='sidebar-links-grid'>
            {supportLinks.map(link => {
              const Icon = ICON_MAP[link.icon] || ExternalLink

              return (
                <a
                  key={link.label}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='sidebar-link-item'
                >
                  <div className='sidebar-link-icon' style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                    <Icon size={20} />
                  </div>
                  <span className='sidebar-link-label'>{link.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {youtubeVideos.length > 0 && (
        <div className='sidebar-card'>
          <h4 className='sidebar-card-title'>
            <Youtube size={18} style={{ color: '#ef4444' }} />
            Video hướng dẫn sử dụng
          </h4>
          <div className='sidebar-video-list'>
            {youtubeVideos.map(video => (
              <a
                key={video.title}
                href={video.url}
                target='_blank'
                rel='noopener noreferrer'
                className='sidebar-video-item'
              >
                <div className='sidebar-video-thumb'>
                  <Youtube size={24} />
                </div>
                <span className='sidebar-video-title'>{video.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Skeleton ─── */
function FeedSkeleton() {
  return (
    <div className='home-layout'>
      <div className='announcement-feed'>
        {[1, 2, 3].map(i => (
          <div key={i} className='announcement-post'>
            <div className='announcement-post-header'>
              <div className='announcement-skeleton' style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className='announcement-skeleton' style={{ width: 100, height: 14, borderRadius: 4 }} />
                <div className='announcement-skeleton' style={{ width: 80, height: 12, borderRadius: 4, marginTop: 6 }} />
              </div>
            </div>
            <div className='announcement-skeleton' style={{ width: '70%', height: 18, borderRadius: 4, margin: '12px 16px 8px' }} />
            <div className='announcement-skeleton' style={{ width: '90%', height: 60, borderRadius: 6, margin: '0 16px 16px' }} />
          </div>
        ))}
        <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
      <HomeSidebar />
    </div>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  const { data, isLoading } = useAnnouncements()

  if (isLoading) {
    return <FeedSkeleton />
  }

  const homeList = data?.home ?? []
  const modalList = data?.modal ?? []

  return (
    <>
      <ModalAnnouncements items={modalList} />

      <div className='home-layout'>
        <div className='announcement-feed'>
          {homeList.length > 0 ? (
            homeList.map(announcement => (
              <AnnouncementPost key={announcement.id} announcement={announcement} />
            ))
          ) : (
            <div className='announcement-post' style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
              <p style={{ fontSize: '15px' }}>Chưa có thông báo nào</p>
            </div>
          )}
        </div>

        <HomeSidebar />
      </div>
    </>
  )
}
