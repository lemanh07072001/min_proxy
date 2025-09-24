import type { ReactNode } from 'react'

import { Box } from '@mui/material'

interface BoxCustomProps {
  children: ReactNode
}

export default function BoxCustom({ children }: BoxCustomProps) {
  return (
    <>
      <Box
        sx={{
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          height: '100%',
          border: '1px solid #f0f0f0',
          color: 'rgba(0,0,0,0.88)',
          fontSize: '14px',
          listStyle: 'none',
          backgroundColor: '#ffffff',
          borderRadius: '16px'
        }}
      >
        <Box
          sx={{
            padding: '16px',
            height: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
