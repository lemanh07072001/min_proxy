import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import useAxiosAuth from '@/hocs/useAxiosAuth'

export interface DailyTrendItem {
  date: string
  revenue: number
  cost: number
  refunded: number
  profit: number
  orders: number
  deposits: number
  deposit_count: number
}

export interface OrderStatusItem {
  status: number
  label: string
  count: number
  total_amount: number
}

export interface PartnerBreakdownItem {
  partner_id: number
  partner_name: string
  order_count: number
  total_amount: number
  cost_actual: number
  profit: number
  margin_percent: number
}

export interface ReconciliationData {
  deposits_total: number
  deposit_auto: number
  deposit_manual: number
  deposit_auto_count: number
  deposit_manual_count: number
  affiliate: number
  purchases_total: number
  refunds: number
  refund_count: number
  balance_expected: number
  balance_actual: number
  diff: number
  is_balanced: boolean
  is_all_time: boolean
}

export interface FinancialReportData {
  period_days: number
  revenue: {
    confirmed: number
    expected: number
    refunded: number
    cost_actual: number
    affiliate_cost: number
    profit: number
    margin_percent: number
  }
  deposits: {
    deposit_auto: number
    deposit_auto_count: number
    deposit_manual: number
    deposit_manual_count: number
    payment_total: number
    payment_count: number
    refund_total: number
    refund_count: number
    affiliate_withdrawn: number
  }
  orders: {
    total: number
    by_status: OrderStatusItem[]
    buy: number
    renewal: number
  }
  partner_breakdown: PartnerBreakdownItem[]
  daily_trend: DailyTrendItem[]
}

// ═══════════════════════════════════════════════════════
// Mock data — hiển thị ngay khi load, API data thay thế sau
// Số liệu mô phỏng 30 ngày kinh doanh proxy reselling
// ═══════════════════════════════════════════════════════

/** Deterministic pseudo-random (cùng seed → cùng kết quả) */
const sr = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280

  
return x - Math.floor(x)
}

function generateMockTrend(): DailyTrendItem[] {
  const items: DailyTrendItem[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)

    d.setDate(d.getDate() - i)
    const isWe = d.getDay() === 0 || d.getDay() === 6

    // Xu hướng tăng nhẹ + cuối tuần giảm + biến động ngẫu nhiên
    const growth = 1 + (30 - i) * 0.006
    const wkFactor = isWe ? 0.75 : 1.0
    const variance = 0.85 + sr(i) * 0.3

    const revenue = Math.round(3_600_000 * growth * wkFactor * variance)
    const cost = Math.round(revenue * (0.53 + sr(i + 100) * 0.08))
    const refunded = Math.round(revenue * 0.03 * sr(i + 200))
    const orders = Math.round((revenue / 142_000) * (0.9 + sr(i + 300) * 0.2))
    const deposits = Math.round(revenue * (1.1 + sr(i + 400) * 0.2))
    const depositCount = Math.round((deposits / 400_000) * (0.85 + sr(i + 500) * 0.3))

    items.push({
      date: d.toISOString().split('T')[0],
      revenue,
      cost,
      refunded,
      profit: revenue - cost - refunded,
      orders,
      deposits,
      deposit_count: depositCount
    })
  }

  return items
}

/**
 * Mock Financial Report — câu chuyện 30 ngày:
 *
 * - Lợi nhuận 40.1M, margin 39.6% → kinh doanh lành mạnh
 * - Pipeline 26.8M → doanh thu sắp xác nhận khi đơn hết hạn
 * - 986 đơn: 78% mua mới, 22% gia hạn → khách quay lại
 * - MktProxy margin 53% (cash cow), Upproxy 24% (cần negotiate)
 * - Fail rate 2.5%, refund rate 4.3% → chất lượng dịch vụ tốt
 * - Dòng tiền dương: nạp 125.7M > chi 95.2M
 *
 * Quyết định chiến lược dựa trên data:
 * - Margin >35%: có room cho marketing spend
 * - Renewal 22%: cần chương trình giữ chân (loyalty, discount gia hạn)
 * - Partner margin <25%: negotiate giá hoặc chuyển traffic
 * - Trend tăng: đang phát triển, duy trì momentum
 */
export const MOCK_FINANCIAL: FinancialReportData = {
  period_days: 30,

  // Doanh thu: confirmed (terminal orders) vs expected (active orders)
  // profit = confirmed - refunded - cost_actual - affiliate_cost
  // = 105,500,000 - 4,350,000 - 58,200,000 - 2,850,000 = 40,100,000
  // margin = 40,100,000 / (105,500,000 - 4,350,000) = 39.6%
  revenue: {
    confirmed: 105_500_000,
    expected: 26_800_000,
    refunded: 4_350_000,
    cost_actual: 58_200_000,
    affiliate_cost: 2_850_000,
    profit: 40_100_000,
    margin_percent: 39.6
  },

  // Dòng tiền: nạp (vào) vs mua proxy (ra) vs hoàn (vào)
  deposits: {
    deposit_auto: 118_500_000,
    deposit_auto_count: 285,
    deposit_manual: 7_200_000,
    deposit_manual_count: 4,
    payment_total: 95_200_000,
    payment_count: 812,
    refund_total: 4_350_000,
    refund_count: 16,
    affiliate_withdrawn: 1_950_000
  },

  // Đơn hàng: 10 trạng thái + mua mới/gia hạn
  orders: {
    total: 986,
    by_status: [
      { status: 0, label: 'pending', count: 3, total_amount: 450_000 },
      { status: 1, label: 'processing', count: 2, total_amount: 310_000 },
      { status: 2, label: 'in_use', count: 174, total_amount: 26_100_000 },
      { status: 3, label: 'in_use_partial', count: 3, total_amount: 420_000 },
      { status: 4, label: 'expired', count: 756, total_amount: 102_800_000 },
      { status: 5, label: 'failed', count: 25, total_amount: 3_500_000 },
      { status: 6, label: 'partial_refunded', count: 8, total_amount: 1_200_000 },
      { status: 7, label: 'waiting_refund', count: 2, total_amount: 280_000 },
      { status: 8, label: 'refunded_all', count: 12, total_amount: 1_680_000 },
      { status: 9, label: 'retry_processing', count: 1, total_amount: 160_000 }
    ],
    buy: 768,
    renewal: 218
  },

  // Hiệu suất partner — sắp xếp theo profit giảm dần
  // Manager dùng để quyết định phân bổ traffic + negotiate giá
  partner_breakdown: [
    {
      partner_id: 1,
      partner_name: 'MktProxy',
      order_count: 390,
      total_amount: 54_200_000,
      cost_actual: 23_800_000,
      profit: 28_200_000,
      margin_percent: 53.2
    },
    {
      partner_id: 2,
      partner_name: 'HomeProxy',
      order_count: 245,
      total_amount: 37_500_000,
      cost_actual: 19_200_000,
      profit: 16_100_000,
      margin_percent: 44.3
    },
    {
      partner_id: 3,
      partner_name: 'ProxyVN',
      order_count: 185,
      total_amount: 24_300_000,
      cost_actual: 14_500_000,
      profit: 8_600_000,
      margin_percent: 37.0
    },
    {
      partner_id: 4,
      partner_name: 'ZingProxy',
      order_count: 102,
      total_amount: 14_800_000,
      cost_actual: 9_800_000,
      profit: 4_200_000,
      margin_percent: 29.6
    },
    {
      partner_id: 5,
      partner_name: 'Upproxy',
      order_count: 64,
      total_amount: 11_200_000,
      cost_actual: 8_100_000,
      profit: 2_500_000,
      margin_percent: 23.8
    }
  ],

  daily_trend: generateMockTrend()
}

/**
 * Mock Reconciliation — đối soát tài chính
 * balance_expected = deposits + affiliate - purchases + refunds
 * = 125,700,000 + 1,950,000 - 95,200,000 + 4,350,000 = 36,800,000
 * Chênh lệch 150K → cần kiểm tra nhưng không nghiêm trọng
 */
export const MOCK_RECONCILIATION: ReconciliationData = {
  deposits_total: 125_700_000,
  deposit_auto: 118_500_000,
  deposit_manual: 7_200_000,
  deposit_auto_count: 285,
  deposit_manual_count: 4,
  affiliate: 1_950_000,
  purchases_total: 95_200_000,
  refunds: 4_350_000,
  refund_count: 16,
  balance_expected: 36_800_000,
  balance_actual: 36_650_000,
  diff: 150_000,
  is_balanced: false,
  is_all_time: true
}

// ═══════════════════════════════════════════════════════
// Hooks — placeholderData cho render ngay lập tức (0ms)
// ═══════════════════════════════════════════════════════

interface FinancialReportParams {
  start?: string // dd-mm-yyyy
  end?: string // dd-mm-yyyy
}

export const useFinancialReport = (params?: FinancialReportParams) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery<FinancialReportData | null>({
    queryKey: ['financialReport', params?.start, params?.end],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/financial-report', { params })

      
return res.data?.data ?? null
    },
    enabled: !!session?.access_token,
    placeholderData: MOCK_FINANCIAL,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useReconciliation = (params?: FinancialReportParams) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery<ReconciliationData | null>({
    queryKey: ['reconciliation', params?.start, params?.end],
    queryFn: async () => {
      const res = await axiosAuth.get('/admin/reconciliation', { params })

      
return res.data?.data ?? null
    },
    enabled: !!session?.access_token,
    placeholderData: MOCK_RECONCILIATION,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}
