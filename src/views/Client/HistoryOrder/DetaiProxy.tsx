// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/modals/DialogCloseButton'

interface DetailModalProps {
  isOpen: boolean
  handleClose: () => void
}

const DetailProxy = ({ isOpen, handleClose }: DetailModalProps) => {
  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={isOpen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Thông tin Proxy
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Chupa chups jelly-o candy sweet roll wafer cake chocolate bar. Brownie sweet roll topping cake chocolate
            cake cheesecake tiramisu chocolate cake. Jujubes liquorice chocolate bar pastry. Chocolate jujubes caramels
            pastry. Ice cream marshmallow dragée bonbon croissant. Carrot cake sweet donut ice cream bonbon oat cake
            danish sugar plum. Gingerbread gummies marzipan gingerbread.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleClose} variant='contained'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DetailProxy
