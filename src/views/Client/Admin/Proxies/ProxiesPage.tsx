'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'

import Image from 'next/image'

import { List, House, RotateCw, Settings2, Search, Copy, Download, CheckCircle, Info } from 'lucide-react'

import Checkbox from '@mui/material/Checkbox'
import LinearProgress from '@mui/material/LinearProgress'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues
} from '@tanstack/react-table'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import Pagination from '@mui/material/Pagination'

// Cache để lưu dữ liệu đã tải
const proxyCache: Record<string, any[]> = {
  static: [],
  rotating: []
}

interface ProxiesPageProps {
  initialData: {
    static: any[]
    rotating: any[]
  }
}

export default function ProxiesPage({ initialData }: ProxiesPageProps) {
  const [activeTab, setActiveTab] = useState<'static' | 'rotating'>('static')
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<any[]>([])

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    partner: false,
    email: false,
    buy_at: false,
    api_key: false,
    cooldown: false
  })

  const [showColumnPopup, setShowColumnPopup] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [hoveredRow, setHoveredRow] = useState<any>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const queryClient = useQueryClient()

  // Initialize cache with initial data
  useEffect(() => {
    if (initialData.static.length > 0 && proxyCache.static.length === 0) {
      proxyCache.static = initialData.static
    }

    if (initialData.rotating.length > 0 && proxyCache.rotating.length === 0) {
      proxyCache.rotating = initialData.rotating
    }
  }, [initialData])

  // React Query for fetching proxies with caching
  const { data: proxyData = [], isLoading, isFetching } = useQuery({
    queryKey: ['proxies', activeTab],
    queryFn: async () => {
      // Return cached data if available
      if (proxyCache[activeTab].length > 0) {
        return proxyCache[activeTab]
      }

      const res = await fetch(`/api/proxies?type=${activeTab}`)
      const data = await res.json()
      const proxies = data?.data ?? []

      // Update cache
      proxyCache[activeTab] = proxies

      return proxies
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false
  })

  // Refresh data
  const refreshData = useCallback(() => {
    proxyCache[activeTab] = []
    queryClient.invalidateQueries({ queryKey: ['proxies', activeTab] })
  }, [activeTab, queryClient])

  // Client-side filtered data based on search value
  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return proxyData

    const searchLower = searchValue.toLowerCase().trim()

    return proxyData.filter((item: any) => {
      // Search by proxy (HTTP)
      const proxy = item?.proxys?.HTTP?.toLowerCase() || ''

      if (proxy.includes(searchLower)) return true

      // Search by partner (id_order_partner, id_proxy_partner)
      const mapping = item?.parent_api_mapping

      if (mapping) {
        const idOrderPartner = mapping.id_order_partner?.toLowerCase() || ''
        const idProxyPartner = String(mapping.id_proxy_partner || '').toLowerCase()

        if (idOrderPartner.includes(searchLower) || idProxyPartner.includes(searchLower)) return true
      }

      // Search by email
      const email = item?.user?.email?.toLowerCase() || ''

      if (email.includes(searchLower)) return true

      // Search by api_key
      const apiKey = item?.api_key?.toLowerCase() || ''

      if (apiKey.includes(searchLower)) return true

      return false
    })
  }, [proxyData, searchValue])

  const handleTabChange = async (type: 'static' | 'rotating') => {
    if (type === activeTab) return

    setActiveTab(type)
    setPagination({ pageIndex: 0, pageSize: 10 })
    setRowSelection({})
    setSearchValue('')
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              size='small'
            />
          </div>
        ),
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Checkbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onChange={row.getToggleSelectedHandler()}
              size='small'
            />
          </div>
        ),
        size: 50
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        id: 'proxy',
        header: 'Proxy',
        size: 350,
        cell: ({ row }: { row: any }) => {
          // Ưu tiên hiển thị proxy từ proxys.HTTP, nếu không có thì hiển thị từ các trường khác
          const proxys = row.original?.proxys

          if (proxys) {
            // Kiểm tra proxys.HTTP trước
            if (proxys.HTTP) return proxys.HTTP

            // Nếu không có HTTP, thử SOCKS5
            if (proxys.SOCKS5 || proxys.SOCK5) return proxys.SOCKS5 || proxys.SOCK5
          }

          // Nếu proxys là string thì trả về luôn
          if (typeof row.original?.proxys === 'string') return row.original.proxys

          // Cuối cùng mới thử api_key (nhưng không hiển thị cho proxy xoay nữa)
          return '-'
        }
      },
      {
        id: 'loaiproxy',
        header: 'Loại Proxy',
        size: 120,
        cell: ({ row }: { row: any }) => row.original?.proxys?.loaiproxy ?? '-'
      },
      {
        id: 'partner',
        header: 'Partner',
        size: 800,
        cell: ({ row }: { row: any }) => {
          const mapping = row.original?.parent_api_mapping

          if (!mapping) return '-'

          const parts = []

          if (mapping.id_order_partner) parts.push(`id_order_partner: ${mapping.id_order_partner}`)
          if (mapping.id_proxy_partner) parts.push(`id_proxy_partner: ${mapping.id_proxy_partner}`)

          return parts.length > 0 ? parts.join(', ') : '-'
        }
      },
      {
        id: 'email',
        header: 'Email',
        size: 250,
        cell: ({ row }: { row: any }) => row.original?.user?.email ?? '-'
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        size: 100
      },
      {
        accessorKey: 'ip_version',
        header: 'IP Version',
        size: 100
      },
      {
        accessorKey: 'buy_at',
        header: 'Buy At',
        size: 150
      },
      {
        accessorKey: 'expired_at',
        header: 'Expired At',
        size: 150
      },
      {
        accessorKey: 'api_key',
        header: 'API Key',
        size: 200
      },
      {
        accessorKey: 'cooldown',
        header: 'Cooldown',
        size: 100
      }
    ],
    []
  )

  const table = useReactTable({
    data: Array.isArray(filteredData) ? filteredData : [],
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting,
      columnVisibility
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  const showLoadingBar = isLoading || isFetching

  // Copy to clipboard function
  const copyToClipboard = useCallback(
    (text: string, field: string) => {
      navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    },
    [setCopiedField]
  )

  // Extract proxy from item (same logic as column cell)
  const getProxyFromItem = useCallback((item: any) => {
    const proxys = item?.proxys

    if (proxys) {
      if (proxys.HTTP) return proxys.HTTP
      if (proxys.SOCKS5 || proxys.SOCK5) return proxys.SOCKS5 || proxys.SOCK5
    }

    if (typeof item?.proxys === 'string') return item.proxys

    return ''
  }, [])

  // Copy proxies function
  const copyProxies = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const proxiesToCopy =
      selectedRows.length > 0
        ? selectedRows.map((row: any) => getProxyFromItem(row.original)).filter(Boolean).join('\n')
        : filteredData.map((item: any) => getProxyFromItem(item)).filter(Boolean).join('\n')

    copyToClipboard(proxiesToCopy, 'proxies')
  }, [table, filteredData, copyToClipboard, getProxyFromItem])

  // Download proxies function
  const downloadProxies = useCallback(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    const proxiesToDownload =
      selectedRows.length > 0
        ? selectedRows.map((row: any) => getProxyFromItem(row.original)).filter(Boolean).join('\n')
        : filteredData.map((item: any) => getProxyFromItem(item)).filter(Boolean).join('\n')

    const blob = new Blob([proxiesToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `proxies-${activeTab}-${new Date().getTime()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [table, filteredData, activeTab, getProxyFromItem])

  // Handle row hover for tooltip
  const handleRowMouseEnter = useCallback((e: React.MouseEvent, rowData: any) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    })
    setHoveredRow(rowData)
  }, [])

  const handleRowMouseLeave = useCallback(() => {
    setHoveredRow(null)
  }, [])

  return (
    <div className='orders-content'>
      <div className='table-container'>
        {/* Tooltip for note */}
        {hoveredRow && hoveredRow.note && (
          <div
            className='fixed z-50 bg-emerald-50 border-2 border-emerald-600 rounded-lg shadow-lg p-4 max-w-md'
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translateY(-50%)',
              wordBreak: 'break-word'
            }}
          >
            <div className='flex items-center gap-2 text-base font-bold text-emerald-700 mb-2'>
              <Info size={18} />
              Ghi chú
            </div>
            <div className='text-sm text-emerald-900' style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.8' }}>
              {hoveredRow.note}
            </div>
          </div>
        )}

        {/* Loading bar at top */}
        {showLoadingBar && (
          <div className='absolute top-0 left-0 right-0 z-50'>
            <LinearProgress color='primary' />
          </div>
        )}

        <div className='table-toolbar'>
          <div className='header-left'>
            <div className='page-icon'>
              <List size={17} />
            </div>
            <div className='flex justify-between align-middle w-full'>
              <h5 className='mb-0 font-semibold'>Danh sách Proxy</h5>
            </div>
          </div>

          {/* Data info */}
          <div className='flex items-center gap-2 text-sm text-slate-500'>
            {proxyData.length > 0 && (
              <span className='bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md'>
                {proxyData.length.toLocaleString()} bản ghi
              </span>
            )}
            <button
              onClick={refreshData}
              disabled={isLoading || isFetching}
              className='p-1.5 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50'
              title='Làm mới dữ liệu'
            >
              <RotateCw size={16} className={isFetching ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4 pt-2.5 px-2.5'>
          <div className='flex gap-2 p-1 bg-slate-100 rounded-xl w-fit'>
            <button
              onClick={() => handleTabChange('static')}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'static'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <House size={18} />
              Proxy Tĩnh
              {proxyCache.static.length > 0 && (
                <span className='text-xs bg-slate-200 px-1.5 py-0.5 rounded'>
                  {proxyCache.static.length.toLocaleString()}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange('rotating')}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                activeTab === 'rotating'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RotateCw size={18} />
              Proxy Xoay
              {proxyCache.rotating.length > 0 && (
                <span className='text-xs bg-slate-200 px-1.5 py-0.5 rounded'>
                  {proxyCache.rotating.length.toLocaleString()}
                </span>
              )}
            </button>
          </div>

          <div className='flex items-center gap-3'>
            {/* Copy and Download buttons */}
            <button
              onClick={copyProxies}
              className='px-3 py-2 text-sm rounded-lg font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors flex items-center gap-1.5'
            >
              {copiedField === 'proxies' ? (
                <>
                  <CheckCircle size={14} />
                  Đã copy
                </>
              ) : (
                <>
                  <Copy size={14} />
                  {Object.keys(rowSelection).length > 0
                    ? `Copy ${Object.keys(rowSelection).length} proxies`
                    : 'Copy tất cả'}
                </>
              )}
            </button>
            <button
              onClick={downloadProxies}
              className='px-3 py-2 text-sm rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-1.5'
            >
              <Download size={14} />
              {Object.keys(rowSelection).length > 0
                ? `Tải ${Object.keys(rowSelection).length} proxies`
                : 'Tải tất cả'}
            </button>

            <div className='relative'>
              <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                placeholder='Tìm kiếm...'
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                className='pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-[200px]'
              />
            </div>

            <div className='relative'>
              <button
                onClick={() => setShowColumnPopup(!showColumnPopup)}
                className='flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all'
              >
                <Settings2 size={16} />
                Cột hiển thị
              </button>

              {showColumnPopup && (
                <>
                  <div className='fixed inset-0 z-10' onClick={() => setShowColumnPopup(false)} />
                  <div className='absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-[200px]'>
                    <div className='p-3 border-b border-slate-100'>
                      <span className='font-medium text-sm text-slate-700'>Chọn cột hiển thị</span>
                    </div>
                    <div className='p-2 max-h-[300px] overflow-y-auto'>
                      {table.getAllLeafColumns().map(column => {
                        if (column.id === 'select') return null

                        return (
                          <label
                            key={column.id}
                            className='flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              checked={column.getIsVisible()}
                              onChange={column.getToggleVisibilityHandler()}
                              className='w-4 h-4 accent-emerald-600'
                            />
                            <span className='text-sm text-slate-600'>
                              {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='table-wrapper overflow-x-auto'>
          <table className='data-table min-w-[800px]'>
            <thead className='table-header'>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      style={{ width: header.getSize(), minWidth: header.getSize() }}
                      className='table-header th whitespace-nowrap'
                      key={header.id}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className='py-10 text-center'>
                    <div className='loader-wrapper'>
                      <div className='loader'>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p className='loading-text'>Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='py-10 text-center'>
                    <div className='flex flex-col items-center justify-center'>
                      <Image src='/images/no-data.png' alt='No data' width={160} height={160} />
                      <p className='mt-4 text-gray-500'>Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr
                    className='table-row'
                    key={row.id}
                    onMouseEnter={(e) => handleRowMouseEnter(e, row.original)}
                    onMouseLeave={handleRowMouseLeave}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td className='table-cell whitespace-nowrap' key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className='pagination-container'>
          <div className='pagination-wrapper'>
            <div className='pagination-info'>
              <div className='page-size-select'>
                <span className='text-sm text-gray'>Kích cỡ trang</span>
                <div className='page-size-select-wrapper'>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      table.setPageSize(Number(e.target.value))
                    }}
                    className='page-size-select'
                  >
                    <option value='10'>10</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                  </select>
                  <div className='select-arrow'>
                    <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                      <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                {totalRows > 0 ? (
                  <span>
                    {startRow} - {endRow} của {totalRows} hàng
                  </span>
                ) : (
                  <span>Không có dữ liệu</span>
                )}
              </div>
            </div>

            <div className='pagination-buttons'>
              <Pagination
                count={table.getPageCount()}
                shape='rounded'
                variant='outlined'
                color='primary'
                page={table.getState().pagination.pageIndex + 1}
                onChange={(event, page) => {
                  table.setPageIndex(page - 1)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
