// FILE: Partner.jsx

import { PartnerCard } from '@components/UI/PartnerCard'

// Cấu trúc dữ liệu
interface StaticPartner {
  id: number
  name: string
  description: string[] // Vẫn là mảng string
  logoUrl: string
  subtitle: string
}

// --- DANH SÁCH ĐỐI TÁC CỐ ĐỊNH (Đã CHẮC CHẮN 3 DÒNG) ---
const staticPartners: StaticPartner[] = [
  {
    id: 1,
    name: 'Viettel Telecom',
    subtitle: 'Tập đoàn Công nghiệp - Viễn thông Quân đội.',
    description: [
      'Đối tác cung cấp hạ tầng mạng lớn nhất Việt Nam, đảm bảo kết nối ổn định.',
      'Dẫn đầu về công nghệ 5G và giải pháp số cho doanh nghiệp.'
    ],
    logoUrl: '/images/partnets/viettel.webp'
  },
  {
    id: 2,
    name: 'FPT Telecom',
    subtitle: 'Công ty Cổ phần Viễn thông FPT.',
    description: [
      'Đơn vị tiên phong cung cấp dịch vụ Internet tốc độ cao và Truyền hình thông minh.',
      'Hỗ trợ khách hàng 24/7 và hệ sinh thái công nghệ đa dạng.'
    ],
    logoUrl: '/images/partnets/fpt.webp'
  },
  {
    id: 3,
    name: 'VNPT',
    subtitle: 'Tập đoàn Bưu chính Viễn thông Việt Nam.',
    description: [
      'Cung cấp các giải pháp viễn thông và CNTT toàn diện cho chính phủ và doanh nghiệp.',
      'Mạng lưới phủ sóng rộng khắp, đảm bảo kết nối liên tục trên toàn quốc.' // Dòng 3
    ],
    logoUrl: '/images/partnets/vnpt.webp'
  }
]

export default function Partner() {
  const partners = staticPartners

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {partners.map(partner => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>
    </>
  )
}
