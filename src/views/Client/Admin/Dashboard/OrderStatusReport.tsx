'use client'

import { useState, useMemo } from 'react'

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Grid2, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { BarChart3, List } from 'lucide-react'

import { useOrderReportDetail, MOCK_DETAIL } from '@/hooks/apis/useOrderReport'
import { usePartners } from '@/hooks/apis/usePartners'
import { formatCurrency, formatNumber } from '@/utils/formatters'

const STATUS_KEY: Record<number, string> = {
  0: 'pending', 1: 'processing', 2: 'in_use', 3: 'in_use_partial',
  4: 'expired', 5: 'failed', 6: 'partial_refunded', 7: 'waiting_refund',
  8: 'refunded_all', 9: 'retry_processing_partial'
}

const STATUS_CONFIG: Record<number, { label: string; color: string }> = {
  0: { label: 'Chờ xử lý', color: '#94A3B8' },
  1: { label: 'Đang xử lý', color: '#3B82F6' },
  2: { label: 'Đang dùng', color: '#22C55E' },
  3: { label: 'Dùng (thiếu proxy)', color: '#F59E0B' },
  4: { label: 'Hết hạn', color: '#6366F1' },
  5: { label: 'Thất bại', color: '#EF4444' },
  6: { label: 'Hoàn 1 phần', color: '#F97316' },
  7: { label: 'Chờ hoàn tiền', color: '#A855F7' },
  8: { label: 'Đã hoàn toàn bộ', color: '#EC4899' },
  9: { label: 'Đang mua bù', color: '#14B8A6' },
}

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  
return `${day}-${month}-${year}`
}

interface OrderStatusReportProps {
  filterStart?: string // dd-mm-yyyy
  filterEnd?: string
}

export default function OrderStatusReport({ filterStart, filterEnd }: OrderStatusReportProps) {
  const startDate = filterStart || formatDate((() => { const d = new Date();

 d.setDate(d.getDate() - 7); 

return d })())

  const endDate = filterEnd || formatDate(new Date())
  const [partnerId, setPartnerId] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [clientPage, setClientPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const { data: partners } = usePartners()

  const detailParams = useMemo(() => ({
    start: startDate,
    end: endDate,
    partner_id: partnerId,
    status: selectedStatus,
    per_page: 5000,
  }), [startDate, endDate, partnerId, selectedStatus])

  const { data: detailRaw, isFetching: detailFetching } = useOrderReportDetail(detailParams)
  const allOrders: any[] = (detailRaw?.orders?.length > 0) ? detailRaw.orders : MOCK_DETAIL.orders

  // Client-side pagination
  const totalOrders = allOrders.length
  const lastPage = Math.max(1, Math.ceil(totalOrders / perPage))

  const paginatedOrders = useMemo(() => {
    const start = (clientPage - 1) * perPage

    return allOrders.slice(start, start + perPage)
  }, [allOrders, clientPage, perPage])

  // Tổng hợp status_breakdown từ orders
  const statusBreakdown = useMemo(() => {
    const groups: Record<number, { status: number; count: number; total_amount: number; total_quantity: number }> = {}

    allOrders.forEach((o: any) => {
      const s = Number(o.status)

      if (!groups[s]) groups[s] = { status: s, count: 0, total_amount: 0, total_quantity: 0 }
      groups[s].count++
      groups[s].total_amount += o.total_amount || 0
      groups[s].total_quantity += o.quantity || 0
    })

    return Object.values(groups).sort((a, b) => a.status - b.status)
  }, [allOrders])

  // Tổng hợp daily_trend từ orders
  const dailyTrend = useMemo(() => {
    const groups: Record<string, any> = {}

    allOrders.forEach((o: any) => {
      const date = o.created_at?.slice(0, 10)

      if (!date) return
      if (!groups[date]) {
        groups[date] = { date, total: 0, total_amount: 0 }
        Object.values(STATUS_KEY).forEach(k => { groups[date][k] = 0 })
      }
      groups[date].total++
      groups[date].total_amount += o.total_amount || 0
      const key = STATUS_KEY[Number(o.status)]

      if (key) groups[date][key]++
    })

    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date))
  }, [allOrders])

  // Pie chart data
  const pieData = useMemo(() => statusBreakdown
    .filter(s => s.count > 0)
    .map(s => ({
      name: STATUS_CONFIG[s.status]?.label ?? String(s.status),
      value: s.count,
      status: s.status,
      color: STATUS_CONFIG[s.status]?.color ?? '#94A3B8',
      total_amount: s.total_amount,
    })), [statusBreakdown])

  // Bar chart data
  const barData = useMemo(() => dailyTrend.map(d => ({
    date: d.date.slice(5), // MM-DD
    ...d,
  })), [dailyTrend])

  const handlePieClick = (data: any) => {
    if (data?.status !== undefined) {
      setSelectedStatus(prev => prev === data.status ? null : data.status)
      setClientPage(1)
    }
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl'>
        <h2 className='text-2xl font-bold text-white flex items-center gap-2 mb-0'>
          <BarChart3 size={24} />
          Chi Tiết Đơn Hàng Theo Trạng Thái
        </h2>
        <p className='text-purple-100 text-sm mt-1'>Phân bố và xu hướng đơn hàng</p>
      </div>

      {/* Partner + Status filter (date synced from dashboard) */}
      <div className='flex items-center gap-3'>
        <FormControl size='small' sx={{ minWidth: 160 }}>
          <InputLabel>Đối tác</InputLabel>
          <Select
            value={partnerId ?? ''}
            label='Đối tác'
            onChange={e => { setPartnerId(e.target.value === '' ? null : Number(e.target.value)); setClientPage(1) }}
          >
            <MenuItem value=''>Tất cả đối tác</MenuItem>
            {Array.isArray(partners) && partners.map((p: any) => (
              <MenuItem key={p.id} value={p.id}>{p.title || p.partner_code}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedStatus !== null && (
          <button
            onClick={() => { setSelectedStatus(null); setClientPage(1) }}
            className='text-sm text-purple-600 hover:text-purple-800 underline'
          >
            Bỏ lọc: {STATUS_CONFIG[selectedStatus]?.label}
          </button>
        )}
      </div>

      <div className={`space-y-4 transition-opacity duration-300 ${detailFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {/* Charts */}
          <Grid2 container spacing={3}>
            {/* Pie Chart */}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <div className='bg-white rounded-xl shadow-lg p-4'>
                <h3 className='text-sm font-semibold text-gray-700 mb-3'>Phân Bố Theo Trạng Thái</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        dataKey='value'
                        onClick={handlePieClick}
                        style={{ cursor: 'pointer' }}
                      >
                        {pieData.map((entry: any, idx: number) => (
                          <Cell
                            key={idx}
                            fill={entry.color}
                            stroke={selectedStatus === entry.status ? '#000' : 'none'}
                            strokeWidth={selectedStatus === entry.status ? 2 : 0}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${formatNumber(value)} đơn (${formatCurrency(props.payload.total_amount)})`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className='text-gray-400 text-center py-12'>Không có dữ liệu</p>
                )}
              </div>
            </Grid2>

            {/* Bar Chart */}
            <Grid2 size={{ xs: 12, md: 7 }}>
              <div className='bg-white rounded-xl shadow-lg p-4'>
                <h3 className='text-sm font-semibold text-gray-700 mb-3'>Trend Theo Ngày</h3>
                {barData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='date' fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='expired' name='Hết hạn' stackId='a' fill={STATUS_CONFIG[4].color} />
                      <Bar dataKey='in_use' name='Đang dùng' stackId='a' fill={STATUS_CONFIG[2].color} />
                      <Bar dataKey='failed' name='Thất bại' stackId='a' fill={STATUS_CONFIG[5].color} />
                      <Bar dataKey='pending' name='Chờ xử lý' stackId='a' fill={STATUS_CONFIG[0].color} />
                      <Bar dataKey='refunded_all' name='Đã hoàn' stackId='a' fill={STATUS_CONFIG[8].color} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className='text-gray-400 text-center py-12'>Không có dữ liệu</p>
                )}
              </div>
            </Grid2>
          </Grid2>

          {/* Detail Table */}
          <div className='bg-white rounded-xl shadow-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-sm font-semibold text-gray-700 flex items-center gap-2 mb-0'>
                <List size={16} />
                Chi Tiết Đơn Hàng
                {selectedStatus !== null && (
                  <span className='text-xs px-2 py-0.5 rounded-full text-white' style={{ backgroundColor: STATUS_CONFIG[selectedStatus]?.color }}>
                    {STATUS_CONFIG[selectedStatus]?.label}
                  </span>
                )}
              </h3>
              <div className='flex items-center gap-3'>
                <Select
                  size='small'
                  value={perPage}
                  onChange={e => { setPerPage(Number(e.target.value)); setClientPage(1) }}
                  sx={{ fontSize: 12, height: 28 }}
                >
                  {[10, 20, 50, 100].map(n => (
                    <MenuItem key={n} value={n} sx={{ fontSize: 12 }}>{n}/trang</MenuItem>
                  ))}
                </Select>
                <span className='text-xs text-gray-500'>
                  {formatNumber(totalOrders)} đơn
                </span>
              </div>
            </div>

              <TableContainer component={Paper} variant='outlined'>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Mã đơn</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Dịch vụ</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>SL</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Tổng tiền</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Ngày tạo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedOrders.length > 0 ? paginatedOrders.map((order: any) => (
                        <TableRow key={order.id} hover>
                          <TableCell sx={{ fontSize: 12 }}>{order.order_code}</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{order.user_name} (#{order.user_id})</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{order.service_name}</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{order.quantity}</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{formatCurrency(order.total_amount)}</TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            <span
                              className='text-xs px-2 py-0.5 rounded-full text-white'
                              style={{ backgroundColor: STATUS_CONFIG[order.status]?.color ?? '#94A3B8' }}
                            >
                              {STATUS_CONFIG[order.status]?.label ?? order.status_name}
                            </span>
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{order.created_at?.slice(0, 16)}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} align='center' sx={{ py: 4, color: '#9CA3AF' }}>
                            Không có đơn hàng
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {lastPage > 1 && (
                  <div className='flex justify-center mt-3'>
                    <Pagination
                      count={lastPage}
                      page={clientPage}
                      onChange={(_, page) => setClientPage(page)}
                      color='primary'
                      size='small'
                    />
                  </div>
                )}
          </div>
      </div>
    </div>
  )
}
