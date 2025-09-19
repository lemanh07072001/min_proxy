// apiConfig.ts
export const apiEndpoints = [
  {
    id: 'post-rotate-proxy',
    name: 'Get New Proxy Xoay',
    method: 'POST',
    url: 'https://api.mktproxy.com/api/proxies/current',
    body: {
      key: 'GSaTZVGtrHPRiYUhBUSfPx'
    },
    response: {
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
  {
    id: 'get-rotate-proxy',
    name: 'Get New Proxy Xoay',
    method: 'GET',
    url: 'https://api.mktproxy.com/api/proxies/current?key=GSaTZVGtrHPRiYUhBUSfPx',
    response: {
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
  }
]
