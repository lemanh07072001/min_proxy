'use client'

import { useState, useEffect, useRef } from 'react'

import { Button, TextField, IconButton, Tooltip } from '@mui/material'
import { Settings, Plus, Trash2, Save, Loader2, Upload, Palette } from 'lucide-react'
import { toast } from 'react-toastify'

import { useSidebarSettings, useUpdateSidebarSettings } from '@/hooks/apis/useSidebarSettings'
import type { SupportLink, YoutubeVideo } from '@/hooks/apis/useSidebarSettings'
import { useBrandingSettings, useUpdateBrandingSettings } from '@/hooks/apis/useBrandingSettings'
import type { BrandingSettings } from '@/hooks/apis/useBrandingSettings'
import useAxiosAuth from '@/hocs/useAxiosAuth'

const ICON_OPTIONS = [
  { value: 'zalo', label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'youtube', label: 'Youtube' },
  { value: 'other', label: 'Khác' }
]

const emptySupportLink: SupportLink = { label: '', url: '', icon: 'other', color: '#3b82f6' }
const emptyVideo: YoutubeVideo = { title: '', url: '' }

const defaultBranding: BrandingSettings = {
  site_name: '',
  site_description: '',
  logo_url: '',
  favicon_url: '',
  primary_color: '#FC4336',
  primary_hover: '#e63946',
  primary_gradient: 'linear-gradient(45deg, #FC4336, #F88A4B)',
}

export default function SiteSettingsForm() {
  const axiosAuth = useAxiosAuth()
  const { data: sidebarData, isLoading: loadingSidebar } = useSidebarSettings()
  const { data: brandingData, isLoading: loadingBranding } = useBrandingSettings()
  const updateSidebarMutation = useUpdateSidebarSettings()
  const updateBrandingMutation = useUpdateBrandingSettings()

  const [supportLinks, setSupportLinks] = useState<SupportLink[]>([])
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([])
  const [branding, setBranding] = useState<BrandingSettings>({ ...defaultBranding })

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sidebarData) {
      setSupportLinks(sidebarData.support_links.length > 0 ? sidebarData.support_links : [{ ...emptySupportLink }])
      setYoutubeVideos(sidebarData.youtube_videos.length > 0 ? sidebarData.youtube_videos : [{ ...emptyVideo }])
    }
  }, [sidebarData])

  useEffect(() => {
    if (brandingData) {
      setBranding({
        site_name: brandingData.site_name || '',
        site_description: brandingData.site_description || '',
        logo_url: brandingData.logo_url || '',
        favicon_url: brandingData.favicon_url || '',
        primary_color: brandingData.primary_color || '#FC4336',
        primary_hover: brandingData.primary_hover || '#e63946',
        primary_gradient: brandingData.primary_gradient || 'linear-gradient(45deg, #FC4336, #F88A4B)',
      })
    }
  }, [brandingData])

  const handleImageUpload = async (file: File, field: 'logo_url' | 'favicon_url') => {
    const formData = new FormData()

    formData.append('image', file)
    formData.append('folder', 'branding')

    try {
      const res = await axiosAuth.post('/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data.success) {
        setBranding(prev => ({ ...prev, [field]: res.data.url }))
        toast.success('Upload thành công')
      }
    } catch {
      toast.error('Lỗi upload ảnh')
    }
  }

  const handleSave = async () => {
    const validLinks = supportLinks.filter(l => l.label.trim() && l.url.trim())
    const validVideos = youtubeVideos.filter(v => v.title.trim() && v.url.trim())

    const isSaving = updateSidebarMutation.isPending || updateBrandingMutation.isPending

    if (isSaving) return

    try {
      await Promise.all([
        updateSidebarMutation.mutateAsync({
          support_links: validLinks,
          youtube_videos: validVideos
        }),
        updateBrandingMutation.mutateAsync(branding),
      ])
      toast.success('Lưu cấu hình thành công')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const updateLink = (idx: number, field: keyof SupportLink, value: string) => {
    setSupportLinks(prev => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  }

  const updateVideo = (idx: number, field: keyof YoutubeVideo, value: string) => {
    setYoutubeVideos(prev => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)))
  }

  const updateBrandingField = (field: keyof BrandingSettings, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }))
  }

  const isPending = updateSidebarMutation.isPending || updateBrandingMutation.isPending

  if (loadingSidebar || loadingBranding) {
    return (
      <div className='orders-content'>
        <div className='table-container' style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
          Đang tải...
        </div>
      </div>
    )
  }

  return (
    <div className='orders-content'>
      <div className='table-container'>
        <div className='table-toolbar'>
          <div className='header-left'>
            <div className='page-icon'>
              <Settings size={17} />
            </div>
            <h5 style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>Cấu hình trang chủ</h5>
          </div>
          <div className='header-right'>
            <Button
              onClick={handleSave}
              variant='contained'
              size='small'
              startIcon={isPending ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
              disabled={isPending}
              sx={{
                background: 'linear-gradient(45deg, #fc4336, #f88a4b)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(252, 67, 54, 0.3)',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e53e2f, #e07840)',
                  boxShadow: '0 6px 16px rgba(252, 67, 54, 0.4)'
                }
              }}
            >
              {isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
            </Button>
          </div>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* ========== Branding Section ========== */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Palette size={18} style={{ color: '#6366f1' }} />
              <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Thương hiệu
              </h6>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>— Thay đổi tên, logo, màu sắc site</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Row 1: Name + Description */}
              <div style={{ display: 'flex', gap: 12 }}>
                <TextField
                  size='small'
                  label='Tên site'
                  value={branding.site_name}
                  onChange={e => updateBrandingField('site_name', e.target.value)}
                  placeholder='VD: MKT Proxy'
                  sx={{ flex: 1 }}
                />
                <TextField
                  size='small'
                  label='Mô tả ngắn'
                  value={branding.site_description}
                  onChange={e => updateBrandingField('site_description', e.target.value)}
                  placeholder='VD: Dịch vụ Proxy Chất Lượng Cao'
                  sx={{ flex: 2 }}
                />
              </div>

              {/* Row 2: Logo + Favicon */}
              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Logo</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {branding.logo_url && (
                      <img
                        src={branding.logo_url}
                        alt='Logo'
                        style={{ maxHeight: 40, maxWidth: 160, objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 6, padding: 4 }}
                      />
                    )}
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<Upload size={14} />}
                      onClick={() => logoInputRef.current?.click()}
                      sx={{ textTransform: 'none', fontSize: '12px' }}
                    >
                      {branding.logo_url ? 'Thay logo' : 'Upload logo'}
                    </Button>
                    <input
                      ref={logoInputRef}
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={e => {
                        const file = e.target.files?.[0]

                        if (file) handleImageUpload(file, 'logo_url')
                        e.target.value = ''
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Favicon</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {branding.favicon_url && (
                      <img
                        src={branding.favicon_url}
                        alt='Favicon'
                        style={{ width: 32, height: 32, objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: 6, padding: 2 }}
                      />
                    )}
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<Upload size={14} />}
                      onClick={() => faviconInputRef.current?.click()}
                      sx={{ textTransform: 'none', fontSize: '12px' }}
                    >
                      {branding.favicon_url ? 'Thay favicon' : 'Upload favicon'}
                    </Button>
                    <input
                      ref={faviconInputRef}
                      type='file'
                      hidden
                      accept='image/*'
                      onChange={e => {
                        const file = e.target.files?.[0]

                        if (file) handleImageUpload(file, 'favicon_url')
                        e.target.value = ''
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Colors */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Màu chủ đạo</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type='color'
                      value={branding.primary_color || '#FC4336'}
                      onChange={e => updateBrandingField('primary_color', e.target.value)}
                      style={{ width: 36, height: 36, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                    />
                    <TextField
                      size='small'
                      value={branding.primary_color}
                      onChange={e => updateBrandingField('primary_color', e.target.value)}
                      sx={{ width: 100 }}
                      slotProps={{ input: { style: { fontSize: '13px' } } }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: 6 }}>Màu hover</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type='color'
                      value={branding.primary_hover || '#e63946'}
                      onChange={e => updateBrandingField('primary_hover', e.target.value)}
                      style={{ width: 36, height: 36, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                    />
                    <TextField
                      size='small'
                      value={branding.primary_hover}
                      onChange={e => updateBrandingField('primary_hover', e.target.value)}
                      sx={{ width: 100 }}
                      slotProps={{ input: { style: { fontSize: '13px' } } }}
                    />
                  </div>
                </div>
                <TextField
                  size='small'
                  label='Gradient'
                  value={branding.primary_gradient}
                  onChange={e => updateBrandingField('primary_gradient', e.target.value)}
                  placeholder='linear-gradient(45deg, #FC4336, #F88A4B)'
                  sx={{ flex: 1 }}
                  slotProps={{ input: { style: { fontSize: '13px' } } }}
                />
                {/* Live preview */}
                <div
                  style={{
                    width: 80,
                    height: 36,
                    borderRadius: 8,
                    background: branding.primary_gradient || 'linear-gradient(45deg, #FC4336, #F88A4B)',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0,
                  }}
                  title='Preview gradient'
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div style={{ borderTop: '1px solid #e2e8f0' }} />

          {/* ========== Support Links ========== */}
          <div>
            <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
              Liên kết hỗ trợ (hiển thị sidebar trang chủ)
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {supportLinks.map((link, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <TextField
                    size='small'
                    label='Tên'
                    value={link.label}
                    onChange={e => updateLink(idx, 'label', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size='small'
                    label='URL'
                    value={link.url}
                    onChange={e => updateLink(idx, 'url', e.target.value)}
                    sx={{ flex: 2 }}
                  />
                  <TextField
                    size='small'
                    select
                    label='Icon'
                    value={link.icon}
                    onChange={e => updateLink(idx, 'icon', e.target.value)}
                    sx={{ width: 120 }}
                    slotProps={{ select: { native: true } }}
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </TextField>
                  <TextField
                    size='small'
                    type='color'
                    label='Màu'
                    value={link.color}
                    onChange={e => updateLink(idx, 'color', e.target.value)}
                    sx={{ width: 80 }}
                  />
                  <Tooltip title='Xóa'>
                    <IconButton
                      size='small'
                      onClick={() => setSupportLinks(prev => prev.filter((_, i) => i !== idx))}
                      sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
              <Button
                size='small'
                variant='outlined'
                startIcon={<Plus size={16} />}
                onClick={() => setSupportLinks(prev => [...prev, { ...emptySupportLink }])}
                sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: '13px' }}
              >
                Thêm liên kết
              </Button>
            </div>
          </div>

          {/* ========== YouTube Videos ========== */}
          <div>
            <h6 style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: 12 }}>
              Video hướng dẫn YouTube
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {youtubeVideos.map((video, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <TextField
                    size='small'
                    label='Tiêu đề'
                    value={video.title}
                    onChange={e => updateVideo(idx, 'title', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size='small'
                    label='URL YouTube'
                    value={video.url}
                    onChange={e => updateVideo(idx, 'url', e.target.value)}
                    sx={{ flex: 2 }}
                  />
                  <Tooltip title='Xóa'>
                    <IconButton
                      size='small'
                      onClick={() => setYoutubeVideos(prev => prev.filter((_, i) => i !== idx))}
                      sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', backgroundColor: '#fef2f2' } }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
              <Button
                size='small'
                variant='outlined'
                startIcon={<Plus size={16} />}
                onClick={() => setYoutubeVideos(prev => [...prev, { ...emptyVideo }])}
                sx={{ alignSelf: 'flex-start', textTransform: 'none', fontSize: '13px' }}
              >
                Thêm video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
