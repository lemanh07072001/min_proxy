import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { Info } from 'lucide-react'

export default function FieldHint({ text }: { text: string }) {
  return (
    <Tooltip title={text} placement='top' arrow>
      <IconButton size='small' sx={{ ml: 0.5, p: 0.25 }}>
        <Info size={14} />
      </IconButton>
    </Tooltip>
  )
}
