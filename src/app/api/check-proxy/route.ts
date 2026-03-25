import { NextResponse } from 'next/server'

import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

export async function POST(request: Request) {
  try {
    const { protocol, format_proxy, list_proxy } = await request.json()

    if (!list_proxy || !format_proxy) {
      return NextResponse.json({ status: 'error', message: 'Thiếu thông tin proxy.' }, { status: 400 })
    }

    // Parse proxy string theo format
    const parts = list_proxy.split(':')
    const host = parts[0]
    const port = parts[1]
    const username = parts[2] || ''
    const password = parts[3] || ''

    if (!host || !port) {
      return NextResponse.json({ status: 'error', message: 'Proxy không đúng định dạng.' }, { status: 400 })
    }

    // Build proxy agent theo protocol
    let agent: any

    if (protocol === 'socks5') {
      const proxyUrl = username
        ? `socks5://${username}:${password}@${host}:${port}`
        : `socks5://${host}:${port}`
      agent = new SocksProxyAgent(proxyUrl)
    } else {
      // HTTP / HTTPS
      const proxyUrl = username
        ? `http://${username}:${password}@${host}:${port}`
        : `http://${host}:${port}`
      agent = new HttpsProxyAgent(proxyUrl)
    }

    const startTime = performance.now()

    await axios.get('https://cloudflare.com/cdn-cgi/trace', {
      httpsAgent: agent,
      httpAgent: agent,
      timeout: 15000,
    })

    const duration = Math.round(performance.now() - startTime)

    return NextResponse.json({
      proxy: list_proxy,
      ip: host,
      protocol,
      status: 'success',
      responseTime: duration,
      type: format_proxy,
    })
  } catch (error: any) {
    let errorMessage = 'Không thể kết nối tới proxy.'

    if (error.response?.status === 407) {
      errorMessage = 'Sai thông tin xác thực (username/password).'
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Proxy quá chậm, kết nối timeout.'
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Proxy từ chối kết nối.'
    }

    return NextResponse.json({
      proxy: '',
      status: 'error',
      message: errorMessage,
    }, { status: 500 })
  }
}
