export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
  example: string
}

export interface ApiEndpoint {
  id: string
  title: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description: string
  category: 'proxy' | 'order' | 'account'
  auth: 'api_key' | 'bearer' | 'none'
  parameters?: ApiParam[]
  requestBody?: string
  responses: {
    [statusCode: string]: string
  }
  statusCodes: string[]
}

export const categoryLabels: Record<string, string> = {
  proxy: 'Proxy',
  order: 'Đơn hàng',
  account: 'Tài khoản'
}

export const authLabels: Record<string, { label: string; description: string }> = {
  api_key: {
    label: 'API Key',
    description: 'Truyền api_key qua query parameter hoặc request body. Lấy key tại trang Danh sách đơn hàng.'
  },
  bearer: {
    label: 'Bearer Token',
    description: 'Gửi header Authorization: Bearer <access_token>. Lấy token từ API đăng nhập.'
  },
  none: {
    label: 'Không cần',
    description: 'Endpoint công khai, không cần xác thực.'
  }
}

const BASE = process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL || 'https://app.mktproxy.com/api'

export const apiEndpoints: ApiEndpoint[] = [
  // ═══════════════════════════════════════
  // PROXY — Thao tác proxy (dùng API Key)
  // ═══════════════════════════════════════
  {
    id: 'get-new-proxy',
    title: 'Lấy Proxy Xoay Mới',
    method: 'GET',
    endpoint: `${BASE}/proxies/new`,
    description: 'Lấy proxy xoay mới. Mỗi lần gọi sẽ trả proxy IP mới (nếu hết cooldown). Hỗ trợ cả GET và POST.',
    category: 'proxy',
    auth: 'api_key',
    parameters: [
      { name: 'key', type: 'string', required: true, description: 'API Key của đơn hàng proxy xoay', example: 'G5aTZVGtrHPRL1YUhBUSfPx' }
    ],
    requestBody: undefined,
    responses: {
      '200 OK': `{
  "success": true,
  "code": 200,
  "status": "SUCCESS",
  "data": {
    "realIpAddress": "27.66.201.201",
    "http": "27.66.201.201:20814:khljtiNj3Kd:fdkm3nbjg45d",
    "socks5": "27.66.201.201:30814:khljtiNj3Kd:fdkm3nbjg45d",
    "httpPort": "20814",
    "socks5Port": "30814",
    "host": "27.66.201.201",
    "user": "khljtiNj3Kd",
    "pass": "fdkm3nbjg45d"
  }
}`,
      '404 ERROR': `{
  "success": false,
  "code": 40400006,
  "message": "Key not found",
  "status": "FAIL"
}`,
      '500 ERROR': `{
  "success": false,
  "code": 50000001,
  "message": "Error server",
  "status": "FAIL"
}`
    },
    statusCodes: ['200 OK', '404 ERROR', '500 ERROR']
  },

  {
    id: 'get-current-proxy',
    title: 'Lấy Proxy Hiện Tại',
    method: 'GET',
    endpoint: `${BASE}/proxies/current`,
    description: 'Lấy thông tin proxy xoay đang active. Không tạo proxy mới, chỉ trả proxy hiện tại và thời gian còn lại.',
    category: 'proxy',
    auth: 'api_key',
    parameters: [
      { name: 'key', type: 'string', required: true, description: 'API Key của đơn hàng proxy xoay', example: 'G5aTZVGtrHPRL1YUhBUSfPx' }
    ],
    responses: {
      '200 OK': `{
  "success": true,
  "code": 200,
  "status": "SUCCESS",
  "data": {
    "realIpAddress": "42.119.124.219",
    "http": "42.119.124.219:16847:kh1jtlNj3Kd:rdkm3hbjq45d",
    "socks5": "42.119.124.219:26847:kh1jtlNj3Kd:rdkm3hbjq45d",
    "httpPort": "16847",
    "socksPort": "26847",
    "host": "42.119.124.219",
    "user": "kh1jtlNj3Kd",
    "pass": "rdkm3hbjq45d",
    "location": "VN",
    "timeLeft": 1800,
    "nextChange": "2024-01-15T10:30:00Z",
    "status": "active"
  }
}`,
      '404 ERROR': `{
  "success": false,
  "code": 40400006,
  "message": "Key not found",
  "status": "FAIL"
}`,
      '500 ERROR': `{
  "success": false,
  "code": 50000001,
  "message": "Error server",
  "status": "FAIL"
}`
    },
    statusCodes: ['200 OK', '404 ERROR', '500 ERROR']
  },

  {
    id: 'rotate-ip',
    title: 'Xoay IP Proxy',
    method: 'GET',
    endpoint: `${BASE}/proxies/rotate-ip`,
    description: 'Xoay IP proxy ngay lập tức. Cooldown 60 giây giữa các lần xoay. Hỗ trợ cả GET và POST.',
    category: 'proxy',
    auth: 'api_key',
    parameters: [
      { name: 'api_key', type: 'string', required: true, description: 'API Key của đơn hàng proxy', example: 'G5aTZVGtrHPRL1YUhBUSfPx' }
    ],
    responses: {
      '200 OK': `{
  "success": true,
  "code": 200,
  "status": "SUCCESS",
  "data": {
    "realIpAddress": "103.45.67.89",
    "http": "103.45.67.89:20814:khljtiNj3Kd:fdkm3nbjg45d",
    "socks5": "103.45.67.89:30814:khljtiNj3Kd:fdkm3nbjg45d",
    "httpPort": "20814",
    "socks5Port": "30814",
    "host": "103.45.67.89"
  },
  "message": "Xoay IP thành công",
  "seconds": 60
}`,
      '400 ERROR': `{
  "success": false,
  "code": 40000001,
  "message": "Vui lòng chờ 45 giây nữa để xoay IP",
  "status": "FAIL"
}`,
      '404 ERROR': `{
  "success": false,
  "code": 40400006,
  "message": "Key not found",
  "status": "FAIL"
}`
    },
    statusCodes: ['200 OK', '400 ERROR', '404 ERROR']
  },

  // ═══════════════════════════════════════
  // ORDER — Mua proxy & quản lý đơn hàng (dùng Bearer Token)
  // ═══════════════════════════════════════
  {
    id: 'buy-proxy-rotating',
    title: 'Mua Proxy Xoay',
    method: 'POST',
    endpoint: `${BASE}/buy/proxy-rotating`,
    description: 'Tạo đơn hàng mua proxy xoay. Tiền sẽ trừ từ số dư tài khoản. Sau khi mua thành công, dùng API "Kiểm Tra Đơn Hàng" để lấy API Key.',
    category: 'order',
    auth: 'bearer',
    requestBody: `{
  "key_time": "month",
  "quantity": 1,
  "time": 1
}`,
    parameters: [
      { name: 'key_time', type: 'string', required: true, description: 'Chu kỳ: "day" (1 ngày), "week" (7 ngày), "month" (30 ngày). Giá trị này quyết định thời hạn đơn hàng.', example: 'month' },
      { name: 'quantity', type: 'integer', required: true, description: 'Số lượng proxy cần mua (tối thiểu 1)', example: '1' },
      { name: 'time', type: 'integer', required: true, description: 'Thời gian (được map tự động từ key_time: day→1, week→7, month→30)', example: '1' }
    ],
    responses: {
      '200 OK': `{
  "success": true,
  "message": "Mua proxy xoay thành công"
}`,
      '422 ERROR': `{
  "success": false,
  "message": "Số dư không đủ để mua proxy",
  "errors": {
    "quantity": ["Quantity phải lớn hơn 0"],
    "key_time": ["Key time không hợp lệ"]
  }
}`,
      '401 ERROR': `{
  "message": "Unauthenticated."
}`
    },
    statusCodes: ['200 OK', '422 ERROR', '401 ERROR']
  },

  {
    id: 'buy-proxy-static',
    title: 'Mua Proxy Tĩnh',
    method: 'POST',
    endpoint: `${BASE}/buy/proxy-static`,
    description: 'Tạo đơn hàng mua proxy tĩnh (IP cố định). Tiền trừ từ số dư tài khoản.',
    category: 'order',
    auth: 'bearer',
    requestBody: `{
  "quantity": 1,
  "protocol": "http",
  "key_time": "month"
}`,
    parameters: [
      { name: 'quantity', type: 'integer', required: true, description: 'Số lượng proxy cần mua (tối thiểu 1)', example: '1' },
      { name: 'protocol', type: 'string', required: true, description: 'Giao thức: "http" hoặc "socks5"', example: 'http' },
      { name: 'key_time', type: 'string', required: true, description: 'Chu kỳ: "day" (1 ngày), "week" (7 ngày), "month" (30 ngày)', example: 'month' }
    ],
    responses: {
      '200 OK': `{
  "success": true,
  "message": "Mua proxy tĩnh thành công",
  "data": {
    "order_id": 123
  }
}`,
      '422 ERROR': `{
  "success": false,
  "message": "Số dư không đủ để mua proxy",
  "errors": {
    "quantity": ["Quantity phải lớn hơn 0"],
    "protocol": ["Protocol không hợp lệ"]
  }
}`,
      '401 ERROR': `{
  "message": "Unauthenticated."
}`
    },
    statusCodes: ['200 OK', '422 ERROR', '401 ERROR']
  },

  {
    id: 'get-orders',
    title: 'Kiểm Tra Đơn Hàng',
    method: 'GET',
    endpoint: `${BASE}/get-order`,
    description: 'Lấy danh sách tất cả đơn hàng của bạn, bao gồm API Key cho mỗi đơn.',
    category: 'order',
    auth: 'bearer',
    responses: {
      '200 OK': `{
  "success": true,
  "data": [
    {
      "id": 456,
      "user_id": 1,
      "type_servi": {
        "id": 4,
        "name": "Proxy Xoay VN",
        "type": 1
      },
      "apiKeys": [
        {
          "id": 789,
          "api_key": "G5aTZVGtrHPRL1YUhBUSfPx",
          "plan_type": "ROTATING",
          "expired_at": "2025-12-31T23:59:59Z",
          "status": "ACTIVE"
        }
      ],
      "buy_at": "2025-01-01T10:00:00Z",
      "quantity": 1,
      "total_price": 50000
    }
  ],
  "message": "Lấy dữ liệu thành công"
}`,
      '401 ERROR': `{
  "message": "Unauthenticated."
}`
    },
    statusCodes: ['200 OK', '401 ERROR']
  },

  // ═══════════════════════════════════════
  // ACCOUNT — Thông tin tài khoản
  // ═══════════════════════════════════════
  {
    id: 'check-balance',
    title: 'Kiểm Tra Số Dư',
    method: 'POST',
    endpoint: `${BASE}/me`,
    description: 'Lấy thông tin tài khoản và số dư hiện tại.',
    category: 'account',
    auth: 'bearer',
    responses: {
      '200 OK': `{
  "id": 1,
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "sodu": 1500000,
  "role": 1,
  "created_at": "2024-06-01T08:00:00Z"
}`,
      '401 ERROR': `{
  "message": "Unauthenticated."
}`
    },
    statusCodes: ['200 OK', '401 ERROR']
  }
]
