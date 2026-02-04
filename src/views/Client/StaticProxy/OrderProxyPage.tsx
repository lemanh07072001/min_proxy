'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import { Copy, CircleQuestionMark, BadgeCheck, BadgeMinus, Clock, Clock3, List, Download, Loader } from 'lucide-react'

import Button from '@mui/material/Button'

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel // Thêm để lọc hàng đã chọn
} from '@tanstack/react-table'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'

import './stylesOrder.css'
import Pagination from '@mui/material/Pagination'

import Checkbox from '@mui/material/Checkbox'

import { FormControlLabel } from '@mui/material'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { io } from 'socket.io-client'

import { formatDateTimeLocal } from '@/utils/formatDate'
import { useCopy } from '@/app/hooks/useCopy'

import useAxiosAuth from '@/hooks/useAxiosAuth'
import CustomTextField from '@/@core/components/mui/TextField'

export default function OrderProxyPage() {
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({}) // State để lưu các hàng được chọn
  const [sorting, setSorting] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all') // State để lọc theo status
  const [typeFilter, setTypeFilter] = useState<string>('all') // State để lọc theo loại

  // State cho selection với Shift/Ctrl và Drag
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const axiosAuth = useAxiosAuth()
  const [isCopied, copy] = useCopy()
  const queryClient = useQueryClient()

  const {
    data: dataOrders = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['orderProxyStatic'],
    queryFn: async () => {
      const res = await axiosAuth.get('/get-order-proxy-static')

      return res.data.data
    },
    staleTime: 30 * 1000, // 30 giây - data không bị coi là stale trong 30 giây
    gcTime: 5 * 60 * 1000, // 5 phút - cache data trong 5 phút
    refetchOnWindowFocus: true, // Refetch khi focus vào window để đảm bảo data mới nhất
    refetchOnMount: true // Refetch khi component mount lại để hiển thị đơn hàng mới
  })

  // Socket: lắng nghe sự kiện để refetch bảng
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://socket.mktproxy.com'

    const socket = io(socketUrl, {
      transports: ['websocket'],
      secure: true
    })

    socket.on('order_completed', data => {
      // Invalidate và refetch có độ trễ nhỏ để chờ backend cập nhật xong
      queryClient.invalidateQueries({ queryKey: ['orderProxyStatic'] })
      setTimeout(() => {
        void refetch()
      }, 600)
    })

    return () => {
      socket.disconnect()
    }
  }, [refetch, queryClient])

  // Lọc dữ liệu theo status và loại
  const filteredData = useMemo(() => {
    let filtered = dataOrders

    // Filter theo status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item: any) => item.status === statusFilter)
    }

    // Filter theo loại
    if (typeFilter !== 'all') {
      filtered = filtered.filter((item: any) => {
        const proxys = item.proxys || {}
        const keys = Object.keys(proxys)
        const firstKey = keys[0]?.toLowerCase()

        return firstKey === typeFilter.toLowerCase()
      })
    }

    return filtered
  }, [dataOrders, statusFilter, typeFilter])

  // Reset row selection khi filter thay đổi
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setRowSelection({}) // Reset selection khi filter thay đổi
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    setRowSelection({}) // Reset selection khi filter thay đổi
  }

  // Xử lý khi bắt đầu mousedown
  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift + Click: Chọn liên tục từ lastSelectedIndex đến index hiện tại
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)

      const newSelection: Record<string, boolean> = { ...rowSelection }

      for (let i = start; i <= end; i++) {
        newSelection[i] = true
      }

      setRowSelection(newSelection)
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + Click: Toggle chọn/bỏ chọn hàng hiện tại
      const newSelection = { ...rowSelection }

      if (newSelection[index]) {
        delete newSelection[index]
      } else {
        newSelection[index] = true
      }

      setRowSelection(newSelection)
      setLastSelectedIndex(index)
    } else {
      // Click/Drag thường: Bắt đầu drag hoặc chọn hàng
      setIsDragging(true)
      setDragStartIndex(index)
      setRowSelection({ [index]: true })
      setLastSelectedIndex(index)
    }
  }

  // Xử lý khi di chuyển chuột (drag selection)
  const handleMouseEnter = (index: number) => {
    if (isDragging && dragStartIndex !== null) {
      const start = Math.min(dragStartIndex, index)
      const end = Math.max(dragStartIndex, index)

      const newSelection: Record<string, boolean> = {}

      for (let i = start; i <= end; i++) {
        newSelection[i] = true
      }

      setRowSelection(newSelection)
      setLastSelectedIndex(index)
    }
  }

  // Xử lý khi thả chuột
  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStartIndex(null)
  }

  // Thêm event listener cho mouseup
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label='Đang hoạt động' size='small' icon={<BadgeCheck />} color='success' />
      case 'EXPRIRED':
        return <Chip label='Hết hạn' size='small' icon={<BadgeMinus />} color='error' />
      default:
        return <Chip label='Không xác định' size='small' icon={<CircleQuestionMark />} color='secondary' />
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: { table: any }) => {
          const currentPageRows = table.getRowModel().rows
          const allPageRowsSelected = currentPageRows.every((row: any) => row.getIsSelected())
          const somePageRowsSelected = currentPageRows.some((row: any) => row.getIsSelected())

          const handleToggleAllPageRows = () => {
            if (allPageRowsSelected) {
              // Bỏ chọn tất cả hàng trên trang hiện tại
              const newSelection = { ...rowSelection }

              currentPageRows.forEach((row: any) => {
                delete newSelection[row.index]
              })
              setRowSelection(newSelection)
            } else {
              // Chọn tất cả hàng trên trang hiện tại
              const newSelection = { ...rowSelection }

              currentPageRows.forEach((row: any) => {
                newSelection[row.index] = true
              })
              setRowSelection(newSelection)
            }
          }

          return (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <FormControlLabel
                sx={{
                  '&.MuiFormControlLabel-root': {
                    margin: 0
                  }
                }}
                control={
                  <Checkbox
                    checked={allPageRowsSelected}
                    indeterminate={!allPageRowsSelected && somePageRowsSelected}
                    onChange={handleToggleAllPageRows}
                  />
                }
                label='' // bỏ label để không chiếm chỗ
              />
            </div>
          )
        },
        cell: ({ row }: { row: any }) => (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControlLabel
              sx={{
                '&.MuiFormControlLabel-root': {
                  margin: 0
                }
              }}
              control={
                <Checkbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  onChange={row.getToggleSelectedHandler()}
                />
              }
              label=''
            />
          </div>
        ),
        size: 60
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60
      },
      {
        accessorKey: 'provider',
        header: 'Nhà mạng',
        cell: ({ row }: { row: any }) => {
          const proxys = row.original.proxys || {} // fallback nếu null
          const loaiproxy = (proxys as any).loaiproxy || <Loader className='animate-spin text-gray-400' size={18} />

          return <span className='text-red'>{loaiproxy}</span>
        },
        size: 140
      },
      {
        accessorKey: 'proxy',
        header: 'Proxy',
        cell: ({ row }: { row: any }) => {
          const proxys = row.original.proxys || {}

          const proxyValues = Object.entries(proxys)
            .filter(([key]) => key !== 'loaiproxy')
            .map(([_, value]) => value)

          const firstProxy = proxyValues[0] as string | undefined

          if (!firstProxy) {
            return (
              <div className='flex items-center gap-1 text-gray-500'>
                <Loader className='animate-spin text-gray-400' size={16} />
                <span className='text-sm italic'>Vui lòng đợi...</span>
              </div>
            )
          }

          return (
            <div className='proxy-cell flex items-center gap-1'>
              <span className='proxy-label text-red-600'>{firstProxy}</span>
              <button
                className='icon-button hover:text-blue-500 transition'
                onClick={() => copy(firstProxy)}
                title='Sao chép proxy'
              >
                <Copy size={14} />
              </button>
            </div>
          )
        },
        size: 350
      },
      {
        accessorKey: 'protocol',
        header: 'Loại',
        cell: ({ row }: { row: any }) => {
          const proxys = row.original.proxys || {} // nếu null hoặc undefined, fallback thành {}
          const keys = Object.keys(proxys)

          return <div className='font-bold'>{keys[0]?.toUpperCase() || '-'}</div>
        },
        size: 80
      },
      {
        accessorKey: 'buyDate',
        header: 'Ngày mua',
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock3 size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.buy_at)}</div>
              </div>
            </>
          )
        },
        size: 200
      },
      {
        accessorKey: 'expiryDate',
        header: 'Ngày hết hạn',
        cell: ({ row }: { row: any }) => {
          return (
            <>
              <div className='d-flex align-items-center  gap-1 '>
                <Clock size={14} />
                <div style={{ marginTop: '2px' }}>{formatDateTimeLocal(row.original.expired_at)}</div>
              </div>
            </>
          )
        },
        size: 200
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }: { row: any }) => {
          return getStatusBadge(row.original.status)
        },
        size: 150
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      rowSelection,
      pagination,
      columnFilters,
      sorting
    },
    enableRowSelection: true, // Bật tính năng chọn hàng
    onRowSelectionChange: setRowSelection, // Cập nhật state khi có thay đổi
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Tùy chọn: cần thiết nếu có bộ lọc
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  // Function để lấy tất cả proxy đã được checked
  const getSelectedProxies = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows

    return selectedRows.map(row => {
      const proxys = row.original.proxys || {}

      const proxyValues = Object.entries(proxys)
        .filter(([key]) => key !== 'loaiproxy')
        .map(([_, value]) => value)

      return {
        id: row.original.id,
        proxy: proxyValues[0] || '-',
        provider: (proxys as any).loaiproxy || '-',
        status: row.original.status
      }
    })
  }

  // Function để copy tất cả proxy đã chọn
  const copySelectedProxies = () => {
    const selectedProxies = getSelectedProxies()
    const proxyList = selectedProxies.map(item => item.proxy).join('\n')

    copy(proxyList)
  }

  // Function để tải xuống proxy đã chọn dưới dạng file .txt
  const downloadSelectedProxies = () => {
    const selectedProxies = getSelectedProxies()

    if (selectedProxies.length === 0) {
      alert('Vui lòng chọn ít nhất một proxy để tải xuống!')

      return
    }

    const proxyList = selectedProxies.map(item => item.proxy).join('\n')
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `proxy-list-${timestamp}.txt`

    // Tạo blob và tải xuống
    const blob = new Blob([proxyList], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className='orders-content'>
        {/* Toolbar */}

        {/* Proxy Table */}
        <div className='table-container'>
          <div className='table-toolbar'>
            <div className='header-left'>
              <div className='page-icon'>
                <List size={17} />
              </div>
              {/* <div>
                <h5 className='mb-0 font-semibold'>Danh sách proxy</h5>
              </div> */}
            </div>
            <div className='d-flex gap-2 align-items-center'>
              {/* Hiển thị số proxy đã chọn */}
              {Object.keys(rowSelection).length > 0 && (
                <span className='text-sm text-gray-600'>Đã chọn: {Object.keys(rowSelection).length} proxy</span>
              )}
              {/* Filter by Status */}
              <div className='status-filter'>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='all'
                  size='small'
                  sx={{
                    width: '200px'
                  }}
                  onChange={e => handleStatusFilterChange(e.target.value)}
                >
                  <MenuItem value={'all'}>Tất cả trạng thái</MenuItem>
                  <MenuItem value={'ACTIVE'}>Đang hoạt động</MenuItem>
                  <MenuItem value={'EXPRIRED'}>Hết hạn</MenuItem>
                </CustomTextField>
              </div>

              {/* Filter by Type */}
              <div className='type-filter'>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='all'
                  size='small'
                  sx={{
                    width: '200px'
                  }}
                  onChange={e => handleTypeFilterChange(e.target.value)}
                >
                  <MenuItem value={'all'}>Tất cả loại</MenuItem>
                  <MenuItem value={'http'}>HTTP</MenuItem>
                  <MenuItem value={'socks5'}>SOCKS5</MenuItem>
                </CustomTextField>
              </div>

              {/* Copy all */}
              <Button
                variant='outlined'
                startIcon={<Copy size={16} />}
                onClick={copySelectedProxies}
                sx={{ minWidth: 'auto' }}
              >
                Copy đã chọn
              </Button>

              {/* Download as TXT */}
              <Button
                variant='contained'
                startIcon={<Download size={16} />}
                onClick={downloadSelectedProxies}
                sx={{ minWidth: 'auto', color: '#fff' }}
                disabled={Object.keys(rowSelection).length === 0}
              >
                Tải xuống .txt
              </Button>
            </div>
          </div>

          <div className='table-container'>
            {/* Table */}
            <div className='table-wrapper'>
              <table className='data-table' style={isLoading || filteredData.length === 0 ? { height: '100%' } : {}}>
                <thead className='table-header'>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th style={{ width: header.getSize() }} className='table-header th' key={header.id}>
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
                    table.getRowModel().rows.map((row, index) => (
                      <tr
                        className='table-row'
                        key={row.id}
                        onMouseDown={e => {
                          // Không trigger selection nếu click vào button, checkbox, hoặc các element tương tác khác
                          const target = e.target as HTMLElement

                          const isInteractiveElement =
                            target.closest('button') ||
                            target.closest('input') ||
                            target.closest('.MuiCheckbox-root') ||
                            target.closest('.MuiIconButton-root')

                          if (!isInteractiveElement) {
                            handleMouseDown(index, e)
                          }
                        }}
                        onMouseEnter={() => handleMouseEnter(index)}
                        style={{
                          cursor: 'pointer',
                          userSelect: 'none',
                          backgroundColor: row.getIsSelected() ? 'rgba(25, 118, 210, 0.08)' : undefined
                        }}
                      >
                        {row.getVisibleCells().map(cell => (
                          <td className='table-cell' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className='pagination-container'>
              <div className='pagination-wrapper'>
                <div className='pagination-info'>
                  <div className='page-size-select'>
                    <span className='text-sm text-gray'>Kích cỡ trang linh</span>
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
                  {/* --- Hiển thị số hàng trên trang hiện tại --- */}
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
      </div>
    </>
  )
}
