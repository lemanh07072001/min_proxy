import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import useAxiosAuth from '@/hocs/useAxiosAuth'

interface OrderReportParams {
  start: string // DD-MM-YYYY
  end: string // DD-MM-YYYY
  partner_id?: number | null
}

interface OrderDetailParams extends OrderReportParams {
  status?: number | null
}

// ═══════════════════════════════════════════════════════
// Mock data — render charts ngay, API data thay thế sau
// ═══════════════════════════════════════════════════════

const sr = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function generateMockDailyTrend() {
  const items: any[] = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const s = i * 11
    const base = 28 + Math.round(sr(s) * 12)

    items.push({
      date: d.toISOString().split('T')[0],
      total: base,
      total_amount: base * 142_000,
      pending: Math.round(sr(s + 1) * 2),
      processing: Math.round(sr(s + 2)),
      in_use: Math.round(base * 0.18 + sr(s + 3) * 3),
      in_use_partial: Math.round(sr(s + 4) * 0.5),
      expired: Math.round(base * 0.65 + sr(s + 5) * 4),
      failed: Math.round(1 + sr(s + 6) * 2),
      partial_refunded: Math.round(sr(s + 7) * 0.8),
      waiting_refund: 0,
      refunded_all: Math.round(sr(s + 8) * 1.2),
      retry_processing_partial: 0
    })
  }

  return items
}

function generateMockOrders(count = 50) {
  const names = [
    'Tran Minh Hieu', 'Le Thi Phuong', 'Nguyen Duc Anh', 'Pham Hoang Long',
    'Vo Ngoc Mai', 'Dang Quoc Bao', 'Hoang Thi Lan', 'Bui Van Thanh',
    'Do Xuan Truong', 'Ngo Thi Kim', 'Ly Thanh Son', 'Duong Hai Yen',
    'Trinh Quang Minh', 'Ha Thi Ngoc', 'Luu Duc Tai', 'Cao Van Khanh',
    'Tran Thi Huong', 'Phan Duc Manh', 'Le Van Tuan', 'Nguyen Thi Thao'
  ]
  const services = [
    'MktProxy Rotating 30d', 'HomeProxy Static 7d', 'ProxyVN Rotating 30d',
    'ZingProxy Rotating 7d', 'MktProxy Rotating 7d', 'Upproxy Static 30d',
    'HomeProxy Rotating 30d', 'ProxyVN Static 7d'
  ]
  const partners = ['MktProxy', 'HomeProxy', 'ProxyVN', 'ZingProxy', 'Upproxy']
  const statusPool = [
    { s: 4, n: 'expired' }, { s: 2, n: 'in_use' }, { s: 4, n: 'expired' },
    { s: 5, n: 'failed' }, { s: 2, n: 'in_use' }, { s: 4, n: 'expired' },
    { s: 8, n: 'refunded_all' }, { s: 4, n: 'expired' }, { s: 2, n: 'in_use' },
    { s: 6, n: 'partial_refunded' }, { s: 4, n: 'expired' }, { s: 0, n: 'pending' },
    { s: 2, n: 'in_use' }, { s: 5, n: 'failed' }, { s: 4, n: 'expired' },
    { s: 3, n: 'in_use_partial' }, { s: 7, n: 'waiting_refund' }, { s: 9, n: 'retry_processing_partial' }
  ]
  const now = new Date()

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now)
    d.setHours(d.getHours() - i * 2 - Math.round(sr(i * 7) * 5))
    const qty = 1 + Math.round(sr(i * 13) * 9)
    const price = 80_000 + Math.round(sr(i * 17) * 120_000)
    const userId = 20 + Math.round(sr(i * 19) * 200)
    const st = statusPool[i % statusPool.length]
    const ts = d.toISOString().replace(/[-T:]/g, '').slice(2, 14)

    return {
      id: 10300 - i,
      order_code: `ORD-${ts}-${userId}-X${i}Y${i + 1}`,
      user_id: userId, user_name: names[i % names.length],
      service_name: services[i % services.length],
      partner_name: partners[i % partners.length],
      quantity: qty, delivered_quantity: st.s === 5 ? 0 : qty,
      total_amount: qty * price, total_cost: Math.round(qty * price * 0.58),
      status: st.s, status_name: st.n,
      order_type: i % 5 === 0 ? 1 : 0,
      order_type_name: i % 5 === 0 ? 'RENEWAL' : 'BUY',
      parent_order_id: null, proxy_type: i % 3 === 0 ? 'static' : 'rotating',
      created_at: d.toISOString().replace('T', ' ').slice(0, 19),
      expired_at: null
    }
  })
}

export const MOCK_SUMMARY = {
  total_orders: 986,
  total_amount: 140_000_000,
  total_cost: 58_200_000,
  profit: 81_800_000,
  status_breakdown: [
    { status: 0, label: 'pending', count: 3, total_amount: 450_000, total_cost: 0, total_quantity: 3, percent: 0.3 },
    { status: 1, label: 'processing', count: 2, total_amount: 310_000, total_cost: 0, total_quantity: 2, percent: 0.2 },
    { status: 2, label: 'in_use', count: 174, total_amount: 26_100_000, total_cost: 14_350_000, total_quantity: 520, percent: 17.6 },
    { status: 3, label: 'in_use_partial', count: 3, total_amount: 420_000, total_cost: 230_000, total_quantity: 8, percent: 0.3 },
    { status: 4, label: 'expired', count: 756, total_amount: 102_800_000, total_cost: 56_500_000, total_quantity: 2800, percent: 76.7 },
    { status: 5, label: 'failed', count: 25, total_amount: 3_500_000, total_cost: 0, total_quantity: 75, percent: 2.5 },
    { status: 6, label: 'partial_refunded', count: 8, total_amount: 1_200_000, total_cost: 660_000, total_quantity: 24, percent: 0.8 },
    { status: 7, label: 'waiting_refund', count: 2, total_amount: 280_000, total_cost: 0, total_quantity: 4, percent: 0.2 },
    { status: 8, label: 'refunded_all', count: 12, total_amount: 1_680_000, total_cost: 920_000, total_quantity: 36, percent: 1.2 },
    { status: 9, label: 'retry_processing_partial', count: 1, total_amount: 160_000, total_cost: 0, total_quantity: 2, percent: 0.1 }
  ],
  daily_trend: generateMockDailyTrend()
}

export const MOCK_DETAIL = {
  orders: generateMockOrders(50),
}

// ═══════════════════════════════════════════════════════
// Hooks — placeholderData cho render ngay
// ═══════════════════════════════════════════════════════

export const useOrderReportSummary = (params: OrderReportParams, enabled = true) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderReportSummary', params.start, params.end, params.partner_id],
    queryFn: async () => {
      const res = await axiosAuth.get('/order-report/summary', {
        params: {
          start: params.start,
          end: params.end,
          ...(params.partner_id ? { partner_id: params.partner_id } : {})
        }
      })

      return res.data?.data ?? null
    },
    enabled: enabled && !!session?.access_token && !!params.start && !!params.end,
    placeholderData: MOCK_SUMMARY,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useOrderReportDetail = (params: OrderDetailParams, enabled = true) => {
  const { data: session } = useSession() as any
  const axiosAuth = useAxiosAuth()

  return useQuery({
    queryKey: ['orderReportDetail', params.start, params.end, params.partner_id, params.status],
    queryFn: async () => {
      const res = await axiosAuth.get('/order-report/detail', {
        params: {
          start: params.start,
          end: params.end,
          ...(params.partner_id ? { partner_id: params.partner_id } : {}),
          ...(params.status !== null && params.status !== undefined ? { status: params.status } : {}),
          per_page: 100
        }
      })

      return res.data?.data ?? null
    },
    enabled: enabled && !!session?.access_token && !!params.start && !!params.end,
    placeholderData: MOCK_DETAIL,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}
