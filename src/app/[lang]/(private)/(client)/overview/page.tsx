import type { Metadata } from 'next'

// MUI Imports
import Avatar from '@mui/material/Avatar'

import { Typography } from '@mui/material'

import { EthernetPort, MapPinHouse, User, Wallet, Zap } from 'lucide-react'

import { getServerSession } from 'next-auth/next'

import CustomIconButton from '@core/components/mui/IconButton'
import BoxCustom from '@/components/UI/BoxCustom'
import ProxiesCountry from '@/components/UI/ProxiesCountry'
import UpdateDetail from '@/components/UI/UpdateDetail'
import HistoryLoginPage from '@/views/Client/HistoryLogin/HistoryLoginPage'
import axiosInstance from '@/libs/axios'
import { authOptions } from '@/libs/auth'

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Trang chủ`
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

const totallyNewUpdateHistoryCleaned = [
  {
    date: '25/07/2025 16:16',
    color: 'bg-blue-500',
    updates: [
      'Ra mắt Mô hình AI dự đoán lưu lượng truy cập cao điểm.',
      'Triển khai tính năng Phân bổ tài nguyên tự động cho các cụm máy chủ.',
      'Cập nhật chính sách bảo mật để tuân thủ GDPR mới nhất.',
      'Bắt đầu triển khai mạng lưới CDN toàn cầu.'
    ]
  },
  {
    date: '15/07/2025 15:20',
    color: 'bg-teal-500',
    updates: [
      'Thêm tùy chọn xem báo cáo Chi phí sử dụng theo dự án.',
      'Nâng cấp hệ thống log (ghi nhật ký) với bộ lọc Elasticsearch.'
    ]
  },
  {
    date: '05/07/2025 14:05',
    color: 'bg-pink-500',
    updates: ['Phát hành ứng dụng di động Android phiên bản Alpha công khai.']
  },
  {
    date: '25/06/2025 18:26',
    color: 'bg-yellow-500',
    updates: [
      'Cải thiện cơ chế bảo vệ khỏi các cuộc tấn công DDoS Lớp 7.',
      'Hỗ trợ tích hợp Webhook để thông báo sự kiện tùy chỉnh.'
    ]
  },
  {
    date: '10/06/2025 17:28',
    color: 'bg-yellow-500',
    updates: [
      'Thêm tùy chọn cấu hình Firewall (Tường lửa) cho từng dịch vụ.',
      'Bổ sung tính năng Quản lý khóa API với thời gian hết hạn.'
    ]
  },
  {
    date: '28/05/2025 13:58',
    color: 'bg-red-500',
    updates: ['Khắc phục lỗi tiềm ẩn về rò rỉ bộ nhớ trong dịch vụ caching.']
  },

  // -------- 6 mục mới đã được làm sạch --------
  {
    date: '15/05/2025 10:12',
    color: 'bg-blue-500',
    updates: [
      'Triển khai chương trình đối tác liên kết (Affiliate Program).',
      'Cập nhật giao diện trang Thanh toán để thân thiện với người dùng hơn.',
      'Tăng cường bảo mật với việc bắt buộc Xác thực Đa yếu tố (MFA).'
    ]
  },
  {
    date: '02/05/2025 09:40',
    color: 'bg-teal-500',
    updates: [
      'Thêm tùy chọn ngôn ngữ tiếng Anh và tiếng Nhật cho giao diện quản trị.',
      'Tối ưu hóa hiệu suất load biểu đồ trên trình duyệt di động.'
    ]
  },
  {
    date: '18/04/2025 14:05',
    color: 'bg-pink-500',
    updates: ['Ra mắt hệ thống Hỗ trợ Khách hàng 24/7 thông qua Live Chat.']
  },
  {
    date: '04/04/2025 19:20',
    color: 'bg-yellow-500',
    updates: [
      'Hỗ trợ đăng nhập bằng tài khoản Microsoft Azure và Slack.',
      'Cải thiện hiệu suất truy vấn trên API Public lên 40%.'
    ]
  },
  {
    date: '10/03/2025 11:55',
    color: 'bg-yellow-500',
    updates: [
      'Thêm tính năng Quản lý vai trò (RBAC) cho các dự án lớn.',
      'Cập nhật thư viện front-end lên phiên bản mới nhất.'
    ]
  },
  {
    date: '25/01/2025 08:33',
    color: 'bg-red-500',
    updates: ['Sửa lỗi khiến thanh cuộn (scroll bar) bị ẩn trên một số hệ điều hành Linux.']
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
  const session = await getServerSession(authOptions)

  if (!session.access_token) return null
  const user = await getUser(session.access_token)

  return (
    <>
      <div className='grid  gap-4'>
        <div className='grid grid-cols-1 lg:grid-cols-10 gap-4'>
          <div className='lg:col-span-7'>
            <BoxCustom>
              <div className='flex items-center h-full'>
                <Avatar
                  src={session?.user?.avatar ? session?.user?.avatar : '/images/avatars/1.png'}
                  alt='Victor Anderson'
                />
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
            <UpdateDetail updateHistory={totallyNewUpdateHistoryCleaned} />
          </div>
        </div>
      </div>
    </>
  )
}
