'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Grid2 from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import { Plus, Trash2, Upload, ExternalLink } from 'lucide-react'

import { toast } from 'react-toastify'

import DialogCloseButton from '@/components/modals/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { useCreatePartner, useUpdatePartner, usePartners } from '@/hooks/apis/usePartners'

// ═══ Chuẩn ảnh ═══
const BANNER_SPECS = {
  maxWidth: 200,
  maxHeight: 60,
  recommendedHeight: 30,
  maxFileSize: 512 * 1024,
  acceptedFormats: ['image/png', 'image/svg+xml', 'image/webp'],
  acceptedExtensions: '.png,.svg,.webp',
  label: 'Logo banner (header)',
  description: 'Ảnh nhỏ, dài ngang, hiển thị trên thanh cuộn header. Cao ~22px khi render.'
}

const LANDING_SPECS = {
  maxWidth: 300,
  maxHeight: 120,
  recommendedHeight: 80,
  maxFileSize: 1024 * 1024,
  acceptedFormats: ['image/png', 'image/svg+xml', 'image/webp', 'image/jpeg'],
  acceptedExtensions: '.png,.svg,.webp,.jpg,.jpeg',
  label: 'Logo landing page',
  description: 'Ảnh lớn hơn, hiển thị trong grid đối tác trên trang chủ. Nên ~160x80px, nền trong suốt.'
}

// Chuyển text → slug (viết thường, không dấu, cách bởi -)
function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface LogoState {
  file: File | null
  preview: string | null
  warning: string | null
  dimensions: { w: number; h: number } | null
}

const initialLogoState: LogoState = { file: null, preview: null, warning: null, dimensions: null }

interface PartnerFormModalProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
  partnerData?: any
}

export default function PartnerFormModal({ open, onClose, type, partnerData }: PartnerFormModalProps) {
  const createMutation = useCreatePartner()
  const updateMutation = useUpdatePartner(partnerData?.id)
  const { data: allPartners } = usePartners()

  const [descriptions, setDescriptions] = useState<string[]>([''])
  const [bannerLogo, setBannerLogo] = useState<LogoState>(initialLogoState)
  const [landingLogo, setLandingLogo] = useState<LogoState>(initialLogoState)

  const [bannerFilename, setBannerFilename] = useState('')
  const [landingFilename, setLandingFilename] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      subtitle: '',
      link: '',
      order: '0',
      status: 'active',
      display_duration: '2'
    }
  })

  const watchName = watch('name')
  const watchLink = watch('link')

  useEffect(() => {
    if (open && type === 'edit' && partnerData) {
      reset({
        name: partnerData.name || '',
        subtitle: partnerData.subtitle || '',
        link: partnerData.link || '',
        order: String(partnerData.order ?? 0),
        status: partnerData.status || 'active',
        display_duration: String(partnerData.display_duration ?? 2)
      })
      setDescriptions(partnerData.description?.length ? partnerData.description : [''])
    } else if (open && type === 'create') {
      reset({ name: '', subtitle: '', link: '', order: '0', status: 'active', display_duration: '2' })
      setDescriptions([''])
    }

    if (open) {
      setBannerLogo(initialLogoState)
      setLandingLogo(initialLogoState)
      setBannerFilename('')
      setLandingFilename('')
    }
  }, [open, type, partnerData, reset])

  const validateAndSetLogo = useCallback(
    (file: File, specs: typeof BANNER_SPECS, setter: (s: LogoState) => void) => {
      const warnings: string[] = []

      // Check format — cảnh báo nhưng vẫn cho lưu
      if (!specs.acceptedFormats.includes(file.type)) {
        warnings.push(`Nên dùng ${specs.acceptedExtensions}. File này là ${file.type || 'không rõ'}.`)
      }

      // Check file size
      if (file.size > specs.maxFileSize) {
        warnings.push(`File hơi lớn (${(file.size / 1024).toFixed(0)}KB). Khuyến nghị < ${specs.maxFileSize / 1024}KB.`)
      }

      const reader = new FileReader()

      reader.onloadend = () => {
        const dataUrl = reader.result as string

        if (file.type === 'image/svg+xml') {
          setter({ file, preview: dataUrl, dimensions: null, warning: warnings.length ? warnings.join(' ') : null })
          return
        }

        const img = new Image()

        img.onload = () => {
          const w = img.naturalWidth
          const h = img.naturalHeight

          if (w > specs.maxWidth || h > specs.maxHeight) {
            warnings.push(`Ảnh ${w}x${h}px vượt chuẩn (khuyến nghị tối đa ${specs.maxWidth}x${specs.maxHeight}px).`)
          }

          // Luôn cho lưu — chỉ cảnh báo
          setter({ file, preview: dataUrl, dimensions: { w, h }, warning: warnings.length ? warnings.join(' ') : null })
        }

        img.src = dataUrl
      }

      reader.readAsDataURL(file)
    },
    []
  )

  // Preview data cho banner simulation
  const previewBannerPartners = useMemo(() => {
    const current = {
      name: watchName || 'Tên đối tác',
      logo_url: bannerLogo.preview || partnerData?.logo_url || null,
      link: watchLink || null,
      isCurrent: true
    }

    const existing = (allPartners || [])
      .filter((p: any) => p.status === 'active' && p.id !== partnerData?.id)
      .slice(0, 4)
      .map((p: any) => ({ name: p.name, logo_url: p.logo_url, link: p.link, isCurrent: false }))

    return [...existing.slice(0, 2), current, ...existing.slice(2)]
  }, [watchName, watchLink, bannerLogo.preview, partnerData, allPartners])

  const onSubmit = (data: any) => {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('subtitle', data.subtitle || '')
    if (data.link) formData.append('link', data.link)
    formData.append('order', data.order || '0')
    formData.append('status', data.status)
    formData.append('display_duration', data.display_duration || '2')

    const filteredDescs = descriptions.filter(d => d.trim())

    filteredDescs.forEach((desc, i) => {
      formData.append(`description[${i}]`, desc)
    })

    if (bannerLogo.file) {
      formData.append('logo', bannerLogo.file)
      if (bannerFilename) formData.append('logo_filename', bannerFilename)
    }
    if (landingLogo.file) {
      formData.append('logo_landing', landingLogo.file)
      if (landingFilename) formData.append('logo_landing_filename', landingFilename)
    }

    const mutation = type === 'create' ? createMutation : updateMutation

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.info(type === 'create' ? 'Thêm đối tác thành công!' : 'Cập nhật đối tác thành công!')
        onClose()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra')
      }
    })
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      onClose={onClose}
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle>
        <Typography variant='h5' component='span'>
          {type === 'create' ? 'Thêm đối tác mới' : 'Cập nhật đối tác'}
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={3} sx={{ mt: 1 }}>

            {/* ═══ THÔNG TIN CƠ BẢN ═══ */}
            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: 'Tên đối tác là bắt buộc' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    required
                    fullWidth
                    label='Tên đối tác'
                    placeholder='VD: Viettel Telecom'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Controller
                name='subtitle'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Tiêu đề phụ'
                    placeholder='VD: Tập đoàn Công nghiệp - Viễn thông Quân đội'
                  />
                )}
              />
            </Grid2>

            {/* Descriptions */}
            <Grid2 size={{ xs: 12 }}>
              <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>Mô tả</Typography>
              {descriptions.map((desc, index) => (
                <div key={index} className='flex gap-2 mb-2'>
                  <CustomTextField
                    fullWidth
                    value={desc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newDescs = [...descriptions]

                      newDescs[index] = e.target.value
                      setDescriptions(newDescs)
                    }}
                    placeholder={`Dòng mô tả ${index + 1}`}
                  />
                  {descriptions.length > 1 && (
                    <IconButton size='small' color='error' onClick={() => setDescriptions(descriptions.filter((_, i) => i !== index))}>
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </div>
              ))}
              <Button size='small' startIcon={<Plus size={14} />} onClick={() => setDescriptions([...descriptions, ''])}>
                Thêm dòng
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name='link'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Link website (click mở tab mới)'
                    placeholder='https://...'
                    InputProps={{
                      endAdornment: field.value ? <ExternalLink size={16} color='#94a3b8' /> : null
                    }}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 3 }}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth select label='Trạng thái'>
                    <MenuItem value='active'>ACTIVE</MenuItem>
                    <MenuItem value='inactive'>INACTIVE</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Controller
                name='order'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} fullWidth type='number' label='Thứ tự' />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 6, sm: 3 }}>
              <Controller
                name='display_duration'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Thời gian hiển thị (giây)'
                    helperText='Mặc định 2s. Đối tác ưu tiên có thể để 5-10s'
                    inputProps={{ min: 1, max: 30 }}
                  />
                )}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid2>

            {/* ═══ LOGO BANNER (HEADER) ═══ */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <LogoUploadSection
                title={BANNER_SPECS.label}
                specs={BANNER_SPECS}
                logoState={bannerLogo}
                currentUrl={partnerData?.logo_url}
                inputId='partner-banner-logo'
                filename={bannerFilename}
                onFilenameChange={setBannerFilename}
                onFileSelect={file => validateAndSetLogo(file, BANNER_SPECS, setBannerLogo)}
                onClear={() => setBannerLogo(initialLogoState)}
              />

              {/* Banner preview */}
              <Box sx={{ mt: 2 }}>
                <Typography variant='caption' sx={{ fontWeight: 600, color: '#64748b', mb: 0.5, display: 'block' }}>
                  Xem trước banner header:
                </Typography>

                {(() => {
                  return (
                    <Box
                      sx={{
                        overflow: 'hidden',
                        background: 'linear-gradient(90deg, #f8fafc 0%, #fff 50%, #f8fafc 100%)',
                        border: '1px solid #e2e8f0',
                        borderRadius: 1,
                        py: '6px',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', px: 2, justifyContent: 'center', overflow: 'hidden' }}>
                        {previewBannerPartners.map((p, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0,
                              px: '10px', py: '3px', borderRadius: '16px',
                              background: 'rgba(255,255,255,0.8)',
                              border: p.isCurrent ? '2px solid var(--primary-color, #6366f1)' : '1px solid #f1f5f9'
                            }}
                          >
                            {p.logo_url ? (
                              <img src={p.logo_url} alt={p.name} style={{ height: 18, maxWidth: 60, objectFit: 'contain' }} />
                            ) : (
                              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--primary-color, #6366f1)' }} />
                            )}
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{p.name}</span>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )
                })()}
              </Box>
            </Grid2>

            {/* ═══ LOGO LANDING PAGE ═══ */}
            <Grid2 size={{ xs: 12, md: 6 }}>
              <LogoUploadSection
                title={LANDING_SPECS.label}
                specs={LANDING_SPECS}
                logoState={landingLogo}
                currentUrl={partnerData?.logo_landing_url}
                inputId='partner-landing-logo'
                filename={landingFilename}
                onFilenameChange={setLandingFilename}
                onFileSelect={file => validateAndSetLogo(file, LANDING_SPECS, setLandingLogo)}
                onClear={() => setLandingLogo(initialLogoState)}
              />

              {/* Landing preview */}
              <Box sx={{ mt: 2 }}>
                <Typography variant='caption' sx={{ fontWeight: 600, color: '#64748b', mb: 0.5, display: 'block' }}>
                  Xem trước trang chủ:
                </Typography>
                <Box
                  sx={{
                    width: 160, height: 90,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '2px solid var(--primary-color, #6366f1)',
                    p: '10px 12px'
                  }}
                >
                  {(landingLogo.preview || partnerData?.logo_landing_url) ? (
                    <>
                      <img
                        src={landingLogo.preview || partnerData?.logo_landing_url}
                        alt={watchName || 'Preview'}
                        style={{ maxWidth: 130, maxHeight: 50, objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{watchName || 'Tên'}</span>
                    </>
                  ) : (bannerLogo.preview || partnerData?.logo_url) ? (
                    <>
                      <img
                        src={bannerLogo.preview || partnerData?.logo_url}
                        alt={watchName || 'Preview'}
                        style={{ maxWidth: 120, maxHeight: 36, objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{watchName || 'Tên'}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-hover, #ef4444)' }}>
                      {watchName || 'Tên'}
                    </span>
                  )}
                </Box>
              </Box>
            </Grid2>

          </Grid2>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary' disabled={isPending}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant='contained'
          disabled={isPending}
          sx={{ color: '#fff' }}
        >
          {isPending ? 'Đang xử lý...' : type === 'create' ? 'Thêm mới' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ═══════════════════════════════════════════════
 * LogoUploadSection — reusable cho cả 2 loại ảnh
 * ═══════════════════════════════════════════════ */
function LogoUploadSection({
  title,
  specs,
  logoState,
  currentUrl,
  inputId,
  filename,
  onFilenameChange,
  onFileSelect,
  onClear
}: {
  title: string
  specs: typeof BANNER_SPECS
  logoState: LogoState
  currentUrl?: string | null
  inputId: string
  filename: string
  onFilenameChange: (val: string) => void
  onFileSelect: (file: File) => void
  onClear: () => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      onFileSelect(file)

      // Auto-suggest slug từ tên file gốc (bỏ extension)
      if (!filename) {
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, '')

        onFilenameChange(toSlug(nameWithoutExt))
      }
    }
    else onClear()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]

    if (file) {
      onFileSelect(file)
      if (!filename) {
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, '')

        onFilenameChange(toSlug(nameWithoutExt))
      }
    }
  }

  // Tự động slug hóa khi gõ
  const handleFilenameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value

    // Cho phép gõ tự do nhưng auto-slug: lowercase, chỉ a-z 0-9 và -
    const slugged = raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-{2,}/g, '-')

    onFilenameChange(slugged)
  }

  // Extension từ file đang chọn
  const ext = logoState.file
    ? '.' + (logoState.file.name.split('.').pop() || 'png')
    : ''

  return (
    <Box>
      <Typography variant='body2' sx={{ mb: 1, fontWeight: 600 }}>{title}</Typography>

      {/* Specs chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
        <Chip size='small' label={`Max ${specs.maxWidth}x${specs.maxHeight}px`} variant='outlined' sx={{ fontSize: 11 }} />
        <Chip size='small' label={specs.acceptedExtensions.replace(/\./g, '').toUpperCase()} variant='outlined' sx={{ fontSize: 11 }} />
        <Chip size='small' label={`< ${specs.maxFileSize / 1024}KB`} variant='outlined' sx={{ fontSize: 11 }} />
        <Chip size='small' label='Nền trong suốt' color='success' variant='outlined' sx={{ fontSize: 11 }} />
      </Box>

      <Typography variant='caption' color='textSecondary' sx={{ display: 'block', mb: 1 }}>
        {specs.description}
      </Typography>

      {/* Dropzone */}
      <Box
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        sx={{
          border: logoState.warning ? '2px dashed #f59e0b' : '2px dashed #cbd5e1',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          '&:hover': { borderColor: 'var(--primary-color, #6366f1)' }
        }}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input
          id={inputId}
          type='file'
          accept={specs.acceptedExtensions}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <Upload size={20} color='#94a3b8' />
        <Typography variant='caption' color='textSecondary' sx={{ display: 'block', mt: 0.5 }}>
          Kéo thả hoặc click
        </Typography>
      </Box>

      {/* Tên file SEO — chỉ hiện khi có file mới */}
      {logoState.file && (
        <Box sx={{ mt: 1.5 }}>
          <CustomTextField
            fullWidth
            size='small'
            label='Tên file (SEO)'
            value={filename}
            onChange={handleFilenameInput}
            placeholder='vd: logo-viettel-proxy'
            helperText={filename ? `Lưu thành: ${filename}${ext}` : 'Viết thường, không dấu, cách bởi dấu -'}
            InputProps={{
              endAdornment: ext ? (
                <Typography variant='caption' color='textSecondary' sx={{ whiteSpace: 'nowrap' }}>{ext}</Typography>
              ) : null
            }}
          />
        </Box>
      )}

      {/* Warning — chỉ cảnh báo, vẫn cho lưu */}
      {logoState.warning && (
        <Alert severity='warning' sx={{ mt: 1, py: 0, '& .MuiAlert-message': { py: 0.5 } }}>
          <Typography variant='caption'>{logoState.warning}</Typography>
        </Alert>
      )}

      {/* Preview ảnh */}
      {logoState.preview && (
        <Box sx={{ mt: 1 }}>
          <Typography variant='caption' color='textSecondary'>
            Ảnh mới {logoState.dimensions ? `(${logoState.dimensions.w}x${logoState.dimensions.h}px)` : '(SVG)'}:
          </Typography>
          <Box sx={{
            p: 1, mt: 0.5,
            border: '1px solid #e2e8f0', borderRadius: 1,
            background: 'repeating-conic-gradient(#f1f5f9 0% 25%, transparent 0% 50%) 50% / 12px 12px'
          }}>
            <img src={logoState.preview} alt='Preview' style={{ maxHeight: 50, maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
          </Box>
          {!logoState.warning && (
            <Typography variant='caption' color='success.main'>Ảnh hợp lệ</Typography>
          )}
        </Box>
      )}

      {/* Ảnh hiện tại */}
      {currentUrl && !logoState.preview && (
        <Box sx={{ mt: 1 }}>
          <Typography variant='caption' color='textSecondary'>Ảnh hiện tại:</Typography>
          <Box sx={{
            p: 1, mt: 0.5,
            border: '1px solid #e2e8f0', borderRadius: 1,
            background: 'repeating-conic-gradient(#f1f5f9 0% 25%, transparent 0% 50%) 50% / 12px 12px'
          }}>
            <img src={currentUrl} alt='Current' style={{ maxHeight: 50, maxWidth: '100%', objectFit: 'contain', display: 'block' }} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
