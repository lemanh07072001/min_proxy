import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { LogOut } from 'lucide-react'

/**
 * Component Dialog xác nhận có thể tái sử dụng.
 * @param {object} props
 * @param {boolean} props.open - Trạng thái đóng/mở của dialog.
 * @param {string} props.title - Tiêu đề của dialog.
 * @param {React.ReactNode} props.children - Nội dung chi tiết của dialog.
 * @param {function} props.onClose - Hàm được gọi khi đóng dialog (nhấn nút Hủy hoặc click ra ngoài).
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
                         confirmText = 'Đồng ý',
                         cancelText = 'Hủy',
                       }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='confirm-dialog-title'
      aria-describedby='confirm-dialog-description'
    >
      <DialogTitle
        id='confirm-dialog-title'
        className="flex items-center space-x-3"
      >
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <LogOut className="w-5 h-5 text-red-600" />
        </div>
        <div className="text-lg font-semibold text-gray-900">
          Xác nhận đăng xuất
        </div>
      </DialogTitle>
      <DialogContent>
        {/* Dùng DialogContentText để hiển thị nội dung là text đơn giản */}
        <DialogContentText
          id='confirm-dialog-description'
          className='text-gray-600 leading-relaxed'
        >
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* Nút Hủy sẽ gọi hàm onClose */}
        <Button
          onClick={onClose}
          className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-150 font-medium'
          color='inherit'
        >
          {cancelText}
        </Button>
        {/* Nút Đồng ý sẽ gọi hàm onConfirm và có autoFocus */}
        <Button
          onClick={onConfirm}
          color='primary'
          className='px-4 py-2 text-white bg-[var(--primary-gradient)] rounded-lg  focus:outline-none focus:ring-2  transition-all duration-150 font-medium shadow-sm'
          autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;