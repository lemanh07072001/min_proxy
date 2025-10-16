import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

import protocols from '@/utils/protocolProxy'

import CustomTextField from '@core/components/mui/TextField'

interface ChangePasswordProps {
  open: boolean
  onClose: () => void
  title?: string
}

const schema = z.object({
  username: z.string().min(1, 'Username không được để trống'),
  password: z.string().min(1, 'Password không được để trống')
})

export function ChangePassword({ open, onClose, title = 'Cập nhật thông tin proxy' }: ChangePasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = (data: FormValues) => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
      closeAfterTransition={false}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '20px'
        }}
      >
        {title}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Text arena proxy */}
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          <CustomTextField
            fullWidth
            rows={10}
            multiline
            InputProps={{
              readOnly: true
            }}
            id='textarea-outlined-static'
          />

          {/* Username */}
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Username'
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgb(100, 116, 139)',
                    fontWeight: 600,
                    fontSize: '14px',
                    paddingBottom: '5px'
                  }
                }}
              />
            )}
          />

          {/* Password */}
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='password'
                label='Password'
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgb(100, 116, 139)',
                    fontWeight: 600,
                    fontSize: '14px',
                    paddingBottom: '5px'
                  }
                }}
              />
            )}
          />
        </DialogContent>

        <DialogActions className='dialog-actions-dense'>
          <Button onClick={onClose} color='secondary'>
            Hủy
          </Button>
          <Button
            onClick={onClose}
            variant='contained'
            color='primary'
            type='submit'
            sx={{
              background: 'var(--primary-gradient)',
              color: '#fff'
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
