/**
 * Order Status Constants
 * Định nghĩa các trạng thái đơn hàng trong hệ thống
 */

export const ORDER_STATUS = {
  PENDING: '0', // Đang chờ xử lý
  PROCESSING: '1', // Đang xử lý
  COMPLETED: '2', // Hoàn thành
  FAILED: '3', // Lỗi
  EXPIRED: '5', // Hết hạn expired
  CANCEL: '4' // Đã hủy
} as const

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

/**
 * Order Status Labels
 * Nhãn hiển thị cho mỗi trạng thái
 */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Đang chờ xử lý',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.FAILED]: 'Lỗi đơn hàng',
  [ORDER_STATUS.CANCEL]: 'Đã hủy',
  [ORDER_STATUS.EXPIRED]: 'Hoàn tiền'
} as const

/**
 * Order Status Colors
 * Màu sắc tương ứng với mỗi trạng thái (dùng cho Chip MUI)
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'info', // Xanh dương
  [ORDER_STATUS.PROCESSING]: 'warning', // Vàng cam
  [ORDER_STATUS.COMPLETED]: 'success', // Xanh lá
  [ORDER_STATUS.FAILED]: 'error', // Đỏ
  [ORDER_STATUS.EXPIRED]: 'error', // Đỏ
  [ORDER_STATUS.CANCEL]: 'warning' // Đỏ
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
