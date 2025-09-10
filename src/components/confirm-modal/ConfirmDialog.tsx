import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { LogOut } from 'lucide-react'

/**
 * Component Dialog xác nhận có thể tái sử dụng.
 * @param {object} props
 * @param {boolean} props.open - Trạng thái đóng/mở của dialog.
 * @param {string} props.title - Tiêu đề của dialog.
 * @param {React.ReactNode} props.children - Nội dung chi tiết của dialog.
 * @param {React.ReactNode} [props.icon] - JSX Element cho icon. Mặc định là icon LogOut.
 * @param {string} [props.iconContainerClassName] - Class CSS cho vòng tròn chứa icon. Mặc định là nền đỏ.
 * @param {function} props.onClose - Hàm được gọi khi đóng dialog.
 * @param {function} props.onConfirm - Hàm được gọi khi nhấn nút xác nhận.
 * @param {string} [props.confirmText='Đồng ý'] - Text cho nút xác nhận.
 * @param {string} [props.cancelText='Hủy'] - Text cho nút hủy.
 */
const ConfirmDialog = ({
  open,
  title,
  children,
  onClose,
  onConfirm,

  // --- Props mới được thêm vào ---
  icon = <LogOut className='w-5 h-5 text-red-600' />,
  iconContainerClassName = 'bg-red-100',

  // --- Các props cũ ---
  confirmText = 'Đồng ý',
  cancelText = 'Hủy'
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='confirm-dialog-title'
      aria-describedby='confirm-dialog-description'
    >
      <DialogTitle id='confirm-dialog-title' className='flex items-center space-x-3'>
        {/* Vòng tròn chứa icon giờ đã linh hoạt */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconContainerClassName}`}>
          {icon}
        </div>
        {/* Sử dụng prop 'title' thay vì hard-code */}
        <div className='text-lg font-semibold text-gray-900'>{title}</div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='confirm-dialog-description' className='text-gray-600 leading-relaxed'>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-150 font-medium'
          color='inherit'
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          className='px-4 py-2 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-150 shadow-sm'
          sx={{
            background: 'var(--primary-gradient)',
            '&:hover': {
              background: 'var(--primary-gradient-alt)'
            }
          }}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
