import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const STEP_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6366f1']
const STEP_BG = ['#eff6ff', '#f5f3ff', '#ecfeff', '#ecfdf5', '#fffbeb', '#eef2ff']
const STEP_BORDER = ['#93c5fd', '#c4b5fd', '#67e8f9', '#6ee7b7', '#fcd34d', '#a5b4fc']

interface PipelineStepCardProps {
  step: number
  title: string
  description?: string
  children: React.ReactNode
  sx?: object
}

export default function PipelineStepCard({ step, title, description, children, sx }: PipelineStepCardProps) {
  const color = STEP_COLORS[(step - 1) % STEP_COLORS.length]
  const bg = STEP_BG[(step - 1) % STEP_BG.length]
  const border = STEP_BORDER[(step - 1) % STEP_BORDER.length]

  return (
    <Box sx={{
      border: `1px solid ${border}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 2,
      background: '#fff',
      overflow: 'hidden',
      ...sx,
    }}>
      {/* Header — nền màu đặc trưng cho mỗi step */}
      <Box sx={{
        background: bg,
        borderBottom: `1px solid ${border}`,
        px: 2, py: 1.5,
        display: 'flex', alignItems: 'flex-start', gap: 1.5,
      }}>
        <Box sx={{
          width: 30, height: 30, borderRadius: '50%',
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, flexShrink: 0,
          boxShadow: `0 2px 6px ${color}50`,
          mt: 0.25,
        }}>
          {step}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: color, lineHeight: 1.4 }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: 12, color: '#475569', lineHeight: 1.6, mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Content */}
      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </Box>
  )
}
