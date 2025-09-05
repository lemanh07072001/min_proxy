import { NextResponse } from 'next/server'

// Giả sử axiosInstance được cấu hình để gọi đến một API bên ngoài
import axiosInstance from '@/libs/axios'

export async function GET() {
  try {
    // Server Next.js của bạn đang gọi đến một API khác (có thể là của bên thứ ba)
    const responseFromExternalAPI = await axiosInstance.get('/get-proxy-rotate')

    // Trả về dữ liệu từ API bên ngoài cho client
    return NextResponse.json(responseFromExternalAPI.data)
  } catch (error) {
    // Trả về lỗi 500 cho client
    return NextResponse.json({ message: 'Lỗi phía server khi lấy dữ liệu từ nguồn ngoài.' }, { status: 500 })
  }
}
