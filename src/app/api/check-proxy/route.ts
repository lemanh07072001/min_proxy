import { NextResponse } from 'next/server'

import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

export async function POST(request) {
  const { protocol, format_proxy, list_proxy } = await request.json()

  if (protocol === 'http' && format_proxy === 'host:port:username:password') {
    const [host, port, username, password] = list_proxy.split(':')

    const proxyUrl = `http://${username ? `${username}:${password}@` : ''}${host}:${port}`

    const httpsAgent = new HttpsProxyAgent(proxyUrl)

    try {
      // Dùng axios với proxy agent để gọi ra ngoài
      const response = await axios.get('https://api.ipify.org?format=json', {
        httpsAgent,
        timeout: 10000 // Timeout 10 giây
      })

      // Nếu thành công, trả về IP của proxy
      return NextResponse.json({ status: 'success', data: response.data })
    } catch (error) {
      let errorMessage = 'Không thể kết nối tới proxy.'

      if (error.response?.status === 407) {
        errorMessage = 'Sai thông tin xác thực (username/password).'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Proxy quá chậm, kết nối timeout.'
      }

      // Nếu thất bại, trả về lỗi
      return NextResponse.json({ status: 'error', message: errorMessage }, { status: 500 })
    }
  }
}
