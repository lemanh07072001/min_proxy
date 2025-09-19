// apiConfig.ts
export const apiEndpoints = [
  {
    id: 'post-rotate-proxy',
    name: 'Get New Proxy Xoay',
    method: 'POST',
    url: 'https://api.mktproxy.com/api/proxies/new',
    body: {
      key: 'GSaTZVGtrHPRiYUhBUSfPx'
    },
    responses: {
      200: {
        data: {
          realIpAddress: '27.66.201.201',
          http: '27.66.201.201:20814:khljtiNj3Kd:fdkm3nbjg45d',
          socks5: '27.66.201.201:30814:khljtiNj3Kd:fdkm3nbjg45d',
          httpPort: '20814',
          socks5Port: '30814',
          host: '27.66.201.201',
          location: 'HaTinh1',
          expirationAt: '11:45 20-09-2025'
        },
        success: true,
        code: 200,
        status: 'SUCCESS'
      },
      400: {
        error: 'Bad Request',
        message: 'Invalid API key provided',
        code: 400,
        status: 'ERROR'
      },

      500: {
        error: 'Internal Server Error',
        message: 'Something went wrong on our end',
        code: 500,
        status: 'ERROR'
      }
    }
  },
  {
    id: 'get-rotate-proxy',
    name: 'Get New Proxy Xoay',
    method: 'GET',
    url: 'https://api.mktproxy.com/api/proxies/new?key=GSaTZVGtrHPRiYUhBUSfPx',
    responses: {
      200: {
        data: {
          realIpAddress: '27.66.201.201',
          http: '27.66.201.201:20814:khljtiNj3Kd:fdkm3nbjg45d',
          socks5: '27.66.201.201:30814:khljtiNj3Kd:fdkm3nbjg45d',
          httpPort: '20814',
          socks5Port: '30814',
          host: '27.66.201.201',
          location: 'HaTinh1',
          expirationAt: '11:45 20-09-2025'
        },
        success: true,
        code: 200,
        status: 'SUCCESS'
      },
      400: {
        error: 'Bad Request',
        message: 'Invalid query parameters',
        code: 400,
        status: 'ERROR'
      },
      401: {
        error: 'Unauthorized',
        message: 'API key is required',
        code: 401,
        status: 'ERROR'
      },
      500: {
        error: 'Internal Server Error',
        message: 'Something went wrong on our end',
        code: 500,
        status: 'ERROR'
      }
    }
  },
  {
    id: 'get-current-proxy',
    name: 'Get Current Proxy Xoay',
    method: 'POST',
    url: 'https://api.mktproxy.com/api/proxies/current',
    body: {
      key: 'GSaTZVGtrHPRiYUhBUSfPx'
    },
    responses: {
      200: {
        data: {
          currentProxy: {
            realIpAddress: '42.119.124.219',
            http: '42.119.124.219:16847:khljtiNj3Kd:fdkm3nbjg45d',
            socks5: '42.119.124.219:26847:khljtiNj3Kd:fdkm3nbjg45d',
            httpPort: '16847',
            socks5Port: '26847',
            host: '42.119.124.219',
            location: 'YenBai1',
            expirationAt: '1758099900',
            isActive: true,
            lastUsed: '2024-01-15T10:30:00Z'
          },
          usage: {
            totalRequests: 1250,
            remainingRequests: 750,
            resetAt: '2024-02-01T00:00:00Z'
          }
        },
        success: true,
        code: 200,
        status: 'SUCCESS'
      },
      400: {
        error: 'Bad Request',
        message: 'Invalid API key format',
        code: 400,
        status: 'ERROR'
      },
      404: {
        error: 'Not Found',
        message: 'No active proxy found for this key',
        code: 404,
        status: 'ERROR'
      },
      500: {
        error: 'Internal Server Error',
        message: 'Unable to retrieve proxy information',
        code: 500,
        status: 'ERROR'
      }
    }
  },
  {
    id: 'get-current-proxy-xoay',
    name: 'Get Current Proxy Xoay',
    method: 'GET',
    url: 'https://api.mktproxy.com/api/proxies/current?key=GSaTZVGtrHPRiYUhBUSfPx',
    responses: {
      200: {
        200: {
          data: {
            realIpAddress: '27.66.201.201',
            http: '27.66.201.201:20814:khljtiNj3Kd:fdkm3nbjg45d',
            socks5: '27.66.201.201:30814:khljtiNj3Kd:fdkm3nbjg45d',
            httpPort: '20814',
            socks5Port: '30814',
            host: '27.66.201.201',
            location: 'HaTinh1',
            expirationAt: '11:45 20-09-2025'
          },
          success: true,
          code: 200,
          status: 'SUCCESS'
        }
      },
      400: {
        error: 'Bad Request',
        message: 'Invalid query parameters',
        code: 400,
        status: 'ERROR'
      },
      500: {
        error: 'Internal Server Error',
        message: 'Unable to retrieve proxy list',
        code: 500,
        status: 'ERROR'
      }
    }
  }
]
