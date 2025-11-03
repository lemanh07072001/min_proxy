export interface ApiEndpoint {
  id: string
  title: string
  method: string
  endpoint: string
  description: string
  category: string
  requestBody?: string
  responses: {
    [statusCode: string]: string
  }
  statusCodes: string[]
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'get-current-proxy',
    title: 'Get Current Proxy Xoay',
    method: 'POST',
    endpoint: 'https://app.mktproxy.com/api/proxies/current',
    description: 'Lấy thông tin proxy xoay hiện tại',
    category: 'proxy',
    requestBody: `{
  "key": "G5aTZVGtrHPRL1YUhBUSfPx"
}`,
    responses: {
      '200 OK': `{
  "data": {
     "realIpAddress": "42.119.124.219",
      "http": "42.119.124.219:16847:kh1jtlNj3Kd:rdkm3hbjq45d",
      "socks5": "42.119.124.219:26847:kh1jtlNj3Kd:rdkm3hbjq45d",
      "httpPort": "16847",
      "socksPort": "26847",
      "host": "42.119.124.219",
      "location": "VN+B+N",
      "nextChange": "2024-01-15T10:30:00Z",
      "timeLeft": 1800,
      "status": "active"
  },
  "message": "Proxy retrieved successfully",
  "success": true,
  "timestamp": "2024-01-15T09:30:00Z"
}`,
      '404 ERROR': `{
  "success": false,
  "code": 40400006,
  "message": "Key not found",
  "status": "FAIL",
  "error": "KEY_NOT_FOUND"
}`,
      '500 ERROR': `{
  'success' => false,
  'code'    => 40400006,
  'message' => 'Error server',
  'status'  => 'FAIL',
  'error'   => 'ERROR_SERVER'
}`
    },
    statusCodes: ['200 OK', '404 ERROR', '500 ERROR']
  },
  {
    id: 'get-new-proxy',
    title: 'Get New Proxy Xoay',
    method: 'POST',
    endpoint: 'https://app.mktproxy.com/api/proxies/new',
    description: 'Lấy proxy xoay mới',
    category: 'proxy',
    requestBody: `{
  "key": "G5aTZVGtrHPRL1YUhBUSfPx",
}`,
    responses: {
      '200 OK': `{
   "data": {
        "realIpAddress": "27.66.201.201",
        "http": "27.66.201.201:20814:khljtiNj3Kd:fdkm3nbjg45d",
        "socks5": "27.66.201.201:30814:khljtiNj3Kd:fdkm3nbjg45d",
        "httpPort": "20814",
        "socks5Port": "30814",
        "host": "27.66.201.201"
    },
    "success": true,
    "code": 200,
    "status": "SUCCESS"
}`,
      '404 ERROR': `{
    "success": false,
    "code": 40400006,
    "message": "Key not found",
    "status": "FAIL",
    "error": "KEY_NOT_FOUND"
}`,
      '500 ERROR': `{
  'success' => false,
  'code'    => 40400006,
  'message' => 'Error server',
  'status'  => 'FAIL',
  'error'   => 'ERROR_SERVER'
}`
    },
    statusCodes: ['200 OK', '404 ERROR', '500 ERROR']
  }
]
