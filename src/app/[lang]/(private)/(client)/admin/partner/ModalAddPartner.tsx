'use client'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@/components/modals/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'
import FileUploaderSingle from '@/components/FileUploaderSingle'

interface ModalAddPartnerProps {
  open: boolean
  onClose: () => void
  type: 'create' | 'edit'
}

export default function ModalAddPartner({ open, onClose, type }: ModalAddPartnerProps) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
      fullWidth={true}
      maxWidth='sm'
    >
      <DialogTitle id='customized-dialog-title'>
        <Typography variant='h5' component='span'>
          {type === 'create' ? 'Thêm mới đối tác' : 'Cập nhật đối tác'}
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <form>
          <CustomTextField required fullWidth label='Tên đối tác' placeholder='Nhập tên đối tác' />

          <CustomTextField required fullWidth rows={4} multiline label='Note' id='textarea-outlined-static' />

          <FileUploaderSingle />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='tonal' color='secondary'>
          Close
        </Button>
        <Button onClick={onClose} variant='contained'>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
