/**
 * Order Status Constants
 * Định nghĩa các trạng thái đơn hàng trong hệ thống
 */

export const ORDER_STATUS = {
  PENDING: '0',           // Chờ xử lý
  PROCESSING: '1',        // Đang xử lý
  IN_USE: '2',            // Đang sử dụng
  PARTIAL_COMPLETED: '3', // Hoàn 1 phần
  COMPLETED: '4',         // Hoàn thành
  FAILED: '5',            // Thất bại
  EXPIRED: '6',           // Hết hạn
  FULL_COMPLETED: '7'     // Hoàn toàn bộ
} as const

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

/**
 * Order Status Labels
 * Nhãn hiển thị cho mỗi trạng thái
 */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.IN_USE]: 'Đang sử dụng',
  [ORDER_STATUS.PARTIAL_COMPLETED]: 'Hoàn 1 phần',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.FAILED]: 'Thất bại',
  [ORDER_STATUS.EXPIRED]: 'Hết hạn',
  [ORDER_STATUS.FULL_COMPLETED]: 'Hoàn toàn bộ'
} as const

/**
 * Order Status Colors
 * Màu sắc tương ứng với mỗi trạng thái (dùng cho Chip MUI)
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.PROCESSING]: 'info',
  [ORDER_STATUS.IN_USE]: 'info',
  [ORDER_STATUS.PARTIAL_COMPLETED]: 'success',
  [ORDER_STATUS.COMPLETED]: 'success',
  [ORDER_STATUS.FAILED]: 'error',
  [ORDER_STATUS.EXPIRED]: 'error',
  [ORDER_STATUS.FULL_COMPLETED]: 'error'
} as const

/**
 * Transaction Types
 * Loại giao dịch
 */
export const TRANSACTION_TYPES = {
  BUY: 'BUY', // Mua
  REFUND: 'REFUND', // Hoàn tiền
  FAILED: 'FAILED' // Thất bại
} as const

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES]

/**
 * Transaction Type Labels
 */
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.BUY]: 'Mua',
  [TRANSACTION_TYPES.REFUND]: 'Hoàn',
  [TRANSACTION_TYPES.FAILED]: 'Thất bại'
} as const
