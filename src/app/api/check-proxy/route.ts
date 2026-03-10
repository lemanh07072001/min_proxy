import { NextResponse } from 'next/server'

import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export async function POST(request) {
  // Verify session và role admin
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  const { protocol, format_proxy, list_proxy } = await request.json()

  if (protocol === 'http' && format_proxy === 'host:port:username:password') {
    const [host, port, username, password] = list_proxy.split(':')

    const proxyUrl = `http://${username ? `${username}:${password}@` : ''}${host}:${port}`

    const httpsAgent = new HttpsProxyAgent(proxyUrl)

    try {
      const startTime = performance.now();

      // Dùng axios với proxy agent để gọi ra ngoài
      const response = await axios.get('https://cloudflare.com/cdn-cgi/trace', {
        httpsAgent,
        timeout: 15000
      })

      const endTime = performance.now();

      const duration = Math.round(endTime - startTime);

      // Nếu thành công, trả về IP của proxy
      return NextResponse.json({
        proxy: list_proxy,
        ip: host,
        protocol: protocol,
        status: 'success',
        responseTime: duration,
        type: format_proxy
      })

    } catch (error) {
      let errorMessage = 'Không thể kết nối tới proxy.'

      if (error.response?.status === 407) {
        errorMessage = 'Sai thông tin xác thực (username/password).'
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        errorMessage = 'Proxy quá chậm, kết nối timeout.'
      }

      // Nếu thất bại, trả về lỗi
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 })
    }
  }
}
