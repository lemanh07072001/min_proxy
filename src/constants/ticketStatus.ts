/**
 * Ticket Status Constants
 * Định nghĩa trạng thái và loại ticket hỗ trợ
 */

export const TICKET_STATUS = {
  OPEN: 0,
  PROCESSING: 1,
  RESOLVED: 2,
  CLOSED: 3
} as const

export type TicketStatusType = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]

export const TICKET_STATUS_LABELS: Record<number, string> = {
  [TICKET_STATUS.OPEN]: 'Chờ xử lý',
  [TICKET_STATUS.PROCESSING]: 'Đang xử lý',
  [TICKET_STATUS.RESOLVED]: 'Đã giải quyết',
  [TICKET_STATUS.CLOSED]: 'Đã đóng'
}

export const TICKET_STATUS_COLORS: Record<number, string> = {
  [TICKET_STATUS.OPEN]: 'warning',
  [TICKET_STATUS.PROCESSING]: 'info',
  [TICKET_STATUS.RESOLVED]: 'success',
  [TICKET_STATUS.CLOSED]: 'default'
}

export const TICKET_TYPES = {
  PARTIAL_PROXY: 'partial_proxy',
  PROXY_ISSUE: 'proxy_issue',
  REFUND_REQUEST: 'refund_request',
  OTHER: 'other'
} as const

export type TicketType = (typeof TICKET_TYPES)[keyof typeof TICKET_TYPES]

export const TICKET_TYPE_LABELS: Record<string, string> = {
  [TICKET_TYPES.PARTIAL_PROXY]: 'Thiếu proxy',
  [TICKET_TYPES.PROXY_ISSUE]: 'Lỗi proxy',
  [TICKET_TYPES.REFUND_REQUEST]: 'Yêu cầu hoàn tiền',
  [TICKET_TYPES.OTHER]: 'Khác'
}
