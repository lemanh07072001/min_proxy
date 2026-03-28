import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface JsonPreviewPanelProps {
  jsonPreview: string
}

export default function JsonPreviewPanel({ jsonPreview }: JsonPreviewPanelProps) {
  return (
    <Box sx={{ position: 'sticky', top: 16 }}>
      <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
        api_config (JSON Preview)
      </Typography>
      <Box
        component='pre'
        sx={{
          bgcolor: 'grey.900',
          color: '#a5d6a7',
          p: 2,
          borderRadius: 1,
          fontSize: '0.75rem',
          lineHeight: 1.5,
          overflow: 'auto',
          maxHeight: 'calc(100vh - 220px)',
          fontFamily: '"Fira Code", "Consolas", monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {jsonPreview}
      </Box>
    </Box>
  )
}
