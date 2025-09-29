import type { Metadata } from 'next'

// MUI Imports
import Avatar from '@mui/material/Avatar'

import { Typography } from '@mui/material'

import { EthernetPort, MapPinHouse, User, Wallet, Zap } from 'lucide-react'

import { getServerSession } from 'next-auth'

import CustomIconButton from '@core/components/mui/IconButton'
import BoxCustom from '@/components/UI/BoxCustom'
import ProxiesCountry from '@/components/UI/ProxiesCountry'
import UpdateDetail from '@/components/UI/UpdateDetail'
import HistoryLoginPage from '@/views/Client/HistoryLogin/HistoryLoginPage'
import axiosInstance from '@/libs/axios'
import { authOptions } from '@/libs/auth'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Trang chủ`,
  description: 'Mô tả ngắn gọn về trang web.'
}

const vietnamProvinces = [
  { country: 'Hà Nội', flag: 'vn', count: 120 },
  { country: 'Hồ Chí Minh', flag: 'vn', count: 110 },
  { country: 'Đà Nẵng', flag: 'vn', count: 90 },
  { country: 'Hải Phòng', flag: 'vn', count: 85 },
  { country: 'Cần Thơ', flag: 'vn', count: 80 },
  { country: 'Bà Rịa - Vũng Tàu', flag: 'vn', count: 75 },
  { country: 'Quảng Ninh', flag: 'vn', count: 70 },
  { country: 'Bình Dương', flag: 'vn', count: 68 },
  { country: 'Đồng Nai', flag: 'vn', count: 66 },
  { country: 'Khánh Hòa', flag: 'vn', count: 64 },
  { country: 'Lâm Đồng', flag: 'vn', count: 62 },
  { country: 'Thừa Thiên Huế', flag: 'vn', count: 60 },
  { country: 'Quảng Nam', flag: 'vn', count: 58 },
  { country: 'Thanh Hóa', flag: 'vn', count: 56 },
  { country: 'Nghệ An', flag: 'vn', count: 54 },
  { country: 'Hà Tĩnh', flag: 'vn', count: 52 },
  { country: 'Quảng Bình', flag: 'vn', count: 50 },
  { country: 'Quảng Trị', flag: 'vn', count: 48 },
  { country: 'Bình Định', flag: 'vn', count: 46 },
  { country: 'Phú Yên', flag: 'vn', count: 44 },
  { country: 'Gia Lai', flag: 'vn', count: 42 },
  { country: 'Kon Tum', flag: 'vn', count: 40 },
  { country: 'Đắk Lắk', flag: 'vn', count: 38 },
  { country: 'Đắk Nông', flag: 'vn', count: 36 },
  { country: 'Bình Phước', flag: 'vn', count: 34 },
  { country: 'Tây Ninh', flag: 'vn', count: 32 },
  { country: 'An Giang', flag: 'vn', count: 30 },
  { country: 'Kiên Giang', flag: 'vn', count: 28 },
  { country: 'Cà Mau', flag: 'vn', count: 26 },
  { country: 'Bạc Liêu', flag: 'vn', count: 24 },
  { country: 'Sóc Trăng', flag: 'vn', count: 22 },
  { country: 'Trà Vinh', flag: 'vn', count: 20 },
  { country: 'Vĩnh Long', flag: 'vn', count: 18 },
  { country: 'Tiền Giang', flag: 'vn', count: 16 },
  { country: 'Bến Tre', flag: 'vn', count: 14 },
  { country: 'Long An', flag: 'vn', count: 12 },
  { country: 'Đồng Tháp', flag: 'vn', count: 10 },
  { country: 'Hậu Giang', flag: 'vn', count: 8 },
  { country: 'Nam Định', flag: 'vn', count: 6 },
  { country: 'Thái Bình', flag: 'vn', count: 4 }
]

const updateHistory = [
  {
    date: '25/07/2025 16:16',
    color: 'bg-blue-500',
    updates: [
      'Ra mắt tính năng tự động gia hạn gói dịch vụ.',
      'Tích hợp thanh toán qua Ví Momo và ZaloPay.',
      'Cải thiện hiệu suất hệ thống giám sát IP.',
      'Tối ưu hóa tốc độ tải trang quản trị.'
    ]
  },
  {
    date: '15/07/2025 15:20',
    color: 'bg-teal-500',
    updates: ['Thêm báo cáo chi tiết lưu lượng theo giờ.', 'Nâng cấp hệ thống gửi thông báo qua Telegram.']
  },
  {
    date: '05/07/2025 14:05',
    color: 'bg-pink-500',
    updates: ['Phát hành ứng dụng di động iOS bản beta công khai.']
  },
  {
    date: '25/06/2025 18:26',
    color: 'bg-yellow-500',
    updates: [
      'Cải thiện cơ chế cân bằng tải cho các cụm proxy.',
      'Hỗ trợ hiển thị biểu đồ thời gian thực trong dashboard.'
    ]
  },
  {
    date: '10/06/2025 17:28',
    color: 'bg-yellow-500',
    updates: ['Thêm tùy chọn lọc proxy theo tốc độ kết nối.', 'Bổ sung tính năng tự động sao lưu dữ liệu hằng ngày.']
  },
  {
    date: '28/05/2025 13:58',
    color: 'bg-red-500',
    updates: ['Khắc phục lỗi chậm trễ khi xác thực người dùng mới.']
  },

  // -------- Bổ sung thêm 6 mục mới ----------
  {
    date: '15/05/2025 10:12',
    color: 'bg-blue-500',
    updates: [
      'Triển khai gói dịch vụ thử nghiệm miễn phí 3 ngày.',
      'Bổ sung API quản lý tài khoản cho đối tác.',
      'Tăng cường mã hóa dữ liệu đầu cuối.'
    ]
  },
  {
    date: '02/05/2025 09:40',
    color: 'bg-teal-500',
    updates: [
      'Thêm giao diện tối (Dark Mode) cho trang quản trị.',
      'Tối ưu hóa truy vấn cơ sở dữ liệu cho báo cáo lớn.'
    ]
  },
  {
    date: '18/04/2025 14:05',
    color: 'bg-pink-500',
    updates: ['Ra mắt hệ thống cảnh báo sự cố theo thời gian thực.']
  },
  {
    date: '04/04/2025 19:20',
    color: 'bg-yellow-500',
    updates: ['Hỗ trợ đăng nhập bằng tài khoản Google và GitHub.', 'Cải thiện tốc độ phản hồi của API quản trị viên.']
  },
  {
    date: '10/03/2025 11:55',
    color: 'bg-yellow-500',
    updates: [
      'Thêm tính năng quản lý nhiều người dùng trong cùng một tổ chức.',
      'Cập nhật giao diện danh sách proxy trực quan hơn.'
    ]
  },
  {
    date: '25/01/2025 08:33',
    color: 'bg-red-500',
    updates: ['Sửa lỗi hiển thị khi truy cập bằng trình duyệt Safari.']
  }
]

async function getUser(accessToken: string) {
  const apiUrl = process.env.API_URL || 'https://api.minhan.online/api'

  // Đảm bảo bạn đã cấu hình API_URL trong file .env.local
  if (!apiUrl) {
    console.error('API_URL is not defined in environment variables.')

    return []
  }

  try {
    const response = await fetch(`${apiUrl}/get-overview`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },

      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Failed to fetch users:', response.status, response.statusText)

      return []
    }

    const result = await response.json()

    return result || []
  } catch (error) {
    console.error('An error occurred while fetching users:', error)

    return []
  }
}

export default async function Overview() {
  const { access_token } = await getServerSession(authOptions)

  if(!access_token) return null
  const user = await getUser(access_token)

  console.log(user)

  return (
    <>
      <div className='grid  gap-4'>
        <div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
          <div className='lg:col-span-7'>
            <BoxCustom>
              <div className='flex items-center h-full'>
                <Avatar src='/images/avatars/1.png' alt='Victor Anderson' />
                <div className='ms-3'>
                  <Typography
                    sx={{
                      color: '#808080',
                      fontSize: '15px',
                      fontWeight: 600,
                      lineHeight: '160%'
                    }}
                  >
                    Địa chỉ IP
                  </Typography>

                  <Typography
                    sx={{
                      color: '#0A1429',
                      fontSize: '22px',
                      fontWeight: 700,
                      lineHeight: '120%'
                    }}
                  >
                    {user.ip}
                  </Typography>
                </div>
              </div>
            </BoxCustom>
          </div>
          <div className='lg:col-span-3'>
            <BoxCustom>
              <Typography
                sx={{
                  color: '#808080',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '160%'
                }}
              >
                Người dùng
              </Typography>
              <div className='flex items-center justify-between flex-row'>
                <Typography
                  sx={{
                    color: '#0A1429',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '120%'
                  }}
                >
                  2.342
                </Typography>
                <CustomIconButton aria-label='capture screenshot' color='success' variant='tonal'>
                  <User size={16} />
                </CustomIconButton>
              </div>
            </BoxCustom>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <BoxCustom>
              <Typography
                sx={{
                  color: '#808080',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '160%'
                }}
              >
                Số dư
              </Typography>
              <div className='flex items-center justify-between flex-row'>
                <Typography
                  sx={{
                    color: '#0A1429',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '120%'
                  }}
                >
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    user.total_amount ?? 0
                  )}
                </Typography>
                <CustomIconButton aria-label='capture screenshot' color='secondary' variant='tonal'>
                  <Wallet size={16} />
                </CustomIconButton>
              </div>
            </BoxCustom>
          </div>

          <div>
            <BoxCustom>
              <Typography
                sx={{
                  color: '#808080',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '160%'
                }}
              >
                Cổng Proxy
              </Typography>
              <div className='flex items-center justify-between flex-row'>
                <Typography
                  sx={{
                    color: '#0A1429',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '120%'
                  }}
                >
                  2.001
                </Typography>
                <CustomIconButton aria-label='capture screenshot' color='success' variant='tonal'>
                  <EthernetPort size={16} />
                </CustomIconButton>
              </div>
            </BoxCustom>
          </div>

          <div>
            <BoxCustom>
              <Typography
                sx={{
                  color: '#808080',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '160%'
                }}
              >
                Tốc độ
              </Typography>
              <div className='flex items-center justify-between flex-row'>
                <Typography
                  sx={{
                    color: '#0A1429',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '120%'
                  }}
                >
                  1122 Mbps
                </Typography>
                <CustomIconButton aria-label='capture screenshot' color='warning' variant='tonal'>
                  <Zap size={16} />
                </CustomIconButton>
              </div>
            </BoxCustom>
          </div>

          <div>
            <BoxCustom>
              <Typography
                sx={{
                  color: '#808080',
                  fontSize: '15px',
                  fontWeight: 600,
                  lineHeight: '160%'
                }}
              >
                Địa chỉ IP đã dùng
              </Typography>
              <div className='flex items-center justify-between flex-row'>
                <Typography
                  sx={{
                    color: '#0A1429',
                    fontSize: '22px',
                    fontWeight: 700,
                    lineHeight: '120%'
                  }}
                >
                  214.973
                </Typography>
                <CustomIconButton aria-label='capture screenshot' color='info' variant='tonal'>
                  <MapPinHouse size={16} />
                </CustomIconButton>
              </div>
            </BoxCustom>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
          <div className='lg:col-span-6'>
            <div>
              <ProxiesCountry data={vietnamProvinces} />

              <div className='mt-3'>
                <HistoryLoginPage />
              </div>
            </div>
          </div>
          <div className='lg:col-span-4'>
            <UpdateDetail updateHistory={updateHistory} />
          </div>
        </div>
      </div>
    </>
  )
}
