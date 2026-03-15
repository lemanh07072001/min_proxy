import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Fallback danh sách quốc gia phổ biến có proxy
const POPULAR_COUNTRIES = [
  { code: 'VN', name: 'Việt Nam' },
  { code: 'US', name: 'Hoa Kỳ' },
  { code: 'JP', name: 'Nhật Bản' },
  { code: 'KR', name: 'Hàn Quốc' },
  { code: 'SG', name: 'Singapore' },
  { code: 'TH', name: 'Thái Lan' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'IN', name: 'Ấn Độ' },
  { code: 'TW', name: 'Đài Loan' },
  { code: 'HK', name: 'Hồng Kông' },
  { code: 'CN', name: 'Trung Quốc' },
  { code: 'GB', name: 'Anh' },
  { code: 'DE', name: 'Đức' },
  { code: 'FR', name: 'Pháp' },
  { code: 'IT', name: 'Ý' },
  { code: 'ES', name: 'Tây Ban Nha' },
  { code: 'NL', name: 'Hà Lan' },
  { code: 'RU', name: 'Nga' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Úc' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'TR', name: 'Thổ Nhĩ Kỳ' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Ả Rập Saudi' },
  { code: 'IL', name: 'Israel' },
  { code: 'ZA', name: 'Nam Phi' },
  { code: 'PL', name: 'Ba Lan' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'SE', name: 'Thụy Điển' },
  { code: 'CH', name: 'Thụy Sĩ' },
  { code: 'AT', name: 'Áo' },
  { code: 'CZ', name: 'Séc' },
  { code: 'RO', name: 'Romania' },
  { code: 'PT', name: 'Bồ Đào Nha' },
  { code: 'NO', name: 'Na Uy' },
  { code: 'DK', name: 'Đan Mạch' },
  { code: 'FI', name: 'Phần Lan' },
]

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/countries')

        const data = res?.data?.data

        // Nếu API trả ít hơn 5 → merge với POPULAR_COUNTRIES
        if (!data || data.length < 5) return POPULAR_COUNTRIES

        return data
      } catch {
        return POPULAR_COUNTRIES
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    placeholderData: POPULAR_COUNTRIES,
  })
}

export { POPULAR_COUNTRIES }
